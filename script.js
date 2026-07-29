import { db } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const propertyList = document.getElementById("propertyList");
const latestProperties = document.getElementById("latestProperties");

const addPropertyBtn = document.getElementById("addPropertyBtn");
const propertyModal = document.getElementById("propertyModal");
const closeModal = document.getElementById("closeModal");

const publishBtn = document.getElementById("publishBtn");

const searchInput = document.getElementById("searchInput");

const title = document.getElementById("title");
const price = document.getElementById("price");
const location = document.getElementById("location");
const layout = document.getElementById("layout");
const maps = document.getElementById("maps");
const phone = document.getElementById("phone");
const description = document.getElementById("description");
const amenities = document.getElementById("amenities");
const image = document.getElementById("image");
let currentImageIndex = 0;
let currentImages = [];

const detailImage = document.getElementById("detailImage");
const imageCounter = document.getElementById("imageCounter");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");
let allProperties = [];
async function loadProperties() {

  propertyList.innerHTML = "";
  if (latestProperties) latestProperties.innerHTML = "";

  const snapshot = await getDocs(collection(db, "properties"));

  allProperties = [];

  snapshot.forEach((doc) => {

    const data = doc.data();
    data.id = doc.id;

    allProperties.push(data);

    const card = `
      <div class="property-card fade">

        <img src="${(data.images && data.images[0]) || data.image || 'https://via.placeholder.com/400x250'}">

        <div class="property-info">

          <h3>${data.title}</h3>

          <p><strong>💰 Price:</strong> ₹${data.price}</p>

          <p><strong>📍 ${data.location}</strong></p>

          <button class="gold-btn"
            onclick="showDetails('${data.id}')">
            View Details
          </button>

        </div>

      </div>
    `;

    propertyList.innerHTML += card;

    if (latestProperties) {
      latestProperties.innerHTML += card;
    }

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

window.showDetails = function(id) {

  const property = allProperties.find(p => p.id === id);
  if (!property) return;

  currentImages = property.images || [];
  currentImageIndex = 0;

  detailImage.src = currentImages.length
    ? currentImages[0]
    : "https://via.placeholder.com/400x250";

  imageCounter.textContent =
    `${currentImageIndex + 1} / ${currentImages.length || 1}`;

  document.getElementById("detailTitle").textContent = property.title;
  document.getElementById("detailPrice").textContent = "₹" + property.price;
  document.getElementById("detailLocation").textContent = "📍 " + property.location;
  document.getElementById("detailLayout").textContent = "🏘 " + (property.layout || "");
  document.getElementById("detailDescription").textContent =
    property.description || "";

  document.getElementById("detailsModal").style.display = "flex";
};
publishBtn.onclick = async () => {

  try {

    let imageUrls = [];

    if (image.files.length > 0) {

      for (const file of image.files) {

        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", "mvrproperties");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/onrnn2hn/image/upload",
          {
            method: "POST",
            body: formData
          }
        );

        const data = await res.json();

        imageUrls.push(data.secure_url);

      }

    }

    await addDoc(collection(db, "properties"), {

      title: title.value,
      price: price.value,
      location: location.value,
      layout: layout.value,
      maps: maps.value,
      phone: phone.value,
      description: description.value,
      amenities: amenities.value,
      images: imageUrls,
      createdAt: serverTimestamp()

    });

    alert("✅ Property Published!");

    propertyModal.style.display = "none";

    loadProperties();

  } catch (err) {

    console.error(err);

    alert(err.message);

  }

};

document.addEventListener("click", (e) => {
prevImage.onclick = () => {

  if (currentImages.length <= 1) return;

  currentImageIndex--;

  if (currentImageIndex < 0) {
    currentImageIndex = currentImages.length - 1;
  }

  detailImage.src = currentImages[currentImageIndex];
  imageCounter.textContent =
    `${currentImageIndex + 1} / ${currentImages.length}`;
};

nextImage.onclick = () => {

  if (currentImages.length <= 1) return;

  currentImageIndex++;

  if (currentImageIndex >= currentImages.length) {
    currentImageIndex = 0;
  }

  detailImage.src = currentImages[currentImageIndex];
  imageCounter.textContent =
    `${currentImageIndex + 1} / ${currentImages.length}`;
};
  if (e.target.classList.contains("gallery-thumb")) {

    document.getElementById("detailImage").src = e.target.src;

  }

});
  
