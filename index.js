import { auth, db } from "./firebase.config.js";

import {
    setDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";


let isAuthenticating = false;


// Bootstrap Toast Notification

const showToast = (message, type = "danger") => {

    const toastElement = document.getElementById("notification-toast");

    const toastMessage = document.getElementById("toast-message");

    if (!toastElement || !toastMessage) {
        console.error("Toast elements not found!");
        return;
    }

    toastMessage.textContent = message;

    toastElement.className = `toast border-0 shadow text-bg-${type}`;

    const toast = bootstrap.Toast.getOrCreateInstance(toastElement, {
        delay: 3500
    });

    toast.show();

};


// Authentication State

onAuthStateChanged(auth, (user) => {

    if (isAuthenticating) return;

    const isDashboard =
        window.location.pathname.endsWith("/dashboard.html");

    if (user) {

        if (!isDashboard) {
            window.location.href = "./dashboard.html";
        }

    } else {

        if (isDashboard) {
            window.location.href = "./index.html";
        }

    }

});


// Login

const login = async (e) => {

    e.preventDefault();

    const email = document
        .getElementById("login-email")
        .value.trim();

    const password = document
        .getElementById("login-password")
        .value;

    if (!email || !password) {

        showToast("Please enter your email and password!");

        return;

    }

    isAuthenticating = true;

    const loginButton = document.getElementById("login-button");

    try {

        loginButton.disabled = true;

        loginButton.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Logging in...
        `;

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        window.location.href = "./dashboard.html";

    } catch (error) {

        console.error("Login Error:", error.code);

        if (error.code === "auth/user-not-found") {

            showToast("User not found! Please check your email.");

        }

        else if (error.code === "auth/wrong-password") {

            showToast("Incorrect password! Please try again.");

        }

        else if (error.code === "auth/invalid-email") {

            showToast("Please enter a valid email address.");

        }

        else if (error.code === "auth/invalid-credential") {

            showToast("Incorrect email or password. Please try again.");

        }

        else if (error.code === "auth/too-many-requests") {

            showToast("Too many failed attempts. Please try again later.");

        }

        else {

            showToast("Login failed! Please try again.");

        }

    } finally {

        isAuthenticating = false;

        loginButton.disabled = false;

        loginButton.innerHTML = "Login to Account";

    }

};


// Register

const register = async (e) => {

    e.preventDefault();

    isAuthenticating = true;

    const username = document
        .getElementById("register-username")
        .value.trim();

    const email = document
        .getElementById("register-email")
        .value.trim();

    const password = document
        .getElementById("register-password")
        .value;


    if (!username) {

        showToast("Username is required!");

        isAuthenticating = false;

        return;

    }


    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;


        await setDoc(doc(db, "users", user.uid), {

            username: username,

            email: email,

            uid: user.uid,

            phone: ""

        });


        window.location.href = "./dashboard.html";


    } catch (error) {

        console.error("Signup Error:", error);

        if (error.code === "auth/email-already-in-use") {

            showToast("This email is already registered!");

        }

        else if (error.code === "auth/weak-password") {

            showToast("Password must be at least 6 characters!");

        }

        else if (error.code === "auth/invalid-email") {

            showToast("Please enter a valid email address!");

        }

        else {

            showToast("Signup failed! Please try again.");

        }

    } finally {

        isAuthenticating = false;

    }

};


// Logout

const logout = () => {

    signOut(auth)
        .catch((error) => {

            console.error("Logout Error:", error);

            showToast("Unable to logout. Please try again.");

        });

};


// Form Events

document
    .getElementById("login-form")
    ?.addEventListener("submit", login);

document
    .getElementById("register-form")
    ?.addEventListener("submit", register);

document
    .getElementById("logout")
    ?.addEventListener("click", logout);
