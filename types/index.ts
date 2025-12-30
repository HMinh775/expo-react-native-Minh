export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  duration: string;
  genre: string[];
  releaseDate: string;
  director: string;
  cast: string[];
  description: string;
  trailerUrl: string;
}

export interface Theater {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
}

export interface Seat {
  row: string;
  number: number;
  type: 'standard' | 'vip' | 'couple';
  price: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  theaterId: string;
  showtimeId: string;
  seats: Seat[];
  totalPrice: number;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: string;
}