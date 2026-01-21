import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

type FAQItemType = {
  id: number;
  question: string;
  answer: string;
  icon: string;
  category: string;
};

const FAQ_DATA: FAQItemType[] = [
  {
    id: 1,
    question: "Làm thế nào để hoàn tiền vé đã mua?",
    answer: "Bạn có thể hoàn tiền trong vòng 24 giờ trước giờ chiếu. Vào mục 'Vé của tôi', chọn vé cần hoàn và nhấn 'Yêu cầu hoàn tiền'. Tiền sẽ được hoàn về tài khoản trong 3-5 ngày làm việc.",
    icon: "cash-outline",
    category: "Thanh toán"
  },
  {
    id: 2,
    question: "Tôi không nhận được email xác nhận đặt vé?",
    answer: "Vui lòng kiểm tra thư mục spam/quảng cáo. Nếu vẫn không thấy, vào 'Vé của tôi' để xem vé đã đặt. Bạn cũng có thể yêu cầu gửi lại email xác nhận từ trang chi tiết vé.",
    icon: "mail-outline",
    category: "Đặt vé"
  },
  {
    id: 3,
    question: "Cách thay đổi suất chiếu đã đặt?",
    answer: "Chỉ có thể đổi suất chiếu trước 2 giờ so với giờ chiếu ban đầu. Vào 'Vé của tôi', chọn 'Đổi suất chiếu' và chọn suất mới. Sẽ có phí đổi vé 10.000đ.",
    icon: "time-outline",
    category: "Đặt vé"
  },
  {
    id: 4,
    question: "Làm sao để tích điểm thành viên?",
    answer: "Mỗi 10.000đ chi tiêu = 1 điểm. Điểm sẽ tự động tích lũy sau mỗi lần đặt vé thành công. Tích đủ 100 điểm được giảm 10% cho lần đặt tiếp theo.",
    icon: "trophy-outline",
    category: "Thành viên"
  },
  {
    id: 5,
    question: "Ứng dụng có hỗ trợ thanh toán MoMo không?",
    answer: "Có! Chúng tôi hỗ trợ MoMo, ZaloPay, VNPay, thẻ Visa/Master và thanh toán tại quầy. Mọi giao dịch đều được bảo mật SSL 256-bit.",
    icon: "phone-portrait-outline",
    category: "Thanh toán"
  },
  {
    id: 6,
    question: "Tôi quên mật khẩu tài khoản?",
    answer: "Nhấn 'Quên mật khẩu' tại màn hình đăng nhập, nhập email đăng ký. Hệ thống sẽ gửi link đặt lại mật khẩu về email của bạn.",
    icon: "lock-closed-outline",
    category: "Tài khoản"
  },
  {
    id: 7,
    question: "Có thể đặt vé combo bắp nước không?",
    answer: "Được! Khi chọn ghế, bạn sẽ thấy mục 'Combo Ưu Đãi'. Chọn combo mong muốn và thanh toán cùng lúc với vé xem phim.",
    icon: "fast-food-outline",
    category: "Combo"
  },
  {
    id: 8,
    question: "Làm sao để mua vé nhóm/đoàn?",
    answer: "Liên hệ hotline 1900 1234 để được hỗ trợ đặt vé nhóm từ 10 người trở lên. Ưu đãi giảm 15% cho đoàn từ 20 người.",
    icon: "people-outline",
    category: "Nhóm"
  }
];

const CONTACT_METHODS = [
  {
    id: 1,
    title: "Tổng đài 24/7",
    subtitle: "1900 1234",
    icon: "call",
    color: ["#00E5FF", "#00B8D4"],
    action: () => Linking.openURL('tel:19001234')
  },
  {
    id: 2,
    title: "Email hỗ trợ",
    subtitle: "support@moviebox.vn",
    icon: "mail",
    color: ["#FF4081", "#F50057"],
    action: () => Linking.openURL('mailto:support@moviebox.vn')
  },
  {
    id: 3,
    title: "Chat trực tuyến",
    subtitle: "Phản hồi nhanh",
    icon: "chatbubble-ellipses",
    color: ["#7C4DFF", "#651FFF"],
    action: () => console.log("Open chat")
  },
  {
    id: 4,
    title: "Fanpage",
    subtitle: "MovieBox Official",
    icon: "logo-facebook",
    color: ["#2196F3", "#1976D2"],
    action: () => Linking.openURL('https://facebook.com/moviebox')
  }
];

