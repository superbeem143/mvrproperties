/*=====================================
MVR PROPERTIES
admin.js
=====================================*/

import { addProperty, uploadImage, getProperties, deleteProperty, getProperty, updateProperty } from "./firebase.js";

// =============================
// DOM Elements
// =============================
const propertyForm = document.getElementById("propertyForm");
const imageInput = document.getElementById("images");
const previewSection = document.getElementById("previewSection");
const previewCard = document.getElementById("previewCard");
const publishBtn = document.getElementById("publishBtn");
const previewBtn = document.getElementById("previewBtn");

const propertyList = document.getElementById("adminPropertyList");
const searchInput = document.getElementById("adminSearch");

const totalProperties = document.getElementById("totalProperties");
const featuredProperties = document.getElementById("featuredProperties");
const availableProperties = document.getElementById("availableProperties");
const soldProperties = document.getElementById("soldProperties");

const imagePreview = document.getElementById("imagePreview");
const mapInput = document.getElementById("mapLink");
const mapPreview = document.getElementById("mapPreview");

// =============================
// State
// =============================
let selectedImages = [];
let allProperties = [];
let editingId = null;
let existingImages = [];

// =============================
// Image validation & preview
// =============================
imageInput.addEventListener("change", (e) => {
  selectedImages = Array.from(e.target.files || []);
  if (selectedImages.length > 10) {
    alert("Maximum 10 images allowed.");
    imageInput.value = "";
    selectedImages = [];
    imagePreview.innerHTML = "";
    return;
  }

  // Render previews efficiently using a document fragment
  imagePreview.innerHTML = "";
  const frag = document.createDocumentFragment();
  selectedImages.forEach(file => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name || 'preview';
    img.className = 'thumb';
    // styling via existing CSS; fallback size classes may exist
    frag.appendChild(img);
  });
  imagePreview.appendChild(frag);
});

// =============================
// Preview current form
// =============================
previewBtn.addEventListener("click", () => {
  const title = document.getElementById("title").value || "Property Title";
  const price = document.getElementById("price").value || "0";
  const location = document.getElementById("location").value || "Location";

  previewSection.style.display = "block";
  previewCard.innerHTML = `\n    <div class="property-card">\n      <div class="property-content">\n        <h3>${title}</h3>\n        <p>📍 ${location}</p>\n        <h2>₹ ${price}</h2>\n        <p>Preview Mode</p>\n      </div>\n    </div>`;
  window.scrollTo({ top: previewSection.offsetTop, behavior: "smooth" });
});

// =============================
// Publish / Update Property
// =============================
propertyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  publishBtn.disabled = true;
  publishBtn.textContent = "Publishing...";

  const phone = document.getElementById("phone").value.trim();
  const whatsapp = document.getElementById("whatsapp").value.trim();
  const mapLink = document.getElementById("mapLink").value.trim();

  const phoneRegex = /^\+?\d{7,15}$/;
  if (phone && !phoneRegex.test(phone)) {
    alert("Please enter a valid phone number (digits only, optional leading '+', 7-15 digits).");
    publishBtn.disabled = false;
    publishBtn.textContent = "🚀 Publish Property";
    return;
  }
  if (whatsapp && !phoneRegex.test(whatsapp)) {
    alert("Please enter a valid WhatsApp number (digits only, optional leading '+', 7-15 digits).\");
    publishBtn.disabled = false;
    publishBtn.textContent = "🚀 Publish Property";
    return;
  }
  if (mapLink) {
    const mapsRegex = /^https?:\/\/(www\.)?(google(\.com|\.[a-z]{2})|maps\.google)\//i;
    if (!mapsRegex.test(mapLink)) {
      alert("Please enter a valid Google Maps URL (it should point to google.com/maps or maps.google).");
      publishBtn.disabled = false;
      publishBtn.textContent = "🚀 Publish Property";
      return;
    }
  }

  try {
    const imageUrls = [];
    if (selectedImages.length > 0) {
      for (const file of selectedImages) {
        try {
          const url = await uploadImage(file);
          imageUrls.push(url);
        } catch (imgErr) {
          console.error('Image upload failed for', file.name, imgErr);
          throw new Error(`Failed to upload image ${file.name}`);
        }
      }
    }

    const payload = {
      title: document.getElementById("title").value.trim(),
      price: Number(document.getElementById("price").value),
      type: document.getElementById("type").value,
      area: document.getElementById("area").value,
      facing: document.getElementById("facing").value,
      location: document.getElementById("location").value,
      description: document.getElementById("description").value,
      phone,
      whatsapp,
      map: mapLink,
      status: document.getElementById("status").value,
      featured: document.getElementById("featured").value === "true"
    };

    if (editingId) {
      // Preserve existing images if no new images uploaded
      payload.images = imageUrls.length > 0 ? imageUrls : existingImages;
      await updateProperty(editingId, payload);
      alert('✅ Property updated successfully!');
      editingId = null;
      existingImages = [];
    } else {
      payload.images = imageUrls;
      await addProperty(payload);
      alert('✅ Property published successfully!');
    }

    propertyForm.reset();
    selectedImages = [];
    imagePreview.innerHTML = '';
    previewSection.style.display = 'none';
    await loadProperties();
  } catch (error) {
    console.error('Publish error:', error);
    alert(`Failed to publish property: ${error.message || 'Unknown error'}`);
  } finally {
    publishBtn.disabled = false;
    publishBtn.textContent = '🚀 Publish Property';
  }
});

