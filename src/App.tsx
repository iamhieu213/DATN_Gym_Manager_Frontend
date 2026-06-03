import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import AdminLayout from './components/AdminLayout';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === Các Route Công khai (Public Routes) === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* === Các Route Quản trị (Admin Dashboard Routes) === */}
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          {/* Các Route con placeholder cho menu hoạt động */}
          <Route path="members" element={<div className="p-8 text-white">Tính năng quản lý Hội viên đang phát triển...</div>} />
          <Route path="pts" element={<div className="p-8 text-white">Tính năng quản lý Huấn luyện viên đang phát triển...</div>} />
          <Route path="staff" element={<div className="p-8 text-white">Tính năng quản lý Nhân sự đang phát triển...</div>} />
          <Route path="packages" element={<div className="p-8 text-white">Tính năng quản lý Gói tập đang phát triển...</div>} />
          <Route path="bookings" element={<div className="p-8 text-white">Tính năng quản lý Lịch đặt chỗ đang phát triển...</div>} />
          <Route path="payments" element={<div className="p-8 text-white">Tính năng quản lý Thanh toán đang phát triển...</div>} />
          <Route path="reports" element={<div className="p-8 text-white">Tính năng quản lý Báo cáo đang phát triển...</div>} />
          <Route path="equipment" element={<div className="p-8 text-white">Tính năng quản lý Trang thiết bị đang phát triển...</div>} />
          <Route path="maintenance" element={<div className="p-8 text-white">Tính năng quản lý Bảo trì đang phát triển...</div>} />
        </Route>

        {/* Tự động điều hướng về trang chủ nếu URL không khớp */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
