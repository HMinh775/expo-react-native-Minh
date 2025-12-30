import { ChevronLeft, MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';
import { Cinema, Movie, Showtime } from '../App';

interface ShowtimeSelectionProps {
  movie: Movie;
  onSelectShowtime: (cinema: Cinema, showtime: Showtime, date: string) => void;
  onBack: () => void;
}

const cinemas: Cinema[] = [
  { id: '1', name: 'CGV Vincom Center', address: '191 Bà Triệu, Hai Bà Trưng, Hà Nội', distance: '2.5 km' },
  { id: '2', name: 'Lotte Cinema Landmark', address: 'Tầng 5, Vincom Bà Triệu, Hà Nội', distance: '3.1 km' },
  { id: '3', name: 'Galaxy Cinema Trần Quang Khải', address: '123 Trần Quang Khải, Hoàn Kiếm, Hà Nội', distance: '4.2 km' },
  { id: '4', name: 'BHD Star Cineplex', address: 'Tầng 3, TTTM Vincom Royal City', distance: '5.8 km' },
];

const showtimes: Showtime[] = [
  { id: '1', time: '09:30', type: '2D Phụ đề', price: 75000 },
  { id: '2', time: '11:45', type: '2D Phụ đề', price: 75000 },
  { id: '3', time: '14:00', type: '2D Phụ đề', price: 85000 },
  { id: '4', time: '16:15', type: '3D Phụ đề', price: 105000 },
  { id: '5', time: '18:30', type: '2D Phụ đề', price: 95000 },
  { id: '6', time: '20:45', type: '3D Phụ đề', price: 115000 },
  { id: '7', time: '23:00', type: '2D Phụ đề', price: 85000 },
];

const getNextDays = () => {
  const days = [];
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      date: date.getDate(),
      month: date.getMonth() + 1,
      weekday: weekdays[date.getDay()],
      full: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
    });
  }
  return days;
};

export function ShowtimeSelection({ movie, onSelectShowtime, onBack }: ShowtimeSelectionProps) {
  const days = getNextDays();
  const [selectedDate, setSelectedDate] = useState(days[0].full);
  const [selectedCinema, setSelectedCinema] = useState(cinemas[0]);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950 z-10 border-b border-gray-800">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg line-clamp-1">{movie.title}</h1>
            <p className="text-sm text-gray-400">Chọn suất chiếu</p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="px-6 py-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3">
            {days.map((day) => (
              <button
                key={day.full}
                onClick={() => setSelectedDate(day.full)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all ${
                  selectedDate === day.full
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-gray-900 text-gray-300'
                }`}
              >
                <span className="text-xs">{day.weekday}</span>
                <span className="text-lg">{day.date}</span>
                <span className="text-xs">Th{day.month}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cinemas */}
      <div className="px-6 py-6">
        {cinemas.map((cinema) => (
          <div
            key={cinema.id}
            className={`mb-6 bg-gray-900 rounded-2xl overflow-hidden border transition-all ${
              selectedCinema.id === cinema.id ? 'border-yellow-500' : 'border-gray-800'
            }`}
          >
            {/* Cinema Header */}
            <button
              onClick={() => setSelectedCinema(cinema)}
              className="w-full px-4 py-4 text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="flex-1 pr-4">{cinema.name}</h3>
                <div className="flex items-center gap-1 text-xs text-yellow-400 flex-shrink-0">
                  <Navigation className="w-3 h-3" />
                  {cinema.distance}
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{cinema.address}</span>
              </div>
            </button>

            {/* Showtimes */}
            {selectedCinema.id === cinema.id && (
              <div className="border-t border-gray-800 p-4">
                <div className="grid grid-cols-3 gap-3">
                  {showtimes.map((showtime) => (
                    <button
                      key={showtime.id}
                      onClick={() => onSelectShowtime(cinema, showtime, selectedDate)}
                      className="bg-gray-800 hover:bg-yellow-500 hover:text-gray-900 active:scale-95 rounded-xl p-3 transition-all"
                    >
                      <div className="text-lg mb-1">{showtime.time}</div>
                      <div className="text-xs text-gray-400 mb-1">{showtime.type}</div>
                      <div className="text-xs">{(showtime.price / 1000).toFixed(0)}k</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
