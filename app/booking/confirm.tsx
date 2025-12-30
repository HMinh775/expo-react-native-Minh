import {
  Armchair,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Home as HomeIcon,
  MapPin,
  Share2
} from 'lucide-react';
import { Booking } from '../App';

interface BookingConfirmationProps {
  booking: Booking;
  onDone: () => void;
}

export function BookingConfirmation({ booking, onDone }: BookingConfirmationProps) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Success Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-2xl text-center mb-2">Đặt vé thành công!</h1>
        <p className="text-gray-400 text-center mb-8">
          Vé của bạn đã sẵn sàng
        </p>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-2xl mb-8">
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">📱</div>
              <p className="text-xs text-gray-600">QR Code</p>
              <p className="text-xs text-gray-400">{booking.qrCode}</p>
            </div>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 mb-6">
          {/* Movie Info */}
          <div className="flex gap-4 p-4 border-b border-gray-800">
            <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={booking.movie.poster} 
                alt={booking.movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 line-clamp-2">{booking.movie.title}</h3>
              <p className="text-sm text-gray-400">{booking.movie.ageRating} • {booking.movie.duration}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">Rạp chiếu</p>
                <p className="text-gray-200">{booking.cinema.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">Ngày chiếu</p>
                <p className="text-gray-200">{booking.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">Suất chiếu</p>
                <p className="text-gray-200">{booking.showtime.time} • {booking.showtime.type}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Armchair className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">Ghế ngồi</p>
                <p className="text-gray-200">{booking.seats.map(s => `${s.row}${s.number}`).join(', ')}</p>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tổng thanh toán</span>
                <span className="text-xl text-yellow-400">{booking.total.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 text-white py-3 rounded-xl active:scale-95 transition-all">
            <Download className="w-5 h-5" />
            Tải vé xuống
          </button>
          <button className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 text-white py-3 rounded-xl active:scale-95 transition-all">
            <Share2 className="w-5 h-5" />
            Chia sẻ
          </button>
        </div>

        {/* Points Earned */}
        <div className="w-full mt-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Bạn đã nhận được</p>
              <p className="text-xl text-yellow-400">+{Math.floor(booking.total / 1000)} điểm</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-6 pb-8">
        <button
          onClick={onDone}
          className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 py-4 rounded-xl active:scale-95 transition-all"
        >
          <HomeIcon className="w-5 h-5" />
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
