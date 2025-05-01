import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDZ5pmQ6l-SAWiREpk8S5fXpotzPoy61qs",
    authDomain: "priest-ai.firebaseapp.com",
    projectId: "priest-ai",
    storageBucket: "priest-ai.firebasestorage.app",
    messagingSenderId: "44447008185",
    appId: "1:44447008185:web:23bf557aa87dc2c00e2268",
    measurementId: "G-KB3T45DLDW"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export { app, db, auth, storage };