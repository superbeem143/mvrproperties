function openPopup() {
    document.getElementById("popup").classList.add("active");
}

function closePopup() {
    document.getElementById("popup").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {

    const addBtn = document.querySelector(".add-property-btn");
    const popup = document.getElementById("popup");

    if (addBtn) {
        addBtn.addEventListener("click", function (e) {
            e.preventDefault();
            openPopup();
        });
    }

    if (popup) {
        popup.addEventListener("click", function (e) {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

});
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const publishBtn = document.getElementById("publishBtn");

if (publishBtn) {
  publishBtn.addEventListener("click", async () => {
    try {
      await addDoc(collection(window.db, "properties"), {
        title: document.querySelector('input[placeholder="Property Title"]').value,
        layout: document.querySelector('input[placeholder="Layout Name"]').value,
        price: document.querySelector('input[placeholder="Price"]').value,
        createdAt: new Date()
      });

      alert("Property Published Successfully!");
      closePopup();
    } catch (err) {
      console.error(err);
      alert("Error publishing property.");
    }
  });
}
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const publishBtn = document.getElementById("publishBtn");

if (publishBtn) {
  publishBtn.addEventListener("click", async () => {

    const title = document.querySelector('input[placeholder="Property Title"]').value;
    const layout = document.querySelector('input[placeholder="Layout Name"]').value;
    const price = document.querySelector('input[placeholder="Price"]').value;
    const location = document.querySelector('input[placeholder="Location"]').value;

    await addDoc(collection(window.db, "properties"), {
      title,
      layout,
      price,
      location,
      createdAt: new Date()
    });

    alert("Property Published Successfully!");
  });
}
