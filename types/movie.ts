export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  duration: string;
  category: string[]; // Mảng các thể loại
  releaseDate: string;
  director: string;
  cast: string[];
  description: string;
  price: number;
  trailerUrl?: string; // Dấu ? nghĩa là không bắt buộc
}