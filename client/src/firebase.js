import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCSjf5e1F1Hu8uL5UvSAqw1WXRfgV0Py80",
    authDomain: "carefree-29892.firebaseapp.com",
    projectId: "carefree-29892",
    storageBucket: "carefree-29892.firebasestorage.app",
    messagingSenderId: "736297625618",
    appId: "1:736297625618:web:ebd5ace65709efe23950cb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

