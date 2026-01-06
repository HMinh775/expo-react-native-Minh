import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtU6SOW_f9sZlj8dN0hRkwESIIJfPEb0U",
  authDomain: "movieticketapp-e1382.firebaseapp.com",
  projectId: "movieticketapp-e1382",
  storageBucket: "movieticketapp-e1382.firebasestorage.app",
  messagingSenderId: "1071517278238",
  appId: "1:1071517278238:web:dae37d66864e2f985a4e0f",
  measurementId: "G-SWWS12JHVC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase đã khởi tạo:", app.name);