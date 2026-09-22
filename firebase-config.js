// firebase-config.js - Firebase Initialization & Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot, 
    arrayUnion, 
    arrayRemove, 
    writeBatch 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// =========================================================================
// FIREBASE CONFIGURATION
// =========================================================================
export const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDM7Y7MkMAh_cuR7TUOuoBEYtaTqXY-fXs",
    authDomain: "padel-hub-20df4.firebaseapp.com",
    projectId: "padel-hub-20df4",
    storageBucket: "padel-hub-20df4.firebasestorage.app",
    messagingSenderId: "18892097053",
    appId: "1:18892097053:web:4263b9843abf1fbf1468f4"
};

// Shared member account email (members only type the password in the UI)
export const MEMBER_EMAIL = "members@padel.club";

// Check if user saved a custom config in localStorage
const storedConfig = localStorage.getItem('padel_firebase_config');
export const FIREBASE_CONFIG = storedConfig ? JSON.parse(storedConfig) : DEFAULT_FIREBASE_CONFIG;

export function isFirebaseConfigured() {
    return FIREBASE_CONFIG && 
           FIREBASE_CONFIG.apiKey && 
           !FIREBASE_CONFIG.apiKey.startsWith("YOUR_");
}

let app = null;
let db = null;
let auth = null;
const googleProvider = new GoogleAuthProvider();

if (isFirebaseConfigured()) {
    try {
        app = initializeApp(FIREBASE_CONFIG);
        db = getFirestore(app);
        auth = getAuth(app);
    } catch (err) {
        console.error("Error initializing Firebase:", err);
    }
}

export { 
    app, 
    db, 
    auth, 
    googleProvider,
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    onSnapshot, 
    arrayUnion, 
    arrayRemove, 
    writeBatch,
    signInWithEmailAndPassword, 
    signInWithPopup,
    signOut,
    onAuthStateChanged 
};
