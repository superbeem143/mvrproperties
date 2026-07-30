/*=====================================
MVR PROPERTIES
firebase.js
Only change: set Cloudinary constants to provided values (do NOT modify firebaseConfig or any other code).
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

// Cloudinary config (updated per request)
const CLOUD_NAME = "onrnn2hn";
const UPLOAD_PRESET = "mvrproperties";

// Storage (restored upload using Firebase Storage)
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

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
const storage = getStorage(app);

// =====================================
// Collections
// =====================================

const PROPERTY_COLLECTION = "properties";

// =====================================
// Login / Auth helpers
// =====================================

export async function loginUser(email,password,remember){
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser(){
  return signOut(auth);
}

export function getCurrentUser(){
  return new Promise(resolve=>{
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function resetPassword(email){
  return sendPasswordResetEmail(auth, email);
}

// =====================================
// Firestore: Add / Get / Update / Delete
// =====================================

export async function addProperty(property){
  property.createdAt = serverTimestamp();
  const docRef = await addDoc(collection(db, PROPERTY_COLLECTION), property);
  return docRef.id;
}

export async function getProperties(){
  const q = query(collection(db, PROPERTY_COLLECTION), orderBy("createdAt","desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docItem=>({ id: docItem.id, ...docItem.data() }));
}

export async function getProperty(id){
  const ref = doc(db, PROPERTY_COLLECTION, id);
  const snapshot = await getDoc(ref);
  if(!snapshot.exists()) throw new Error("Property not found.");
  return { id: snapshot.id, ...snapshot.data() };
}

export async function updateProperty(id,data){
  const ref = doc(db, PROPERTY_COLLECTION, id);
  await updateDoc(ref,data);
}

export async function deleteProperty(id){
  const ref = doc(db, PROPERTY_COLLECTION, id);
  await deleteDoc(ref);
}

export function watchProperties(callback){
  const q = query(collection(db, PROPERTY_COLLECTION), orderBy("createdAt","desc"));
  return onSnapshot(q,(snapshot)=>{
    const properties = snapshot.docs.map(docItem=>({ id:docItem.id, ...docItem.data() }));
    callback(properties);
  });
}

// =====================================
// Image upload using Firebase Storage (restored)
// - uploadImage(file) -> returns download URL
// - uploadImages(files) -> returns array of URLs
// =====================================

export async function uploadImage(file){
  if(!file) throw new Error('No file provided for upload.');

  // create a storage ref path
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g,'')}`;
  const path = `properties/${filename}`;
  const ref = storageRef(storage, path);

  // Use uploadBytes to upload file blob
  // If you prefer resumable upload, you can use uploadBytesResumable
  await uploadBytes(ref, file);

  const url = await getDownloadURL(ref);
  return url;
}

export async function uploadImages(files){
  const urls = [];
  for(const file of files){
    const imageUrl = await uploadImage(file);
    urls.push(imageUrl);
  }
  return urls;
}

// =====================================
// Other helpers
// =====================================

export async function getFeaturedProperties(){
  const properties = await getProperties();
  return properties.filter(property=>property.featured===true);
}

export async function searchProperties(keyword){
  const properties = await getProperties();
  const search = (keyword||"").toLowerCase();
  return properties.filter(property=>
    (property.title||"").toLowerCase().includes(search) ||
    (property.location||"").toLowerCase().includes(search) ||
    (property.type||"").toLowerCase().includes(search)
  );
}

export { auth, db, storage };
