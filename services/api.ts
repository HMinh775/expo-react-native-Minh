import axios from 'axios';

const API_KEY = 'YOUR_TMDB_API_KEY'; // Đăng ký miễn phí tại themoviedb.org
const BASE_URL = 'https://api.themoviedb.org/3';

export const movieApi = {
  // Lấy danh sách phim đang hot
  getTrending: () => axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=vi`),
  // Lấy phim phổ biến
  getPopular: () => axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=vi`),
  // Lấy phim sắp chiếu
  getUpcoming: () => axios.get(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=vi`),
};

export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';