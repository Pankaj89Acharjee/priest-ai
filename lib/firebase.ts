import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDYEovAUzlOEfH19SwW_YL4dNMciXABWRk",
    authDomain: "priest-684eb.firebaseapp.com",
    projectId: "priest-684eb",
    storageBucket: "priest-684eb.firebasestorage.app",
    messagingSenderId: "369214425092",
    appId: "1:369214425092:web:d4a80c4f9991e681f5cd51",
    measurementId: "G-1VNZGRBST7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export { app, db, auth, storage };