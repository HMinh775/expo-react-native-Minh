<<<<<<< HEAD
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function TicketsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vé của tôi</Text>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Bạn chưa có vé nào. Hãy đặt vé ngay!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16 }
});
=======
import { Armchair, Calendar, ChevronRight, Clock, MapPin, QrCode, Ticket as TicketIcon } from 'lucide-react';
import { useState } from 'react';
import { Booking } from '../App';

interface TicketsProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
}

export function Tickets({ bookings, onSelectBooking }: TicketsProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming');
  const pastBookings = bookings.filter((b) => b.status === 'past');

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-gray-950 z-10 px-6 pt-6 pb-4 border-b border-gray-800">
        <h1 className="text-2xl mb-4">Vé của tôi</h1>
        
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'upcoming'
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-900 text-gray-400'
            }`}
          >
            Sắp tới ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'past'
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-900 text-gray-400'
            }`}
          >
            Đã xem ({pastBookings.length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-6 py-6">
        {displayBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <TicketIcon className="w-16 h-16 text-gray-700 mb-4" />
            <p className="text-gray-400 mb-2">
              {activeTab === 'upcoming' ? 'Chưa có vé nào' : 'Chưa có lịch sử'}
            </p>
            <p className="text-sm text-gray-500">
              {activeTab === 'upcoming' 
                ? 'Đặt vé ngay để xem phim yêu thích!'
                : 'Các vé đã sử dụng sẽ hiện ở đây'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 active:scale-98 transition-transform"
              >
                <div className="flex gap-4 p-4">
                  {/* Poster */}
                  <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={booking.movie.poster}
                      alt={booking.movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="mb-2 line-clamp-2">{booking.movie.title}</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{booking.showtime.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{booking.cinema.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Armchair className="w-4 h-4" />
                        <span>{booking.seats.map(s => `${s.row}${s.number}`).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                {activeTab === 'upcoming' && (
                  <div className="border-t border-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <QrCode className="w-5 h-5" />
                      <span className="text-sm">Xem mã QR</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
>>>>>>> 7bd92f365153ec1161411497496a958028054476
