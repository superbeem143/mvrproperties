// ==========================
// IMPORTS
// ==========================

import { db } from "./firebase.js";
alert("script.js loaded");
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// ==========================
// POPUP
// ==========================

const popup = document.getElementById("popup");

window.openPopup = function () {
  if (popup) popup.style.display = "flex";
};

window.closePopup = function () {
  if (popup) popup.style.display = "none";
};

window.onclick = function (e) {
  if (e.target === popup) {
    closePopup();
  }
};

// ==========================
// MOBILE MENU
// ==========================

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    if (navbar.style.display === "flex") {
      navbar.style.display = "none";
    } else {
      navbar.style.display = "flex";
      navbar.style.flexDirection = "column";
    }
  });
}

// ==========================
// LOAD PROPERTIES
// ==========================

async function loadProperties() {

  const container = document.getElementById("propertyContainer");

  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "properties"));

  snapshot.forEach((doc) => {

    const p = doc.data();

    container.innerHTML += `
      <div class="property-card">

        <img src="${p.image || 'https://via.placeholder.com/600x400'}" alt="Property">

        <div class="property-content">

          <h3>${p.title}</h3>

          <p><b>Type:</b> ${p.type}</p>

          <p><b>Location:</b> ${p.location}</p>

          <div class="price">
            ₹${p.price}
          </div>

        </div>

      </div>
    `;

  });

}

loadProperties();
// ==========================
// PUBLISH PROPERTY
// ==========================

const publishBtn = document.getElementById("publishBtn");

if (publishBtn) {

  publishBtn.addEventListener("click", async () => {

    try {

      const title = document.getElementById("title").value.trim();
      const layout = document.getElementById("layout").value.trim();
      const type = document.getElementById("type").value;
      const price = document.getElementById("price").value;
      const sqyard = document.getElementById("sqyard").value;
      const locationValue = document.getElementById("location").value.trim();
      const maps = document.getElementById("maps").value.trim();
      const description = document.getElementById("description").value.trim();

      if (!title || !type || !price || !locationValue) {
        alert("Please fill all required fields.");
        return;
      }

      await addDoc(collection(db, "properties"), {
        title,
        layout,
        type,
        price,
        sqyard,
        location: locationValue,
        maps,
        description,
        image: ""
      });

      alert("Property published successfully!");

      closePopup();

      window.location.reload();

    } catch (err) {

      console.error(err);
      alert("Publish failed: " + err.message);

    }

  });

}

// ==========================
// SEARCH
// ==========================

const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {

  searchBtn.addEventListener("click", () => {

    const keyword = document
      .getElementById("searchLocation")
      .value
      .toLowerCase();

    const cards = document.querySelectorAll(".property-card");

    cards.forEach(card => {

      if (card.innerText.toLowerCase().includes(keyword)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    });

  });

}

// ==========================
// PREVIEW
// ==========================

const previewBtn = document.getElementById("previewBtn");

if (previewBtn) {

  previewBtn.addEventListener("click", () => {

    alert(
`Preview

Title: ${document.getElementById("title").value}
Type: ${document.getElementById("type").value}
Location: ${document.getElementById("location").value}
Price: ₹${document.getElementById("price").value}`
    );

  });

}

        


     
  
