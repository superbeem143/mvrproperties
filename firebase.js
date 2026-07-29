/*=====================================
MVR PROPERTIES
firebase.js - Part 1
=====================================*/

// =============================
// Firebase SDK Imports
// =============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
addDoc,
updateDoc,
deleteDoc,
doc,
query,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import {
getStorage
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// =============================
// Firebase Configuration
// =============================

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_PROJECT.appspot.com",

messagingSenderId: "YOUR_SENDER_ID",

appId: "YOUR_APP_ID"

};

// =============================
// Initialize Firebase
// =============================

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

// =============================
// Cloudinary Configuration
// =============================

export const CLOUDINARY = {

cloudName: "YOUR_CLOUD_NAME",

uploadPreset: "YOUR_UPLOAD_PRESET"

};
/*=====================================
MVR PROPERTIES
firebase.js - Part 2
=====================================*/

import {
collection,
getDocs,
addDoc,
updateDoc,
deleteDoc,
doc,
query,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { db } from "./firebase.js";

// =============================
// Collection Reference
// =============================

const propertiesRef = collection(db, "properties");

// =============================
// Get All Properties
// =============================

export async function getProperties(){

const q = query(
propertiesRef,
orderBy("createdAt","desc")
);

const snapshot = await getDocs(q);

const properties = [];

snapshot.forEach(item=>{

properties.push({

id:item.id,

...item.data()

});

});

return properties;

}

// =============================
// Add Property
// =============================

export async function addProperty(property){

await addDoc(propertiesRef,{

...property,

createdAt:serverTimestamp()

});

}

// =============================
// Update Property
// =============================

export async function updateProperty(id,data){

const propertyDoc = doc(db,"properties",id);

await updateDoc(propertyDoc,data);

}

// =============================
// Delete Property
// =============================

export async function deleteProperty(id){

const propertyDoc = doc(db,"properties",id);

await deleteDoc(propertyDoc);

  }
/*=====================================
MVR PROPERTIES
firebase.js - Part 3
=====================================*/

import {
collection,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { db } from "./firebase.js";

// =============================
// Real-time Property Listener
// =============================

export function watchProperties(callback){

const q = query(
collection(db,"properties"),
orderBy("createdAt","desc")
);

return onSnapshot(q,(snapshot)=>{

const properties=[];

snapshot.forEach(doc=>{

properties.push({

id:doc.id,

...doc.data()

});

});

callback(properties);

});

}

// =============================
// Cloudinary Upload
// =============================

export async function uploadImage(file){

const formData=new FormData();

formData.append("file",file);

formData.append(
"upload_preset",
CLOUDINARY.uploadPreset
);

const response=await fetch(

`https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`,

{

method:"POST",

body:formData

}

);

const data=await response.json();

return data.secure_url;

}

// =============================
// Date Formatter
// =============================

export function formatDate(timestamp){

if(!timestamp) return "";

const date = timestamp.toDate();

return date.toLocaleDateString("en-IN",{

day:"2-digit",
month:"short",
year:"numeric"

});

}

// =============================
// Price Formatter
// =============================

export function formatPrice(price){

return new Intl.NumberFormat("en-IN",{

maximumFractionDigits:0

}).format(price);

}

// =============================
// Ready
// =============================

console.log("✅ Firebase Connected");
console.log("☁️ Cloudinary Ready");