// =============================
// Load & Render
// =============================
async function loadProperties() {
  try {
    allProperties = await getProperties();
    renderProperties(allProperties);
    updateStats(allProperties);
  } catch (error) {
    console.error('Failed to load properties:', error);
    alert('Failed to load properties. See console for details.');
  }
}

function renderProperties(properties) {
  if (!Array.isArray(properties) || properties.length === 0) {
    propertyList.innerHTML = '<p>No Properties Found.</p>';
    return;
  }

  const html = properties.map(property => {
    const img = (property.images && property.images[0]) ? property.images[0] : '';
    const title = property.title || '';
    const price = property.price || '';
    const location = property.location || '';
    const status = property.status || '';

    return `\n      <div class="admin-card">\n        <img src="${img}" alt="">\n        <div class="admin-content">\n          <h3>${escapeHtml(title)}</h3>\n          <p>₹ ${escapeHtml(String(price))}</p>\n          <p>${escapeHtml(location)}</p>\n          <p>Status : ${escapeHtml(status)}</p>\n          <div class="admin-actions">\n            <button type="button" onclick="window.editProperty('${property.id}')">Edit</button>\n            <button type="button" onclick="window.previewProperty('${property.id}')">Preview</button>\n            <button type="button" onclick="window.removeProperty('${property.id}')">Delete</button>\n          </div>\n        </div>\n      </div>`;
  }).join('');

  propertyList.innerHTML = html;
}

function updateStats(properties) {
  totalProperties.textContent = properties.length;
  // Count only boolean true
  featuredProperties.textContent = properties.reduce((count, p) => count + (p.featured === true ? 1 : 0), 0);
  availableProperties.textContent = properties.filter(p => (p.status || '').toLowerCase() === 'available').length;
  soldProperties.textContent = properties.filter(p => (p.status || '').toLowerCase() === 'sold').length;
}

// =============================
// Search
// =============================
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = allProperties.filter(p => (p.title || '').toLowerCase().includes(keyword) || (p.location || '').toLowerCase().includes(keyword));
  renderProperties(filtered);
});

// =============================
// Delete
// =============================
window.removeProperty = async (id) => {
  try {
    const ok = confirm('Delete this property? This cannot be undone.');
    if (!ok) return;
    await deleteProperty(id);
    alert('✅ Property deleted.');
    await loadProperties();
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Failed to delete property. See console for details.');
  }
};

// =============================
// Edit
// =============================
window.editProperty = async function (id) {
  try {
    const property = await getProperty(id);
    editingId = id;
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

    existingImages = Array.isArray(property.images) ? property.images.slice() : [];

    // render existing images into imagePreview
    imagePreview.innerHTML = '';
    const frag = document.createDocumentFragment();
    existingImages.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'property image';
      img.className = 'thumb';
      frag.appendChild(img);
    });
    imagePreview.appendChild(frag);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Failed to load property for edit:', error);
    alert('Failed to load property for edit. See console for details.');
  }
};

// =============================
// Preview property from list
// =============================
window.previewProperty = function (id) {
  const property = allProperties.find(p => p.id === id);
  if (!property) {
    alert('Property not found for preview.');
    return;
  }
  const title = property.title || 'Property Title';
  const location = property.location || 'Location';
  const price = property.price || '0';
  previewSection.style.display = 'block';
  previewCard.innerHTML = `\n    <div class="property-card">\n      <div class="property-content">\n        <h3>${escapeHtml(title)}</h3>\n        <p>📍 ${escapeHtml(location)}</p>\n        <h2>₹ ${escapeHtml(String(price))}</h2>\n        <p>Preview Mode</p>\n      </div>\n    </div>`;
  window.scrollTo({ top: previewSection.offsetTop, behavior: 'smooth' });
};

// =============================
// Utilities
// =============================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Start
loadProperties();
