/*=====================================
MVR PROPERTIES
firebase.js
Part 1
=====================================*/

// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged,
sendPasswordResetEmail,
setPersistence,
browserLocalPersistence,
browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
updateDoc,
deleteDoc,
doc,
getDoc,
onSnapshot,
query,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// =====================================
// Firebase Configuration
// =====================================

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT.firebaseapp.com",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_PROJECT.appspot.com",

messagingSenderId: "YOUR_SENDER_ID",

appId: "YOUR_APP_ID"

};

// =====================================
// Initialize Firebase
// =====================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// =====================================
// Collections
// =====================================

const PROPERTY_COLLECTION = "properties";

// =====================================
// Login
// =====================================

export async function loginUser(email,password,remember){

await setPersistence(

auth,

remember

? browserLocalPersistence

: browserSessionPersistence

);

return signInWithEmailAndPassword(

auth,

email,

password

);

}

// =====================================
// Logout
// =====================================

export async function logoutUser(){

return signOut(auth);

}

// =====================================
// Current User
// =====================================

export function getCurrentUser(){

return new Promise(resolve=>{

const unsubscribe=

onAuthStateChanged(auth,user=>{

unsubscribe();

resolve(user);

});

});

}

// =====================================
// Reset Password
// =====================================

export async function resetPassword(email){

return sendPasswordResetEmail(

auth,

email

);

  }
/*=====================================
MVR PROPERTIES
firebase.js
Part 2
=====================================*/

// =====================================
// Add Property
// =====================================

export async function addProperty(property){

property.createdAt = serverTimestamp();

const docRef = await addDoc(

collection(db, PROPERTY_COLLECTION),

property

);

return docRef.id;

}

// =====================================
// Get All Properties
// =====================================

export async function getProperties(){

const q = query(

collection(db, PROPERTY_COLLECTION),

orderBy("createdAt","desc")

);

const snapshot = await getDocs(q);

return snapshot.docs.map(docItem=>({

id: docItem.id,

...docItem.data()

}));

}

// =====================================
// Get Single Property
// =====================================

export async function getProperty(id){

const ref = doc(db, PROPERTY_COLLECTION, id);

const snapshot = await getDoc(ref);

if(!snapshot.exists()){

throw new Error("Property not found.");

}

return{

id:snapshot.id,

...snapshot.data()

};

}

// =====================================
// Update Property
// =====================================

export async function updateProperty(id,data){

const ref = doc(db, PROPERTY_COLLECTION, id);

await updateDoc(ref,data);

}

// =====================================
// Delete Property
// =====================================

export async function deleteProperty(id){

const ref = doc(db, PROPERTY_COLLECTION, id);

await deleteDoc(ref);

}

// =====================================
// Realtime Listener
// =====================================

export function watchProperties(callback){

const q = query(

collection(db, PROPERTY_COLLECTION),

orderBy("createdAt","desc")

);

return onSnapshot(q,(snapshot)=>{

const properties = snapshot.docs.map(docItem=>({

id:docItem.id,

...docItem.data()

}));

callback(properties);

});

                         }
/*=====================================
MVR PROPERTIES
firebase.js
Part 3
=====================================*/

// =====================================
// Cloudinary Configuration
// =====================================

const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

// =====================================
// Upload Image
// =====================================

export async function uploadImage(file){

const formData = new FormData();

formData.append("file", file);
formData.append("upload_preset", UPLOAD_PRESET);

const response = await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

{

method:"POST",

body:formData

}

);

if(!response.ok){

throw new Error("Image upload failed.");

}

const data = await response.json();

return data.secure_url;

}

// =====================================
// Upload Multiple Images
// =====================================

export async function uploadImages(files){

const urls = [];

for(const file of files){

const imageUrl = await uploadImage(file);

urls.push(imageUrl);

}

return urls;

}

// =====================================
// Featured Properties
// =====================================

export async function getFeaturedProperties(){

const properties = await getProperties();

return properties.filter(property=>property.featured===true);

}

// =====================================
// Search Properties
// =====================================

export async function searchProperties(keyword){

const properties = await getProperties();

const search = keyword.toLowerCase();

return properties.filter(property=>

(property.title || "")
.toLowerCase()
.includes(search)

||

(property.location || "")
.toLowerCase()
.includes(search)

||

(property.type || "")
.toLowerCase()
.includes(search)

);

}

// =====================================
// Utility
// =====================================

export {

auth,

db

};
