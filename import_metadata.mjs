import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";

// 1. Dán cấu hình Firebase của bạn vào đây
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "movieticketapp-e1382.firebaseapp.com",
    projectId: "movieticketapp-e1382",
    storageBucket: "movieticketapp-e1382.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// THAY ID NÀY BẰNG UID CỦA BẠN (Lấy trong tab Authentication của Firebase)
// Để bạn có thể thấy dữ liệu ngay khi vào App bằng tài khoản của mình
const MY_USER_ID = "thay_uid_cua_ban_vao_day"; 

const data = {
    // 1. Mẫu Phiếu giảm giá
    coupons: [
        { id: "WELCOME50", code: "WELCOME50", discountValue: 50000, minOrder: 100000, isActive: true, expiryDate: Timestamp.fromDate(new Date("2025-12-31")) },
        { id: "GIAM20K", code: "GIAM20K", discountValue: 20000, minOrder: 50000, isActive: true, expiryDate: Timestamp.fromDate(new Date("2025-12-31")) }
    ],
    // 2. Mẫu Phim yêu thích
    favorites: [
        { id: `${MY_USER_ID}_m1`, userId: MY_USER_ID, movieId: "movie_01", title: "Người Nhện: Không còn nhà", poster: "https://image.tmdb.org/t/p/w500/1g0m2zWyQn4kiCeY0PBpSrn6QC.jpg", createdAt: Timestamp.now() }
    ],
    // 3. Mẫu Xem sau
    watchlater: [
        { id: `${MY_USER_ID}_m2`, userId: MY_USER_ID, movieId: "movie_02", title: "Doctor Strange 2", poster: "https://image.tmdb.org/t/p/w500/u9yZbtunniUMsl8pXp9vYp7uAnS.jpg", createdAt: Timestamp.now() }
    ],
    // 4. Mẫu Đánh giá
    reviews: [
        { id: `${MY_USER_ID}_r1`, userId: MY_USER_ID, movieId: "movie_01", movieTitle: "Người Nhện: Không còn nhà", rating: 5, comment: "Phim quá hay, đỉnh cao kỹ xảo!", createdAt: Timestamp.now() }
    ],
    // 5. Mẫu Lịch sử xem
    history: [
        { id: `${MY_USER_ID}_h1`, userId: MY_USER_ID, movieId: "movie_01", title: "Người Nhện: Không còn nhà", poster: "https://image.tmdb.org/t/p/w500/1g0m2zWyQn4kiCeY0PBpSrn6QC.jpg", watchedAt: Timestamp.now() }
    ]
};

async function importData() {
    console.log("🚀 Bắt đầu import dữ liệu...");

    for (const [collName, docs] of Object.entries(data)) {
        console.log(`📦 Đang tạo collection: ${collName}...`);
        for (const item of docs) {
            const docId = item.id;
            const itemToSave = { ...item };
            delete itemToSave.id; // Không lưu trường id dư thừa vào document nội bộ

            await setDoc(doc(db, collName, docId), itemToSave);
            console.log(` ✅ Đã thêm: ${docId}`);
        }
    }

    console.log("🎉 Hoàn thành! Kiểm tra Firebase Console ngay.");
    process.exit();
}

importData().catch(console.error);