export default function HelpScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  
  const categories = ['Tất cả', 'Đặt vé', 'Thanh toán', 'Thành viên', 'Combo', 'Tài khoản', 'Nhóm'];

  const filteredFAQs = selectedCategory === 'Tất cả' 
    ? FAQ_DATA 
    : FAQ_DATA.filter(item => item.category === selectedCategory);

  const FAQItem = ({ item }: { item: FAQItemType }) => {
    const isExpanded = expandedId === item.id;
    
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.faqCard}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <LinearGradient
          colors={isExpanded ? ['#1E2A47', '#0F1A2E'] : ['#161626', '#12121E']}
          style={styles.faqGradient}
        >
          <View style={styles.faqHeader}>
            <View style={styles.faqIconContainer}>
              <Ionicons name={item.icon as any} size={20} color="#00E5FF" />
            </View>
            <View style={styles.faqQuestionContainer}>
              <Text style={styles.faqCategory}>{item.category}</Text>
              <Text style={styles.faqQuestion}>{item.question}</Text>
            </View>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#00E5FF" 
            />
          </View>
          
          {isExpanded && (
            <Animated.View style={styles.faqAnswerContainer}>
              <View style={styles.answerDivider} />
              <Text style={styles.faqAnswer}>{item.answer}</Text>
              <TouchableOpacity style={styles.helpfulButton}>
                <Text style={styles.helpfulText}>Hữu ích? 👍</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0A0F1C', '#121828', '#1A2344']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header */}
      <LinearGradient
        colors={['rgba(10, 15, 28, 0.9)', 'rgba(10, 15, 28, 0.7)']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#00E5FF" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Trung tâm hỗ trợ</Text>
            <Text style={styles.headerSubtitle}>Chúng tôi luôn sẵn sàng hỗ trợ bạn</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="help-circle" size={24} color="#00E5FF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Hero Banner */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#00E5FF', '#0097A7']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="headset" size={40} color="#fff" />
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>Hỗ trợ 24/7</Text>
              <Text style={styles.heroSubtitle}>Đội ngũ chăm sóc khách hàng luôn sẵn sàng</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Contact Methods Grid */}
        <Text style={styles.sectionTitle}>Liên hệ nhanh</Text>
        <View style={styles.contactGrid}>
          {CONTACT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.contactCard}
              activeOpacity={0.8}
              onPress={method.action}
            >
              <LinearGradient
                colors={method.color as [string, string]} 
                style={styles.contactGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={method.icon as any} size={28} color="#fff" />
                <Text style={styles.contactCardTitle}>{method.title}</Text>
                <Text style={styles.contactCardSubtitle}>{method.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Categories */}
        <Text style={styles.sectionTitle}>Danh mục hỗ trợ</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </Text>
              {selectedCategory === category && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ List */}
        <Text style={styles.sectionTitle}>
          Câu hỏi thường gặp ({filteredFAQs.length})
        </Text>
        {filteredFAQs.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}

        {/* Additional Help Section */}
        <View style={styles.additionalHelp}>
          <Text style={styles.additionalTitle}>Cần hỗ trợ thêm?</Text>
          <Text style={styles.additionalText}>
            Nếu không tìm thấy câu trả lời, đừng ngần ngại liên hệ trực tiếp với chúng tôi
          </Text>
          <TouchableOpacity 
            style={styles.contactNowButton}
            onPress={() => Linking.openURL('tel:19001234')}
          >
            <LinearGradient
              colors={['#00E5FF', '#0097A7']}
              style={styles.contactNowGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.contactNowText}>Liên hệ ngay</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>MovieBox Cinema</Text>
          <Text style={styles.footerText}>Hệ thống rạp chiếu phim hàng đầu Việt Nam</Text>
          <Text style={styles.footerCopyright}>© 2024 MovieBox. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* Help Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#00E5FF', '#0097A7']}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Hướng dẫn sử dụng</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalSection}>📱 Đặt vé nhanh</Text>
              <Text style={styles.modalText}>• Chọn phim → Chọn rạp → Chọn suất → Chọn ghế → Thanh toán</Text>
              
              <Text style={styles.modalSection}>🎟️ Sử dụng vé</Text>
              <Text style={styles.modalText}>• Hiển thị mã QR tại quầy vé hoặc quầy soát vé</Text>
              
              <Text style={styles.modalSection}>⭐ Tích điểm thành viên</Text>
              <Text style={styles.modalText}>• Mỗi 10.000đ = 1 điểm • 100 điểm = giảm 10%</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1C',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 30,
  },
  heroGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  heroTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  contactCard: {
    width: (width - 60) / 2,
    height: 120,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  contactGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 4,
  },
  contactCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingBottom: 15,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: '#00E5FF',
  },
  categoryText: {
    color: '#8A8D9B',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#00E5FF',
    fontWeight: 'bold',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E5FF',
    marginTop: 4,
  },
  faqCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  faqGradient: {
    padding: 20,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  faqQuestionContainer: {
    flex: 1,
    marginRight: 10,
  },
  faqCategory: {
    fontSize: 11,
    color: '#00E5FF',
    fontWeight: '600',
    marginBottom: 4,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 22,
  },
  faqAnswerContainer: {
    marginTop: 15,
  },
  answerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
  },
  faqAnswer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 15,
  },
  helpfulButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  helpfulText: {
    color: '#00E5FF',
    fontSize: 13,
    fontWeight: '500',
  },
  additionalHelp: {
    backgroundColor: 'rgba(26, 35, 68, 0.5)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  additionalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  additionalText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  contactNowButton: {
    alignSelf: 'stretch',
  },
  contactNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    elevation: 5,
  },
  contactNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
  },
  footerCopyright: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A2344',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalClose: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginTop: 15,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    marginBottom: 10,
  },
});