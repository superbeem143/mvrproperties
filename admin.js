/*=====================================
MVR PROPERTIES
admin.js - Part 1
=====================================*/

import {
addProperty,
uploadImage
} from "./firebase.js";

// =============================
// DOM Elements
// =============================

const propertyForm = document.getElementById("propertyForm");

const imageInput = document.getElementById("images");

const previewSection = document.getElementById("previewSection");

const previewCard = document.getElementById("previewCard");

const publishBtn = document.getElementById("publishBtn");

const previewBtn = document.getElementById("previewBtn");

// =============================
// Selected Images
// =============================

let selectedImages = [];

// =============================
// Image Validation
// =============================

imageInput.addEventListener("change", (e) => {

selectedImages = [...e.target.files];

if (selectedImages.length > 10) {

alert("Maximum 10 images allowed.");

imageInput.value = "";

selectedImages = [];

return;

}

});

// =============================
// Preview
// =============================

previewBtn.addEventListener("click", () => {

const title = document.getElementById("title").value;

const price = document.getElementById("price").value;

const location = document.getElementById("location").value;

previewSection.style.display = "block";

previewCard.innerHTML = `

<div class="property-card">

<div class="property-content">

<h3>${title || "Property Title"}</h3>

<p>📍 ${location || "Location"}</p>

<h2>₹ ${price || "0"}</h2>

<p>Preview Mode</p>

</div>

</div>

`;

window.scrollTo({

top: previewSection.offsetTop,

behavior: "smooth"

});

});

// =============================
// Publish Property
// =============================

propertyForm.addEventListener("submit", async (e) => {

e.preventDefault();

publishBtn.disabled = true;

publishBtn.textContent = "Publishing...";

try{

const imageUrls = [];

for(const image of selectedImages){

const url = await uploadImage(image);

imageUrls.push(url);

}

const property = {

title: document.getElementById("title").value,

price: Number(document.getElementById("price").value),

type: document.getElementById("type").value,

area: document.getElementById("area").value,

facing: document.getElementById("facing").value,

location: document.getElementById("location").value,

description: document.getElementById("description").value,

phone: document.getElementById("phone").value,

whatsapp: document.getElementById("whatsapp").value,

map: document.getElementById("mapLink").value,

status: document.getElementById("status").value,

featured:
document.getElementById("featured").value === "true",

images: imageUrls

};

await addProperty(property);

alert("✅ Property Published Successfully!");

propertyForm.reset();

selectedImages = [];

previewSection.style.display = "none";

}catch(error){

console.error(error);

alert("❌ Failed to publish property.");

}finally{

publishBtn.disabled = false;

publishBtn.textContent = "🚀 Publish Property";

}

});
/*=====================================
MVR PROPERTIES
admin.js - Part 2
=====================================*/

import {
getProperties,
deleteProperty
} from "./firebase.js";

// ==========================
// Dashboard Elements
// ==========================

const propertyList = document.getElementById("propertyList");
const searchInput = document.getElementById("searchInput");

const totalProperties = document.getElementById("totalProperties");
const availableProperties = document.getElementById("availableProperties");
const soldProperties = document.getElementById("soldProperties");

let allProperties = [];

// ==========================
// Load Properties
// ==========================

async function loadProperties(){

try{

allProperties = await getProperties();

renderProperties(allProperties);

updateStats(allProperties);

}catch(error){

console.error(error);

}

}

// ==========================
// Render
// ==========================

function renderProperties(properties){

propertyList.innerHTML="";

if(properties.length===0){

propertyList.innerHTML="<p>No Properties Found.</p>";

return;

}

properties.forEach(property=>{

propertyList.innerHTML += `

<div class="admin-card">

<img src="${property.images?.[0] || ''}" alt="">

<div class="admin-content">

<h3>${property.title}</h3>

<p>₹ ${property.price}</p>

<p>${property.location}</p>

<p>Status : ${property.status}</p>

<button onclick="removeProperty('${property.id}')">

Delete

</button>

</div>

</div>

`;

});

}

// ==========================
// Dashboard Stats
// ==========================

function updateStats(properties){

totalProperties.textContent = properties.length;

availableProperties.textContent =
properties.filter(p=>p.status==="Available").length;

soldProperties.textContent =
properties.filter(p=>p.status==="Sold").length;

}

// ==========================
// Search
// ==========================

searchInput.addEventListener("input",()=>{

const keyword =
searchInput.value.toLowerCase();

const filtered =
allProperties.filter(property=>

property.title.toLowerCase().includes(keyword) ||

property.location.toLowerCase().includes(keyword)

);

renderProperties(filtered);

});

// ==========================
// Delete
// ==========================

window.removeProperty = async(id)=>{

const ok = confirm("Delete this property?");

if(!ok) return;

await deleteProperty(id);

loadProperties();

};

// ==========================
// Start
// ==========================

loadProperties();
/*=====================================
MVR PROPERTIES
admin.js - Part 3
=====================================*/

import {
updateProperty
} from "./firebase.js";

// ============================
// Edit Property
// ============================

let editingId = null;

window.editProperty = function(property){

editingId = property.id;

document.getElementById("title").value = property.title;
document.getElementById("price").value = property.price;
document.getElementById("type").value = property.type;
document.getElementById("area").value = property.area;
document.getElementById("facing").value = property.facing;
document.getElementById("location").value = property.location;
document.getElementById("description").value = property.description;
document.getElementById("phone").value = property.phone;
document.getElementById("whatsapp").value = property.whatsapp;
document.getElementById("mapLink").value = property.map;
document.getElementById("status").value = property.status;
document.getElementById("featured").value =
property.featured ? "true" : "false";

window.scrollTo({
top:0,
behavior:"smooth"
});

};

// ============================
// Save Edited Property
// ============================

async function saveEditedProperty(data){

if(!editingId) return;

await updateProperty(editingId,data);

alert("✅ Property Updated");

editingId = null;

loadProperties();

}

// ============================
// Multiple Image Preview
// ============================

const imagePreview =
document.getElementById("imagePreview");

imageInput.addEventListener("change",()=>{

imagePreview.innerHTML="";

selectedImages.forEach(file=>{

const reader = new FileReader();

reader.onload=e=>{

imagePreview.innerHTML += `

<img src="${e.target.result}"
style="
width:90px;
height:90px;
object-fit:cover;
border-radius:8px;
margin:5px;
">

`;

};

reader.readAsDataURL(file);

});

});

// ============================
// Google Maps Preview
// ============================

const mapInput =
document.getElementById("mapLink");

const mapPreview =
document.getElementById("mapPreview");

mapInput.addEventListener("input",()=>{

const url = mapInput.value.trim();

if(url.includes("google")){

mapPreview.innerHTML = `

<iframe
src="${url}"
width="100%"
height="250"
style="border:0;"
loading="lazy">
</iframe>

`;

}else{

mapPreview.innerHTML="";

}

});

// ============================
// Featured Toggle
// ============================

document.getElementById("featured")
.addEventListener("change",e=>{

if(e.target.value==="true"){

alert("⭐ Featured Property");

}

});

// ============================
// Mobile Scroll
// ============================

window.scrollTo({
top:0,
behavior:"smooth"
});
