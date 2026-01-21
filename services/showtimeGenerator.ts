import { db } from '@/configs/firebaseConfig';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

export const generateShowtimes = async () => {
  try {
    console.log("Bắt đầu quét và tạo lịch chiếu...");

    // 1. Lấy danh sách phim và rạp hiện có
    const moviesSnap = await getDocs(collection(db, 'movies'));
    const cinemasSnap = await getDocs(collection(db, 'cinemas'));

    const movies = moviesSnap.docs.map(doc => doc.id);
    const cinemas = cinemasSnap.docs.map(doc => doc.id);

    if (movies.length === 0 || cinemas.length === 0) {
      console.log("Không có phim hoặc rạp nào để tạo lịch!");
      return;
    }

    // 2. Tạo danh sách 7 ngày tới (YYYY-MM-DD)
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      next7Days.push(date.toISOString().split('T')[0]);
    }

    // 3. Khung giờ chiếu mẫu (Bạn có thể đổi tùy ý)
    const timeSlots = ['09:00', '12:30', '15:00', '18:15', '20:30', '22:45'];

    // 4. Lặp qua từng ngày để kiểm tra và thêm dữ liệu
    for (const day of next7Days) {
      // Kiểm tra xem ngày đó rạp đã có lịch chiếu nào chưa
      const q = query(collection(db, 'showtimes'), where('date', '==', day));
      const checkSnap = await getDocs(q);

      if (checkSnap.empty) {
        console.log(`Ngày ${day} chưa có lịch, đang khởi tạo...`);

        // Với mỗi rạp, chọn ngẫu nhiên 2-3 phim để chiếu
        for (const cinemaId of cinemas) {
          // Trộn ngẫu nhiên danh sách phim
          const shuffledMovies = [...movies].sort(() => 0.5 - Math.random());
          const selectedMovies = shuffledMovies.slice(0, 3); // Chọn 3 phim ngẫu nhiên cho mỗi rạp

          for (const movieId of selectedMovies) {
            // Chọn ngẫu nhiên 3 khung giờ từ timeSlots
            const randomTimes = [...timeSlots].sort(() => 0.5 - Math.random()).slice(0, 3).sort();

            await addDoc(collection(db, 'showtimes'), {
              movieId: movieId,
              cinemaId: cinemaId,
              date: day,
              times: randomTimes,
              createdAt: new Date().toISOString()
            });
          }
        }
        console.log(`Đã tạo xong lịch cho ngày ${day}`);
      } else {
        console.log(`Ngày ${day} đã có dữ liệu, bỏ qua.`);
      }
    }
    alert("Cập nhật lịch chiếu thành công!");
  } catch (error) {
    console.error("Lỗi khi tạo dữ liệu:", error);
    alert("Có lỗi xảy ra, kiểm tra console.");
  }
};