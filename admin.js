/*=====================================
MVR PROPERTIES
admin.js - Consolidated and fixed for admin dashboard
=====================================*/

import {
  addProperty,
  uploadImages,
  getProperties,
  deleteProperty,
  updateProperty,
  getProperty
} from "./firebase.js";

// =============================
// DOM Elements (guarded)
// =============================
const propertyForm = document.getElementById("propertyForm");
const imageInput = document.getElementById("images");
const previewSection = document.getElementById("previewSection");
const previewCard = document.getElementById("previewCard");
const publishBtn = document.getElementById("publishBtn");
const previewBtn = document.getElementById("previewBtn");

// Admin lists / search
const adminPropertyList = document.getElementById("adminPropertyList");
const searchInput = document.getElementById("adminSearch");
const searchPropertyBtn = document.getElementById("searchPropertyBtn");

// Stats
const totalProperties = document.getElementById("totalProperties");
const featuredProperties = document.getElementById("featuredProperties");
const availableProperties = document.getElementById("availableProperties");
const soldProperties = document.getElementById("soldProperties");

// Optional preview containers (may be injected if missing)
let imagePreview = document.getElementById("imagePreview");
let mapPreview = document.getElementById("mapPreview");

if(!imagePreview && imageInput && imageInput.parentElement){
  imagePreview = document.createElement("div");
  imagePreview.id = "imagePreview";
  imagePreview.style.display = "flex";
  imagePreview.style.flexWrap = "wrap";
  imagePreview.style.marginTop = "10px";
  imageInput.parentElement.appendChild(imagePreview);
}

if(!mapPreview && document.getElementById("mapLink")){
  mapPreview = document.createElement("div");
  mapPreview.id = "mapPreview";
  mapPreview.style.marginTop = "10px";
  document.getElementById("mapLink").parentElement.appendChild(mapPreview);
}

// =============================
// State
// =============================
let selectedImages = []; // File objects
let allProperties = [];
let editingId = null;

// =============================
// Utilities
// =============================
function showError(message){
  try{ alert("Error: " + message); }catch(e){ console.error(message); }
}

function validatePhone(phone){
  if(!phone) return false;
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function validateMapUrl(url){
  if(!url) return false;
  try{
    const u = url.trim();
    return /google\./i.test(u) && (u.startsWith('http') || u.startsWith('https'));
  }catch(e){
    return false;
  }
}

// Normalize status string for counting
function normalizeStatus(s){
  if(!s) return "";
  return String(s).toLowerCase();
}

// =============================
// Image input handling
// =============================
if(imageInput){
  imageInput.addEventListener("change", (e) => {
    selectedImages = Array.from(e.target.files || []);

    if (selectedImages.length > 10) {
      showError("Maximum 10 images allowed.");
      imageInput.value = "";
      selectedImages = [];
      if(imagePreview) imagePreview.innerHTML = "";
      return;
    }

    // Show previews
    if(imagePreview){
      imagePreview.innerHTML = "";
      selectedImages.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = document.createElement('img');
          img.src = ev.target.result;
          img.style.width = '90px';
          img.style.height = '90px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '8px';
          img.style.margin = '5px';
          imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    }
  });
}

// =============================
// Preview
// =============================
if(previewBtn){
  previewBtn.addEventListener("click", ()=>{
    const title = document.getElementById("title")?.value || "Property Title";
    const price = document.getElementById("price")?.value || "0";
    const location = document.getElementById("location")?.value || "Location";

    if(previewSection && previewCard){
      previewSection.style.display = "block";
      previewCard.innerHTML = `\n        <div class="property-card">\n          <div class="property-content">\n            <h3>${title}</h3>\n            <p>📍 ${location}</p>\n            <h2>₹ ${price}</h2>\n            <p>Preview Mode</p>\n          </div>\n        </div>`;
      window.scrollTo({ top: previewSection.offsetTop, behavior: 'smooth' });
    }
  });
}

// =============================
// Form submit - Add / Edit
// =============================
if(propertyForm){
  propertyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!publishBtn) return;
    publishBtn.disabled = true;
    publishBtn.textContent = 'Publishing...';

    try{
      // Gather values
      const title = document.getElementById('title')?.value?.trim();
      const price = Number(document.getElementById('price')?.value || 0);
      const type = document.getElementById('type')?.value || '';
      const area = document.getElementById('area')?.value || '';
      const facing = document.getElementById('facing')?.value || '';
      const location = document.getElementById('location')?.value || '';
      const description = document.getElementById('description')?.value || '';
      const phone = document.getElementById('phone')?.value || '';
      const whatsapp = document.getElementById('whatsapp')?.value || '';
      const mapLink = document.getElementById('mapLink')?.value || '';
      const status = document.getElementById('status')?.value || '';
      const featured = document.getElementById('featured')?.value === 'true';

      // Basic validation
      if(!title) throw new Error('Please enter property title.');
      if(!price || price <= 0) throw new Error('Please enter a valid price.');
      if(!validatePhone(phone)) throw new Error('Please enter a valid phone number (7-15 digits).');
      if(whatsapp && !validatePhone(whatsapp)) throw new Error('Please enter a valid WhatsApp number (7-15 digits).');
      if(mapLink && !validateMapUrl(mapLink)) throw new Error('Please provide a valid Google Maps URL (must start with http/https and contain google.).');

      // Handle images: upload if new images selected; when editing and no new images, preserve existing
      let images = [];
      if(selectedImages && selectedImages.length > 0){
        images = await uploadImages(selectedImages);
      } else if(editingId){
        // preserve existing images for editing
        try{
          const existing = await getProperty(editingId);
          images = existing.images || [];
        }catch(err){
          images = [];
        }
      }

      const propertyData = {
        title,
        price,
        type,
        area,
        facing,
        location,
        description,
        phone,
        whatsapp,
        map: mapLink,
        status,
        featured,
        images
      };

      if(!editingId){
        await addProperty(propertyData);
        alert('✅ Property Published Successfully!');
      }else{
        await updateProperty(editingId, propertyData);
        alert('✅ Property Updated Successfully!');
      }

      // reset
      propertyForm.reset();
      selectedImages = [];
      if(imagePreview) imagePreview.innerHTML = '';
      if(previewSection) previewSection.style.display = 'none';
      editingId = null;

      // reload
      await loadProperties();

    }catch(err){
      console.error(err);
      showError(err.message || 'Failed to publish property.');
    }finally{
      publishBtn.disabled = false;
      publishBtn.textContent = '🚀 Publish Property';
    }
  });
}

