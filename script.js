/* ===================================
   MVR Properties V4
   Part 1
=================================== */

import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
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
const addBtn = document.querySelector(".add-property-btn");

function openPopup() {

  if (!popup) return;

  popup.style.display = "block";

  if (addBtn) {
    addBtn.style.display = "none";
  }

}

function closePopup() {

  if (!popup) return;

  popup.style.display = "none";

  if (addBtn) {
    addBtn.style.display = "block";
  }

}

window.openPopup = openPopup;
window.closePopup = closePopup;

window.addEventListener("click", (e)
// ===========================
// Load Properties
// ===========================

async function loadProperties() {

  try {

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

  } catch (error) {

    console.error("Load Error:", error);
    alert("Unable to load properties.\n" + error.message);

  }

}

// ===========================
// Search
// ===========================

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {

  searchBtn.addEventListener("click", () => {

    const keyword = document
      .getElementById("searchLocation")
      .value
      .trim()
      .toLowerCase();

    if (keyword === "") {

      renderProperties(properties);
      return;

    }

    const filtered = properties.filter((item) =>

      item.location &&
      item.location.toLowerCase().includes(keyword)

    );

    renderProperties(filtered);

  });

}
// ===========================
// Publish Property
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
      image: "images/no-image.jpg",
      createdAt: new Date()
    };

    try {

      await addDoc(propertyRef, newProperty);

      alert("Property Published Successfully!");

      document.getElementById("title").value = "";
      document.getElementById("layout").value = "";
      document.getElementById("price").value = "";
      document.getElementById("sqyard").value = "";
      document.getElementById("location").value = "";
      document.getElementById("maps").value = "";
      document.getElementById("description").value = "";
      document.getElementById("images").value = "";

      closePopup();

      await loadProperties();

    } catch (error) {

      console.error("Publish Error:", error);
      alert("Failed to publish property.\n" + error.message);

    }

  });

}
// ===========================
// Preview Button
// ===========================

const previewBtn = document.getElementById("previewBtn");

if (previewBtn) {

  previewBtn.addEventListener("click", () => {

    alert("Preview feature coming soon!");

  });

}

// ===========================
// Initial Load
// ===========================

window.addEventListener("DOMContentLoaded", async () => {

  await loadProperties();

});

// ===========================
// Console
// ===========================

console.log("✅ MVR Properties V4 Loaded Successfully");

            
