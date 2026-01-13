import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// Dán config thật của bạn vào đây
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
const db = getFirestore(app);

async function getMyMovies() {
  console.log("--- DANH SÁCH 12 PHIM CỦA BẠN ---\n");
  try {
    const querySnapshot = await getDocs(collection(db, "movies"));
    const moviesList = [];
    
    querySnapshot.forEach((doc) => {
      // Lấy ID và Tiêu đề phim
      moviesList.push({ id: doc.id, title: doc.data().title });
    });

    console.log(JSON.stringify(moviesList, null, 2));
    console.log("\n---------------------------------");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

getMyMovies();