// =============================
// Load & Render Properties
// =============================
async function loadProperties(){
  try{
    allProperties = await getProperties();
    renderProperties(allProperties);
    updateStats(allProperties);
  }catch(err){
    console.error('Load properties failed', err);
    showError('Failed to load properties.');
  }
}

function renderProperties(properties){
  if(!adminPropertyList) return;
  adminPropertyList.innerHTML = '';

  if(!properties || properties.length === 0){
    adminPropertyList.innerHTML = '<p>No Properties Found.</p>';
    return;
  }

  properties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'admin-card';
    const imgSrc = (property.images && property.images[0]) ? property.images[0] : '';

    card.innerHTML = `\n      <img src="${imgSrc}" alt="">\n      <div class="admin-content">\n        <h3>${property.title}</h3>\n        <p>₹ ${property.price}</p>\n        <p>${property.location}</p>\n        <p>Status : ${property.status}</p>\n        <div style="display:flex;gap:8px;margin-top:8px;">\n          <button class="outline-btn editBtn">Edit</button>\n          <button class="gold-btn deleteBtn">Delete</button>\n        </div>\n      </div>`;

    // Edit
    card.querySelector('.editBtn').addEventListener('click', ()=>{
      startEdit(property);
    });

    // Delete
    card.querySelector('.deleteBtn').addEventListener('click', async ()=>{
      const ok = confirm('Delete this property? This action cannot be undone.');
      if(!ok) return;
      try{
        await deleteProperty(property.id);
        await loadProperties();
        alert('✅ Property deleted');
      }catch(err){
        console.error(err);
        showError('Failed to delete property.');
      }
    });

    adminPropertyList.appendChild(card);
  });
}

function updateStats(properties){
  if(!totalProperties) return;
  totalProperties.textContent = properties.length || 0;
  const avail = properties.filter(p=> normalizeStatus(p.status) === 'available').length;
  const sold = properties.filter(p=> normalizeStatus(p.status) === 'sold').length;
  const featured = properties.filter(p=>p.featured===true).length;

  if(availableProperties) availableProperties.textContent = avail;
  if(soldProperties) soldProperties.textContent = sold;
  if(featuredProperties) featuredProperties.textContent = featured;
}

// =============================
// Search
// =============================
if(searchInput){
  searchInput.addEventListener('input', ()=>{
    const q = (searchInput.value || '').toLowerCase().trim();
    if(!q){ renderProperties(allProperties); return; }
    const filtered = allProperties.filter(p => (
      (p.title || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q) ||
      (p.type || '').toLowerCase().includes(q)
    ));
    renderProperties(filtered);
  });
}

if(searchPropertyBtn){
  searchPropertyBtn.addEventListener('click', ()=>{
    const q = (searchInput?.value || '').toLowerCase().trim();
    if(!q){ renderProperties(allProperties); return; }
    const filtered = allProperties.filter(p => (
      (p.title || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q) ||
      (p.type || '').toLowerCase().includes(q)
    ));
    renderProperties(filtered);
  });
}

// =============================
// Edit flow
// =============================
async function startEdit(property){
  try{
    editingId = property.id;
    document.getElementById('title').value = property.title || '';
    document.getElementById('price').value = property.price || '';
    document.getElementById('type').value = property.type || '';
    document.getElementById('area').value = property.area || '';
    document.getElementById('facing').value = property.facing || '';
    document.getElementById('location').value = property.location || '';
    document.getElementById('description').value = property.description || '';
    document.getElementById('phone').value = property.phone || '';
    document.getElementById('whatsapp').value = property.whatsapp || '';
    document.getElementById('mapLink').value = property.map || '';
    document.getElementById('status').value = property.status || '';
    document.getElementById('featured').value = property.featured ? 'true' : 'false';

    // show existing images in preview area
    if(imagePreview){
      imagePreview.innerHTML = '';
      (property.images || []).forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '90px';
        img.style.height = '90px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.margin = '5px';
        imagePreview.appendChild(img);
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }catch(err){
    console.error(err);
    showError('Failed to start edit.');
  }
}

// Expose for other scripts (if any)
window.startEdit = startEdit;

// =============================
// Map preview
// =============================
if(document.getElementById('mapLink')){
  document.getElementById('mapLink').addEventListener('input', (e)=>{
    const url = (e.target.value || '').trim();
    if(mapPreview){
      if(validateMapUrl(url)){
        mapPreview.innerHTML = `<iframe src="${url}" width="100%" height="250" style="border:0;" loading="lazy"></iframe>`;
      }else{
        mapPreview.innerHTML = '';
      }
    }
  });
}

// =============================
// Start
// =============================
loadProperties();