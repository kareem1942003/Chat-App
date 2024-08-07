import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  // @ts-ignore
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "caht-app19.firebaseapp.com",
  projectId: "caht-app19",
  storageBucket: "caht-app19.appspot.com",
  messagingSenderId: "329846402326",
  appId: "1:329846402326:web:a85d7d9e6241d904a6f437",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
