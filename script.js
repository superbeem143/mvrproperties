/* ===================================
   MVR Properties V3
   Part 1
=================================== */

import { db } from "./firebase.js";

import {
addDoc,
collection,
getDocs,
orderBy,
query
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ===========================
// Mobile Menu
// ===========================

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {

menuBtn.addEventListener("click", () => {

navbar.classList.toggle("active");

});

}

// ===========================
// Popup
// ===========================

const popup = document.getElementById("popup");

function openPopup(){

if(popup){

popup.style.display="block";

}

}

function closePopup(){

if(popup){

popup.style.display="none";

}

}

window.openPopup=openPopup;
window.closePopup=closePopup;

window.addEventListener("click",(e)=>{

if(e.target===popup){

closePopup();

}

});

// ===========================
// Firestore Collection
// ===========================

const propertyRef = collection(db,"properties");

// ===========================
// Property List
// ===========================

let properties=[];

// ===========================
// Render Properties
// ===========================

const propertyContainer =
document.getElementById("propertyContainer");

function renderProperties(list){

if(!propertyContainer) return;

propertyContainer.innerHTML="";

if(list.length===0){

propertyContainer.innerHTML=`

<div class="no-property">

<h2>No Properties Found</h2>

</div>

`;

return;

}

list.forEach(property=>{

propertyContainer.innerHTML+=`

<div class="property-card">

<img src="${property.image}" alt="${property.title}">

<h3>${property.title}</h3>

<p>📍 ${property.location}</p>

<div class="price">

${property.price}

</div>

<a href="#" class="primary-btn">

View Details

</a>

</div>

`;

});

}
// ===========================
// Load Properties from Firestore
// ===========================

async function loadProperties() {

    properties = [];

    const q = query(propertyRef, orderBy("title"));

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {

        properties.push({
            id: doc.id,
            ...doc.data()
        });

    });

    renderProperties(properties);

}

loadProperties();

// ===========================
// Search Properties
// ===========================

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {

    searchBtn.addEventListener("click", () => {

        const location = document
            .getElementById("searchLocation")
            .value
            .toLowerCase();

        const filtered = properties.filter(property =>
            property.location
                .toLowerCase()
                .includes(location)
        );

        renderProperties(filtered);

    });

} 
// ===========================
// Publish Property to Firestore
// ===========================

const publishBtn = document.getElementById("publishBtn");

if (publishBtn) {

    publishBtn.addEventListener("click", async () => {

        const title = document.getElementById("title").value.trim();
        const location = document.getElementById("location").value.trim();
        const price = document.getElementById("price").value.trim();

        if (!title || !location || !price) {

            alert("Please fill all required fields.");

            return;

        }

        const newProperty = {

            title: title,
            location: location,
            price: "₹" + price,
            image: "images/no-image.jpg"

        };

        try {

            await addDoc(propertyRef, newProperty);

            alert("Property Published Successfully!");

            closePopup();

            loadProperties();

            document.getElementById("title").value = "";
            document.getElementById("layout").value = "";
            document.getElementById("price").value = "";
            document.getElementById("sqyard").value = "";
            document.getElementById("location").value = "";
            document.getElementById("maps").value = "";
            document.getElementById("description").value = "";
            document.getElementById("images").value = "";

        } catch (error) {

            console.error(error);

            alert("Failed to publish property.");

        }

    });

}
// ===========================
// Preview Button (Temporary)
// ===========================

const previewBtn = document.getElementById("previewBtn");

if (previewBtn) {

    previewBtn.addEventListener("click", () => {

        alert("Preview feature will be added soon.");

    });

}

// ===========================
// Initial Load
// ===========================

loadProperties();

// ===========================
// Console
// ===========================

console.log("✅ MVR Properties V3 Loaded Successfully");
