/*=====================================
MVR PROPERTIES
script.js - Part 1
=====================================*/

// =============================
// Global Variables
// =============================

const propertyList = document.getElementById("propertyList");
const latestProperties = document.getElementById("latestProperties");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const propertyModal = document.getElementById("propertyModal");
const closeModal = document.querySelector(".close-modal");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalLocation = document.getElementById("modalLocation");
const modalDescription = document.getElementById("modalDescription");

const callBtn = document.getElementById("callBtn");
const whatsappBtn = document.getElementById("whatsappBtn");
const mapBtn = document.getElementById("mapBtn");

// =============================
// Local Storage
// =============================

let properties = [];

let filteredProperties = [];

let currentProperty = null;

// =============================
// Initial Load
// =============================

window.addEventListener("load", () => {

loadProperties();

});

// =============================
// Search
// =============================

searchBtn.addEventListener("click", searchProperties);

searchInput.addEventListener("keyup", e=>{

if(e.key==="Enter"){

searchProperties();

}

});

function searchProperties(){

const keyword = searchInput.value
.toLowerCase()
.trim();

if(keyword===""){

renderProperties(properties);

return;

}

filteredProperties = properties.filter(property=>{

return(

property.title.toLowerCase().includes(keyword)

||

property.location.toLowerCase().includes(keyword)

||

property.type.toLowerCase().includes(keyword)

);

});

renderProperties(filteredProperties);

}

// =============================
// Render Properties
// =============================

function renderProperties(list){

propertyList.innerHTML="";

latestProperties.innerHTML="";

list.forEach(property=>{

const card=createPropertyCard(property);

propertyList.appendChild(card);

latestProperties.appendChild(card.cloneNode(true));

});

}

// =============================
// Create Card
// =============================

function createPropertyCard(property){

const card=document.createElement("div");

card.className="property-card";

card.innerHTML=`

<div class="property-image">

<img src="${property.images[0]}" alt="Property">

<span class="featured-badge">

${property.featured ? "Featured" : "Property"}

</span>

</div>

<div class="property-content">

<h3>${property.title}</h3>

<p>📍 ${property.location}</p>

<h2>₹ ${property.price}</h2>

<div class="property-buttons">

<button class="gold-btn viewBtn">

View Details

</button>

<a href="tel:${property.phone}"

class="outline-btn">

Call

</a>

</div>

</div>

`;

card.querySelector(".viewBtn")
.addEventListener("click",()=>{

openModal(property);

});

return card;

  }
/*=====================================
PROPERTY DETAILS MODAL
script.js - Part 2
=====================================*/

// =============================
// Open Modal
// =============================

function openModal(property){

currentProperty = property;

modalImage.src = property.images[0];

modalTitle.textContent = property.title;

modalPrice.textContent = "₹ " + property.price;

modalLocation.textContent = property.location;

modalDescription.textContent = property.description;

// Contact Buttons

callBtn.href = "tel:" + property.phone;

whatsappBtn.href =
`https://wa.me/${property.phone}?text=Hi, I am interested in ${encodeURIComponent(property.title)}`;

mapBtn.href = property.map;

// Show Modal

propertyModal.style.display = "flex";

currentImage = 0;

}

// =============================
// Close Modal
// =============================

closeModal.addEventListener("click",()=>{

propertyModal.style.display="none";

});

window.addEventListener("click",(e)=>{

if(e.target===propertyModal){

propertyModal.style.display="none";

}

});

// =============================
// Image Slider
// =============================

let currentImage = 0;

const nextBtn = document.querySelector(".next");

const prevBtn = document.querySelector(".prev");

nextBtn.addEventListener("click",()=>{

if(!currentProperty) return;

currentImage++;

if(currentImage >= currentProperty.images.length){

currentImage = 0;

}

modalImage.src = currentProperty.images[currentImage];

});

prevBtn.addEventListener("click",()=>{

if(!currentProperty) return;

currentImage--;

if(currentImage < 0){

currentImage = currentProperty.images.length - 1;

}

modalImage.src = currentProperty.images[currentImage];

});

// =============================
// Share Property
// =============================

function shareProperty(){

if(!currentProperty) return;

if(navigator.share){

navigator.share({

title: currentProperty.title,

text: currentProperty.description,

url: window.location.href

});

}else{

alert("Sharing is not supported on this device.");

}

}

// =============================
// Favorites
// =============================

function toggleFavorite(id){

let favs =
JSON.parse(localStorage.getItem("favorites")) || [];

if(favs.includes(id)){

favs = favs.filter(item=>item!==id);

}else{

favs.push(id);

}

localStorage.setItem(
"favorites",
JSON.stringify(favs)
);

}

// =============================
// Floating AI Button
// =============================

const aiButton =
document.getElementById("floatingAI");

if(aiButton){

aiButton.addEventListener("click",()=>{

alert(
"🤖 SUPER BEEM AI is coming soon!"
);

});

  }
/*=====================================
MVR PROPERTIES
script.js - Part 3 (Final)
=====================================*/

// =============================
// Firebase Property Loading
// =============================

async function loadProperties(){

try{

const snapshot = await db
.collection("properties")
.orderBy("createdAt","desc")
.get();

properties = [];

snapshot.forEach(doc=>{

properties.push({

id:doc.id,

...doc.data()

});

});

renderProperties(properties);

}catch(error){

console.error("Property Loading Error:",error);

}

}

// =============================
// Login Button
// =============================

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

loginBtn.addEventListener("click",()=>{

window.location.href="login.html";

});

}

// =============================
// Add Property
// =============================

const addPropertyBtn =
document.getElementById("addPropertyBtn");

if(addPropertyBtn){

addPropertyBtn.addEventListener("click",()=>{

window.location.href="admin.html";

});

}

// =============================
// SUPER BEEM AI
// =============================

const aiLauncher =
document.getElementById("superBeemAI");

if(aiLauncher){

aiLauncher.addEventListener("click",()=>{

alert(
`🤖 SUPER BEEM AI

Coming Soon!

Soon you can search like:

• 30 Lakhs Open Plot
• East Facing
• Near School
• Villa in Hyderabad
• Farm Land Near Highway`
);

});

}

// =============================
// Floating AI Button
// =============================

const floatingAI =
document.getElementById("floatingAI");

if(floatingAI){

floatingAI.addEventListener("click",()=>{

aiLauncher?.click();

});

}

// =============================
// Search While Typing
// =============================

if(searchInput){

searchInput.addEventListener("input",()=>{

searchProperties();

});

}

// =============================
// Escape Key Closes Modal
// =============================

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

propertyModal.style.display="none";

}

});

// =============================
// Scroll To Top
// =============================

window.addEventListener("scroll",()=>{

const header =
document.querySelector(".header");

if(window.scrollY>60){

header.classList.add("scrolled");

}else{

header.classList.remove("scrolled");

}

});

// =============================
// Initialize
// =============================

document.addEventListener("DOMContentLoaded",()=>{

console.log("✅ MVR Properties Loaded");

loadProperties();

});
