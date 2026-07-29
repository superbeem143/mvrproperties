import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const propertyList = document.getElementById("propertyList");

const addPropertyBtn = document.getElementById("addPropertyBtn");
const propertyModal = document.getElementById("propertyModal");
const closeModal = document.getElementById("closeModal");

const publishBtn = document.getElementById("publishBtn");

const searchInput = document.getElementById("searchInput");

const title = document.getElementById("title");
const price = document.getElementById("price");
const location = document.getElementById("location");
const layout = document.getElementById("layout");
const phone = document.getElementById("phone");
const description = document.getElementById("description");
const image = document.getElementById("image");
  
async function loadProperties() {

  propertyList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "properties"));

  snapshot.forEach((doc) => {

    const data = doc.data();

    propertyList.innerHTML += `
      <div class="property-card">

        <img src="${data.image || 'https://via.placeholder.com/400x250?text=Property'}">

        <div class="property-info">

          <h3>${data.title}</h3>

          <p><strong>💰 Price:</strong> ₹${data.price}</p>

          <p><strong>📍 Location:</strong> ${data.location}</p>

          <p><strong>🏘 Layout:</strong> ${data.layout}</p>

          <p><strong>📞 Phone:</strong> ${data.phone}</p>

          <button class="gold-btn">
            View Details
          </button>

        </div>

      </div>
    `;

  });

}

loadProperties();

addPropertyBtn.onclick = () => {
  propertyModal.style.display = "flex";
};

closeModal.onclick = () => {
  propertyModal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === propertyModal) {
    propertyModal.style.display = "none";
  }
};

publishBtn.onclick = async () => {

  try {

    await addDoc(collection(db, "properties"), {

      title: title.value,
      price: price.value,
      location: location.value,
      layout: layout.value,
      phone: phone.value,
      description: description.value,
      image: "",
      createdAt: serverTimestamp()

    });

    alert("✅ Property Published Successfully!");

    propertyModal.style.display = "none";

    loadProperties();

  } catch (err) {

    console.error(err);

    alert("❌ " + err.message);

  }

};


searchInput.addEventListener("input", () => {

  const text = searchInput.value.toLowerCase();

  document.querySelectorAll(".property-card").forEach(card => {

    if (card.innerText.toLowerCase().includes(text)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }

  });

});

console.log("✅ MVR Properties Luxury Edition Loaded");
