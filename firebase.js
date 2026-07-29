import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFSnAwXw6uJB1QZjqT1IHlYBwsS9CsvLw",
  authDomain: "mvr-properties-64922.firebaseapp.com",
  projectId: "mvr-properties-64922",
  storageBucket: "mvr-properties-64922.firebasestorage.app",
  messagingSenderId: "1091310315390",
  appId: "1:1091310315390:web:e497f300b5cace2359f52f",
  measurementId: "G-VMK0P03VQX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
