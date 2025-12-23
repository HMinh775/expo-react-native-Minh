import { ChevronLeft, Info } from 'lucide-react';
import { useState } from 'react';
import { Seat } from '../App';

interface SeatSelectionProps {
  selectedSeats: Seat[];
  onSelectSeats: (seats: Seat[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;

  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      let type: 'standard' | 'vip' | 'couple' = 'standard';
      let price = 85000;
      let status: 'available' | 'taken' | 'selected' = 'available';

      // VIP seats in middle rows
      if (rowIndex >= 3 && rowIndex <= 5 && i >= 4 && i <= 7) {
        type = 'vip';
        price = 120000;
      }

      // Couple seats in back row
      if (rowIndex === 7 && i >= 4 && i <= 7 && i % 2 === 0) {
        type = 'couple';
        price = 180000;
      }

      // Random taken seats
      if (Math.random() > 0.7) {
        status = 'taken';
      }

      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type,
        status,
        price,
      });
    }
  });

  return seats;
};

export function SeatSelection({ selectedSeats, onSelectSeats, onContinue, onBack }: SeatSelectionProps) {
  const [seats, setSeats] = useState<Seat[]>(generateSeats());

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'taken') return;

    const updatedSeats = seats.map((s) => {
      if (s.id === seat.id) {
        return { ...s, status: s.status === 'selected' ? 'available' : 'selected' } as Seat;
      }
      return s;
    });

    setSeats(updatedSeats);
    const selected = updatedSeats.filter((s) => s.status === 'selected');
    onSelectSeats(selected);
  };

  const total = seats
    .filter((s) => s.status === 'selected')
    .reduce((sum, s) => sum + s.price, 0);

  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-32">
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
            <h1 className="text-lg">Chọn ghế</h1>
            <p className="text-sm text-gray-400">
              {selectedSeats.length} ghế đã chọn
            </p>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="px-6 py-8">
        <div className="relative mb-8">
          <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full"></div>
          <p className="text-center text-xs text-gray-400 mt-2">Màn hình</p>
        </div>

        {/* Seats Grid */}
        <div className="space-y-3 mb-8">
          {Object.keys(seatsByRow).map((row) => (
            <div key={row} className="flex items-center gap-2">
              <div className="w-6 text-center text-sm text-gray-400">{row}</div>
              <div className="flex-1 flex justify-center gap-2">
                {seatsByRow[row].map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === 'taken'}
                    className={`w-7 h-7 rounded-t-lg transition-all ${
                      seat.status === 'taken'
                        ? 'bg-gray-700 cursor-not-allowed'
                        : seat.status === 'selected'
                        ? 'bg-yellow-500 scale-110'
                        : seat.type === 'vip'
                        ? 'bg-purple-600 hover:bg-purple-500'
                        : seat.type === 'couple'
                        ? 'bg-pink-600 hover:bg-pink-500'
                        : 'bg-gray-600 hover:bg-gray-500'
                    } ${seat.type === 'couple' && seat.number % 2 === 0 ? 'mr-2' : ''}`}
                  >
                    {seat.type === 'couple' && (
                      <div className="text-[8px]">❤️</div>
                    )}
                  </button>
                ))}
              </div>
              <div className="w-6 text-center text-sm text-gray-400">{row}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2 text-xs">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Chú thích</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-600 rounded-t-lg"></div>
              <span className="text-gray-300">Thường - 85k</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-600 rounded-t-lg"></div>
              <span className="text-gray-300">VIP - 120k</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-pink-600 rounded-t-lg"></div>
              <span className="text-gray-300">Đôi - 180k</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-700 rounded-t-lg"></div>
              <span className="text-gray-300">Đã đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-500 rounded-t-lg"></div>
              <span className="text-gray-300">Đang chọn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                Ghế: {selectedSeats.map((s) => s.id).join(', ')}
              </p>
              <p className="text-2xl text-yellow-400">{total.toLocaleString()}đ</p>
            </div>
          </div>
          <button
            onClick={onContinue}
            className="w-full bg-yellow-500 text-gray-900 py-4 rounded-xl transition-all active:scale-95"
          >
            Tiếp tục
          </button>
        </div>
      )}
    </div>
  );
}
