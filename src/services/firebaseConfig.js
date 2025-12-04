import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBGp4D25OYgIJg7Kn7t_PKEjjF-d9z4ZlE",
    authDomain: "wumpusverso.firebaseapp.com",
    projectId: "wumpusverso",
    storageBucket: "wumpusverso.firebasestorage.app",
    messagingSenderId: "494465399524",
    appId: "1:494465399524:web:060a84991c772d5fb94af1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);