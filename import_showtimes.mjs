import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";

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

const movieIds = [
  "movie_001", "movie_002", "movie_003", "movie_004", "movie_005", "movie_006",
  "movie_007", "movie_008", "movie_009", "movie_010", "movie_011", "movie_012"
];
const cinemaIds = ["cin_01", "cin_02", "cin_03", "cin_04"];

// Các bộ khung giờ khác nhau để không bị trùng lặp chán ngắt
const timeBundles = [
  ["08:00", "11:15", "14:30", "18:00", "21:30"],
  ["09:30", "12:45", "15:00", "19:15", "22:45"],
  ["10:00", "13:15", "16:30", "20:00", "23:15"],
  ["07:30", "10:45", "14:00", "17:30", "21:00"]
];

async function startImport() {
  console.log("🚀 Đang dọn dẹp showtimes cũ...");
  const snap = await getDocs(collection(db, "showtimes"));
  for (const d of snap.docs) await deleteDoc(doc(db, "showtimes", d.id));

  console.log("🚀 Đang nạp dữ liệu suất chiếu cho 7 ngày tới...");

  try {
    let count = 0;

    // Lặp qua 7 ngày (từ hôm nay)
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      const dateString = d.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD

      console.log(`--- Đang nạp cho ngày: ${dateString} ---`);

      // Lặp qua từng bộ phim
      for (let i = 0; i < movieIds.length; i++) {
        const movieId = movieIds[i];

        // Mỗi phim cho xuất hiện ở 2-3 rạp ngẫu nhiên mỗi ngày
        const numCinemas = 2 + Math.floor(Math.random() * 2); 
        const shuffledCinemas = [...cinemaIds].sort(() => 0.5 - Math.random());
        const selectedCinemas = shuffledCinemas.slice(0, numCinemas);

        for (const cinemaId of selectedCinemas) {
          await addDoc(collection(db, "showtimes"), {
            movieId: movieId,
            cinemaId: cinemaId,
            date: dateString,
            times: timeBundles[Math.floor(Math.random() * timeBundles.length)]
          });
          count++;
        }
      }
    }

    console.log(`\n🔥 THÀNH CÔNG! Đã tạo tổng cộng ${count} suất chiếu.`);
    console.log("Bây giờ bạn có thể mở App, chọn bất kỳ ngày nào hay rạp nào cũng sẽ thấy đầy ắp phim!");
    process.exit(0);
  } catch (e) {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  }
}

startImport();