/* ===================================
   MVR Properties V2
   script.js - Part 1
=================================== */

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

        popup.style.display = "block";

    }

}

function closePopup(){

    if(popup){

        popup.style.display = "none";

    }

}

window.openPopup = openPopup;
window.closePopup = closePopup;

// Close popup when clicking outside

window.addEventListener("click",(e)=>{

    if(e.target === popup){

        closePopup();

    }

});

// ===========================
// Sample Properties
// ===========================

const sampleProperties = [

{

title:"Premium Open Plot",

location:"Hyderabad",

price:"₹25,00,000",

image:"images/no-image.jpg"

},

{

title:"Luxury Villa",

location:"Visakhapatnam",

price:"₹85,00,000",

image:"images/no-image.jpg"

},

{

title:"Farm Land",

location:"Palakollu",

price:"₹15,00,000",

image:"images/no-image.jpg"

}

];
// ===========================
// Render Properties
// ===========================

const propertyContainer = document.getElementById("propertyContainer");

function renderProperties(list){

    if(!propertyContainer) return;

    propertyContainer.innerHTML = "";

    list.forEach(property=>{

        propertyContainer.innerHTML += `

        <div class="property-card">

            <img src="${property.image}" alt="${property.title}">

            <h3>${property.title}</h3>

            <p>📍 ${property.location}</p>

            <div class="price">${property.price}</div>

            <a href="#" class="primary-btn">
                View Details
            </a>

        </div>

        `;

    });

}

// Load sample properties

renderProperties(sampleProperties);

// ===========================
// Search
// ===========================

const searchBtn = document.getElementById("searchBtn");

if(searchBtn){

searchBtn.addEventListener("click",()=>{

const location=document
.getElementById("searchLocation")
.value
.toLowerCase();

const filtered=sampleProperties.filter(property=>

property.location
.toLowerCase()
.includes(location)

);

renderProperties(filtered);

});

}
// ===========================
// Publish Property (Demo)
// ===========================

const publishBtn = document.getElementById("publishBtn");

if (publishBtn) {

    publishBtn.addEventListener("click", () => {

        const title = document.getElementById("title").value;
        const location = document.getElementById("location").value;
        const price = document.getElementById("price").value;

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

        sampleProperties.unshift(newProperty);

        renderProperties(sampleProperties);

        closePopup();

        alert("Property added successfully!");

        document.getElementById("title").value = "";
        document.getElementById("layout").value = "";
        document.getElementById("price").value = "";
        document.getElementById("sqyard").value = "";
        document.getElementById("location").value = "";
        document.getElementById("maps").value = "";
        document.getElementById("description").value = "";
        document.getElementById("images").value = "";

    });

}

console.log("MVR Properties V2 Loaded Successfully");
