/*=====================================
MVR PROPERTIES
login.js - Part 1
=====================================*/

import {
loginUser
} from "./firebase.js";

// =========================
// DOM Elements
// =========================

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const rememberMe = document.getElementById("rememberMe");

const loadingOverlay =
document.getElementById("loadingOverlay");

const messageBox =
document.getElementById("messageBox");

// =========================
// Message Function
// =========================

function showMessage(text,type){

messageBox.textContent=text;

messageBox.className="message-box";

if(type==="success"){

messageBox.classList.add("message-success");

}else{

messageBox.classList.add("message-error");

}

}

// =========================
// Login
// =========================

loginForm.addEventListener("submit",async(e)=>{

e.preventDefault();

loadingOverlay.style.display="flex";

try{

await loginUser(

email.value.trim(),

password.value,

rememberMe.checked

);

showMessage("Login Successful","success");

setTimeout(()=>{

window.location.href="admin.html";

},800);

}catch(error){

showMessage(error.message,"error");

}finally{

loadingOverlay.style.display="none";

}

});
/*=====================================
MVR PROPERTIES
login.js - Part 2
=====================================*/

import {
logoutUser,
resetPassword,
getCurrentUser
} from "./firebase.js";

// =========================
// Forgot Password
// =========================

const forgotPassword =
document.getElementById("forgotPassword");

forgotPassword?.addEventListener("click", async (e)=>{

e.preventDefault();

const userEmail = email.value.trim();

if(!userEmail){

showMessage(
"Please enter your email first.",
"error"
);

return;

}

try{

await resetPassword(userEmail);

showMessage(
"Password reset email sent.",
"success"
);

}catch(error){

showMessage(error.message,"error");

}

});

// =========================
// Auto Login
// =========================

window.addEventListener("load",async()=>{

try{

const user = await getCurrentUser();

if(user){

window.location.href="admin.html";

}

}catch(error){

console.log(error);

}

});

// =========================
// Logout
// =========================

window.logout = async()=>{

try{

await logoutUser();

window.location.href="login.html";

}catch(error){

console.log(error);

}

};
