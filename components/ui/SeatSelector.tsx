import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Seat {
  row: string;
  number: number;
  type: 'standard' | 'vip' | 'couple';
  price: number;
  isAvailable: boolean;
}

interface SeatSelectorProps {
  seats: Seat[][];
  onSeatSelect: (selectedSeats: Seat[]) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ seats, onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatPress = (seat: Seat) => {
    if (!seat.isAvailable) return;

    const isSelected = selectedSeats.some(
      s => s.row === seat.row && s.number === seat.number
    );

    let newSelectedSeats: Seat[];
    if (isSelected) {
      newSelectedSeats = selectedSeats.filter(
        s => !(s.row === seat.row && s.number === seat.number)
      );
    } else {
      newSelectedSeats = [...selectedSeats, seat];
    }

    setSelectedSeats(newSelectedSeats);
    onSeatSelect(newSelectedSeats);
  };

  const getSeatColor = (seat: Seat, isSelected: boolean) => {
    if (!seat.isAvailable) return '#CCCCCC';
    if (isSelected) return '#4CAF50';
    if (seat.type === 'vip') return '#FF9800';
    if (seat.type === 'couple') return '#9C27B0';
    return '#2196F3';
  };

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        <Text style={styles.screenText}>MÀN HÌNH</Text>
      </View>

      <ScrollView style={styles.seatMap}>
        {seats.map((rowSeats, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            <Text style={styles.rowLabel}>{rowSeats[0].row}</Text>
            {rowSeats.map((seat, seatIndex) => {
              const isSelected = selectedSeats.some(
                s => s.row === seat.row && s.number === seat.number
              );
              return (
                <TouchableOpacity
                  key={seatIndex}
                  style={[
                    styles.seat,
                    { backgroundColor: getSeatColor(seat, isSelected) },
                    !seat.isAvailable && styles.seatDisabled,
                  ]}
                  onPress={() => handleSeatPress(seat)}
                  disabled={!seat.isAvailable}
                >
                  <Text style={styles.seatText}>{seat.number}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#2196F3' }]} />
          <Text>Ghế thường</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#FF9800' }]} />
          <Text>VIP</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#9C27B0' }]} />
          <Text>Couple</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#CCCCCC' }]} />
          <Text>Đã bán</Text>
        </View>
      </View>

      {selectedSeats.length > 0 && (
        <View style={styles.selectedSeats}>
          <Text style={styles.selectedSeatsTitle}>Ghế đã chọn:</Text>
          {selectedSeats.map((seat, index) => (
            <Text key={index}>
              {seat.row}{seat.number} - {seat.price.toLocaleString()} VND
            </Text>
          ))}
          <Text style={styles.totalPrice}>
            Tổng cộng: {selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toLocaleString()} VND
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  screen: {
    backgroundColor: '#333',
    paddingVertical: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  screenText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  seatMap: {
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLabel: {
    width: 30,
    fontWeight: 'bold',
  },
  seat: {
    width: 32,
    height: 32,
    margin: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatDisabled: {
    opacity: 0.5,
  },
  seatText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 4,
  },
  selectedSeats: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  selectedSeatsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalPrice: {
    fontWeight: 'bold',
    marginTop: 8,
    color: '#D32F2F',
  },
});

export default SeatSelector;