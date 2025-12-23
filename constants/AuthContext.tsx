//trang kiên kết profile với login register
import React, { createContext, useContext, useState } from 'react';

// 1. Định nghĩa kiểu dữ liệu cho User (Thêm password vào đây)
type UserType = {
  name: string;
  email: string;
  avatar: string;
  password?: string; // Thêm dấu ? để không bắt buộc nếu login bằng Google/Facebook
} | null;

// 2. Định nghĩa những gì Context sẽ cung cấp
type AuthContextType = {
  isLoggedIn: boolean;
  user: UserType;
  login: (userData: any) => void;
  logout: () => void;
};

// 3. Tạo Context mặc định
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

// 4. Tạo Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType>(null);

  // Hàm xử lý khi đăng nhập thành công
  const login = (userData: any) => {
    setUser({
      name: userData.name || 'Nguyễn Văn A',
      email: userData.email || 'nguyenvana@email.com',
      avatar: 'https://via.placeholder.com/150',
      // Lưu mật khẩu vào state (Lưu ý: Thực tế không nên lưu pass ở đây, nhưng làm demo thì ok)
      password: userData.password || '123456', 
    });
    setIsLoggedIn(true);
  };

  // Hàm xử lý đăng xuất
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Tạo Hook dùng chung
export const useAuth = () => useContext(AuthContext);