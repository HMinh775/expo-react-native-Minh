import { auth, db } from '@/configs/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// ==================== CONSTANTS ====================
const SEAT_CONFIG = {
  ROWS: ['A', 'B', 'C', 'D', 'E', 'F'],
  COLS: [1, 2, 3, 4, 5, 6, 7, 8],
  MAX_SEATS_PER_BOOKING: 8,
};

// ==================== TYPES ====================
interface SeatData {
  seats: string[] | string;
  screeningId: string;
}

interface Voucher {
  code: string;
  discount: number; // % hoặc số tiền
  type: 'percent' | 'fixed'; // % hoặc giảm cố định
  minAmount?: number; // Số tiền tối thiểu để áp dụng
}

// Mock data voucher - bạn có thể fetch từ Firestore
const MOCK_VOUCHERS: Voucher[] = [
  { code: 'GIAM20K', discount: 20000, type: 'fixed', minAmount: 100000 },
  { code: 'GIAM15', discount: 15, type: 'percent', minAmount: 50000 },
  { code: 'NEWYEAR', discount: 50000, type: 'fixed', minAmount: 150000 },
];

// ==================== MAIN COMPONENT ====================
export default function BookingScreen() {
  const router = useRouter();
  const { screeningId, movieId, title, price, time, date, cinemaName, image } = useLocalSearchParams();
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Voucher states
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // ==================== VALIDATION ====================
  useEffect(() => {
    validateParams();
  }, []);

  const validateParams = () => {
    if (!screeningId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin suất chiếu');
      router.back();
    }
  };

  // ==================== FETCH BOOKED SEATS ====================
  useEffect(() => {
    if (!screeningId) return;

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('screeningId', '==', screeningId)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookedSeatsSet = extractBookedSeats(snapshot.docs);
        setBookedSeats(Array.from(bookedSeatsSet));
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching booked seats:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin ghế đã đặt');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [screeningId]);

  // ==================== HELPER FUNCTIONS ====================
  
  const extractBookedSeats = (docs: any[]): Set<string> => {
    const bookedSeatsSet = new Set<string>();
    
    docs.forEach((doc) => {
      const data = doc.data() as SeatData;
      if (data.seats) {
        const seatsList = normalizeSeatsData(data.seats);
        seatsList.forEach((seat) => bookedSeatsSet.add(seat.trim()));
      }
    });
    
    return bookedSeatsSet;
  };

  const normalizeSeatsData = (seats: string[] | string): string[] => {
    return Array.isArray(seats) ? seats : seats.split(',').map(s => s.trim());
  };

  const isSeatSelected = (seatId: string): boolean => {
    return selectedSeats.includes(seatId);
  };

  const isSeatBooked = (seatId: string): boolean => {
    return bookedSeats.includes(seatId);
  };

  // ==================== PRICE CALCULATION ====================
  
  const calculateSubtotal = (): number => {
    return selectedSeats.length * Number(price || 0);
  };

  const calculateDiscount = (): number => {
    if (!appliedVoucher) return 0;
    
    const subtotal = calculateSubtotal();
    
    if (appliedVoucher.type === 'percent') {
      return Math.floor(subtotal * appliedVoucher.discount / 100);
    }
    
    return appliedVoucher.discount;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() - calculateDiscount();
  };

  // ==================== VOUCHER FUNCTIONS ====================
  
  const applyVoucher = () => {
    if (!voucherCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã giảm giá');
      return;
    }

    const voucher = MOCK_VOUCHERS.find(v => v.code.toUpperCase() === voucherCode.trim().toUpperCase());
    
    if (!voucher) {
      Alert.alert('Lỗi', 'Mã giảm giá không hợp lệ');
      return;
    }
    
    const subtotal = calculateSubtotal();
    if (voucher.minAmount && subtotal < voucher.minAmount) {
      Alert.alert(
        'Không đủ điều kiện',
        `Cần đặt tối thiểu ${voucher.minAmount.toLocaleString('vi-VN')}đ để áp dụng mã này`
      );
      return;
    }
    
    setAppliedVoucher(voucher);
    setVoucherCode(voucher.code);
    setShowVoucherModal(false);
    Alert.alert('Thành công', `Đã áp dụng mã giảm giá ${voucher.code}`);
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  // ==================== SEAT SELECTION ====================
  
  const toggleSeat = (seatId: string) => {
    if (isSeatBooked(seatId)) return;

    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatId)) {
        return prevSeats.filter((seat) => seat !== seatId);
      }

      if (prevSeats.length >= SEAT_CONFIG.MAX_SEATS_PER_BOOKING) {
        Alert.alert(
          'Giới hạn ghế',
          `Bạn chỉ có thể chọn tối đa ${SEAT_CONFIG.MAX_SEATS_PER_BOOKING} ghế`
        );
        return prevSeats;
      }

      return [...prevSeats, seatId];
    });
  };

  // ==================== NAVIGATION ====================
  
  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một ghế');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để tiếp tục đặt vé',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }

    navigateToCheckout();
  };

  const navigateToCheckout = () => {
  // Thêm console log để kiểm tra trước khi chuyển trang
  console.log("Đang chuyển sang Checkout với ID:", screeningId);

  router.push({
    pathname: '/checkout',
    params: {
      screeningId: screeningId as string, // BẮT BUỘC
      movieId: movieId as string,         // BẮT BUỘC
      title: title as string,
      image: image as string,
      price: price as string,
      time: time as string,
      date: date as string,
      cinema: cinemaName as string,       // Đổi tên từ cinemaName thành cinema cho khớp với Checkout/Momo
      seats: selectedSeats.join(', '),
      totalPrice: calculateTotal().toString(), // Đảm bảo truyền biến này
    }
  });
};

  // ==================== RENDER FUNCTIONS ====================
  
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerInfo}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle}>
          {cinemaName} • {time}
        </Text>
      </View>
    </View>
  );

  const renderScreen = () => (
    <View style={styles.screen}>
      <View style={styles.screenLine} />
      <Text style={styles.screenText}>MÀN HÌNH</Text>
    </View>
  );

  const renderSeat = (seatId: string) => {
    const isSelected = isSeatSelected(seatId);
    const isBooked = isSeatBooked(seatId);
    const col = seatId.slice(1);

    return (
      <TouchableOpacity
        key={seatId}
        disabled={isBooked}
        onPress={() => toggleSeat(seatId)}
        style={[
          styles.seat,
          isSelected && styles.seatSelected,
          isBooked && styles.seatBooked,
        ]}
        activeOpacity={0.7}
      >
        <Text style={[styles.seatNumber, isSelected && styles.seatNumberSelected]}>
          {isBooked ? '✕' : col}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSeatMap = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00E5FF" />
          <Text style={styles.loadingText}>Đang tải sơ đồ ghế...</Text>
        </View>
      );
    }

    return (
      <View style={styles.seatMap}>
        {SEAT_CONFIG.ROWS.map((row) => (
          <View key={row} style={styles.seatRow}>
            <Text style={styles.rowLabel}>{row}</Text>
            {SEAT_CONFIG.COLS.map((col) => renderSeat(`${row}${col}`))}
          </View>
        ))}
      </View>
    );
  };

  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendBox, styles.seat]} />
        <Text style={styles.legendText}>Trống</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendBox, styles.seatSelected]} />
        <Text style={styles.legendText}>Đang chọn</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendBox, styles.seatBooked]} />
        <Text style={styles.legendText}>Đã đặt</Text>
      </View>
    </View>
  );

  const renderVoucherSection = () => (
    <View style={styles.voucherSection}>
      <Text style={styles.sectionTitle}>Mã giảm giá</Text>
      
      {appliedVoucher ? (
        <View style={styles.appliedVoucher}>
          <View style={styles.voucherInfo}>
            <Ionicons name="pricetag" size={20} color="#00E5FF" />
            <View style={styles.voucherDetails}>
              <Text style={styles.voucherCode}>{appliedVoucher.code}</Text>
              <Text style={styles.voucherDiscount}>
                Giảm {appliedVoucher.type === 'percent' 
                  ? `${appliedVoucher.discount}%` 
                  : `${appliedVoucher.discount.toLocaleString('vi-VN')}đ`}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={removeVoucher}>
            <Ionicons name="close-circle" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.voucherButton}
          onPress={() => setShowVoucherModal(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#00E5FF" />
          <Text style={styles.voucherButtonText}>Chọn hoặc nhập mã</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderVoucherModal = () => (
    <Modal
      visible={showVoucherModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowVoucherModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Mã giảm giá</Text>
            <TouchableOpacity onPress={() => setShowVoucherModal(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.voucherInput}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã giảm giá"
              placeholderTextColor="#666"
              value={voucherCode}
              onChangeText={setVoucherCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.applyButton} onPress={applyVoucher}>
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.availableTitle}>Mã khả dụng</Text>
          <ScrollView style={styles.voucherList}>
            {MOCK_VOUCHERS.map((voucher) => (
              <TouchableOpacity
                key={voucher.code}
                style={styles.voucherCard}
                onPress={() => {
                  setVoucherCode(voucher.code);
                  // Không gọi applyVoucher() ở đây, chỉ set code
                }}
              >
                <View style={styles.voucherCardLeft}>
                  <Ionicons name="pricetag" size={24} color="#00E5FF" />
                  <View style={styles.voucherCardInfo}>
                    <Text style={styles.voucherCardCode}>{voucher.code}</Text>
                    <Text style={styles.voucherCardDesc}>
                      Giảm {voucher.type === 'percent' 
                        ? `${voucher.discount}%` 
                        : `${voucher.discount.toLocaleString('vi-VN')}đ`}
                    </Text>
                    {voucher.minAmount && (
                      <Text style={styles.voucherCardMin}>
                        Đơn tối thiểu: {voucher.minAmount.toLocaleString('vi-VN')}đ
                      </Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderPriceBreakdown = () => (
    <View style={styles.priceBreakdown}>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>
          Tạm tính ({selectedSeats.length} ghế)
        </Text>
        <Text style={styles.priceValue}>
          {calculateSubtotal().toLocaleString('vi-VN')}đ
        </Text>
      </View>
      
      {appliedVoucher && (
        <View style={styles.priceRow}>
          <Text style={[styles.priceLabel, { color: '#00E5FF' }]}>
            Giảm giá ({appliedVoucher.code})
          </Text>
          <Text style={[styles.priceValue, { color: '#00E5FF' }]}>
            -{calculateDiscount().toLocaleString('vi-VN')}đ
          </Text>
        </View>
      )}
      
      <View style={styles.divider} />
      
      <View style={styles.priceRow}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalValue}>
          {calculateTotal().toLocaleString('vi-VN')}đ
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerInfo}>
        <Text style={styles.footerTotal}>
          {calculateTotal().toLocaleString('vi-VN')}đ
        </Text>
        <Text style={styles.footerSeats}>
          {selectedSeats.length > 0
            ? `${selectedSeats.join(', ')}`
            : 'Chưa chọn ghế'}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.continueButton,
          selectedSeats.length === 0 && styles.continueButtonDisabled,
        ]}
        onPress={handleProceedToCheckout}
        disabled={selectedSeats.length === 0}
      >
        <Text style={styles.continueButtonText}>TIẾP TỤC</Text>
      </TouchableOpacity>
    </View>
  );

  // ==================== MAIN RENDER ====================
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderScreen()}
        {renderSeatMap()}
        {renderLegend()}
        {renderVoucherSection()}
        {renderPriceBreakdown()}
      </ScrollView>

      {renderFooter()}
      {renderVoucherModal()}
    </SafeAreaView>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1C',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  screen: {
    alignItems: 'center',
    marginVertical: 30,
  },
  screenLine: {
    width: '80%',
    height: 3,
    backgroundColor: '#00E5FF',
    borderRadius: 2,
  },
  screenText: {
    color: '#555',
    fontSize: 10,
    marginTop: 8,
    letterSpacing: 2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  seatMap: {
    paddingHorizontal: 20,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  rowLabel: {
    color: '#00E5FF',
    width: 24,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  seat: {
    width: 32,
    height: 32,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2d2d44',
  },
  seatSelected: {
    backgroundColor: '#00E5FF',
    borderColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  seatBooked: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF5252',
    opacity: 0.7,
  },
  seatNumber: {
    color: '#6b6b8a',
    fontSize: 11,
    fontWeight: '700',
  },
  seatNumberSelected: {
    color: '#0A0F1C',
    fontWeight: '800',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    gap: 24,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  legendText: {
    color: '#a0a0b8',
    fontSize: 13,
    fontWeight: '500',
  },
  voucherSection: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    backgroundColor: '#161626',
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  voucherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2d2d44',
    borderStyle: 'dashed',
  },
  voucherButtonText: {
    color: '#00E5FF',
    fontSize: 14,
    fontWeight: '600',
  },
  appliedVoucher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  voucherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voucherDetails: {
    gap: 4,
  },
  voucherCode: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  voucherDiscount: {
    color: '#00E5FF',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#161626',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  voucherInput: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  applyButton: {
    backgroundColor: '#00E5FF',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#0A0F1C',
    fontWeight: 'bold',
    fontSize: 14,
  },
  availableTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  voucherList: {
    paddingHorizontal: 20,
  },
  voucherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d2d44',
  },
  voucherCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  voucherCardInfo: {
    gap: 4,
    flex: 1,
  },
  voucherCardCode: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  voucherCardDesc: {
    color: '#00E5FF',
    fontSize: 13,
  },
  voucherCardMin: {
    color: '#888',
    fontSize: 11,
  },
  priceBreakdown: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: '#161626',
    borderRadius: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    color: '#888',
    fontSize: 14,
  },
  priceValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#2d2d44',
    marginVertical: 8,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#00E5FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#161626',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  footerInfo: {
    flex: 1,
  },
  footerTotal: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerSeats: {
    color: '#00E5FF',
    fontSize: 12,
    marginTop: 4,
  },
  continueButton: {
    backgroundColor: '#e21221',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  continueButtonDisabled: {
    backgroundColor: '#444',
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});