import {
  Award,
  ChevronRight,
  CreditCard,
  Gift,
  HelpCircle,
  LogOut,
  Settings,
  Star,
  Zap
} from 'lucide-react';
import { Booking } from '../App';

interface ProfileProps {
  userPoints: number;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  bookings: Booking[];
}

const tierConfig = {
  bronze: {
    name: 'Đồng',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
    icon: '🥉',
    nextTier: 'Bạc',
    requiredPoints: 1000,
  },
  silver: {
    name: 'Bạc',
    color: 'text-gray-300',
    bgColor: 'bg-gray-300/10',
    borderColor: 'border-gray-300/20',
    icon: '🥈',
    nextTier: 'Vàng',
    requiredPoints: 3000,
  },
  gold: {
    name: 'Vàng',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
    icon: '🥇',
    nextTier: 'Bạch Kim',
    requiredPoints: 5000,
  },
  platinum: {
    name: 'Bạch Kim',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    icon: '💎',
    nextTier: null,
    requiredPoints: null,
  },
};

export function Profile({ userPoints, membershipTier, bookings }: ProfileProps) {
  const tier = tierConfig[membershipTier];
  const pointsToNext = tier.requiredPoints ? tier.requiredPoints - userPoints : 0;
  const progress = tier.requiredPoints ? (userPoints / tier.requiredPoints) * 100 : 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl mb-6">Tài khoản</h1>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-xl text-white mb-1">Nguyễn Văn A</h2>
              <p className="text-sm text-white/80">nguyenvana@email.com</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{tier.icon}</span>
                <span className="text-white">Hạng {tier.name}</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <Star className="w-4 h-4 fill-white" />
                <span>{userPoints.toLocaleString()} điểm</span>
              </div>
            </div>
            
            {tier.nextTier && (
              <>
                <div className="w-full bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-white/80">
                  Còn {pointsToNext.toLocaleString()} điểm để lên hạng {tier.nextTier}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-2xl text-yellow-400 mb-1">{bookings.length}</div>
            <div className="text-xs text-gray-400">Vé đã đặt</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-2xl text-yellow-400 mb-1">{userPoints}</div>
            <div className="text-xs text-gray-400">Điểm tích lũy</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-2xl text-yellow-400 mb-1">12</div>
            <div className="text-xs text-gray-400">Ưu đãi</div>
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="px-6 mb-6">
        <h2 className="text-lg mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-yellow-400" />
          Phần thưởng & Ưu đãi
        </h2>
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4 border border-yellow-500/30 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm mb-1">Giảm 50% vé cuối tuần</h3>
              <p className="text-xs text-gray-400">Còn 3 ngày</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm mb-1">Combo bắp nước miễn phí</h3>
              <p className="text-xs text-gray-400">Còn 7 ngày</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-6">
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
          <button className="w-full flex items-center gap-4 px-4 py-4 border-b border-gray-800 active:bg-gray-800 transition-colors">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left">Phương thức thanh toán</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center gap-4 px-4 py-4 border-b border-gray-800 active:bg-gray-800 transition-colors">
            <Award className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left">Hạng thành viên</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center gap-4 px-4 py-4 border-b border-gray-800 active:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left">Cài đặt</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center gap-4 px-4 py-4 border-b border-gray-800 active:bg-gray-800 transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left">Trợ giúp & Hỗ trợ</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center gap-4 px-4 py-4 active:bg-gray-800 transition-colors">
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="flex-1 text-left text-red-400">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Version */}
      <div className="px-6 mt-6 text-center text-xs text-gray-500">
        Phiên bản 1.0.0
      </div>
    </div>
  );
}
