import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
    getFirestore,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

import {
    getAuth,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDZ_DD1KA-CVb3YZfk6P6Z4UJfFL8DOw8c",
    authDomain: "smit-batch-22-fa12f.firebaseapp.com",
    projectId: "smit-batch-22-fa12f",
    storageBucket: "smit-batch-22-fa12f.firebasestorage.app",
    messagingSenderId: "782447831991",
    appId: "1:782447831991:web:4eea8aeb64c318f5591632"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);


