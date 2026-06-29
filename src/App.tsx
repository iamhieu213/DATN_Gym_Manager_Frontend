import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authRoutes } from './routes/auth.routes';
import { adminRoutes } from './routes/admin.routes';
import './App.css';
import DashboardDispatcher from './components/DashboardDispatcher';
import { userRoutes } from './routes/user.routes'; // Thêm dòng import này

// Load lazy trang Landing chính
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
// Giao diện loading đơn giản khi tải các trang lazy
const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-content">
      <div className="loader-spinner" />
      <span className="loader-text">ĐANG TẢI DỮ LIỆU...</span>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* 1. Trang chủ công khai */}
          <Route path="/" element={<LandingPage />} />

          <Route path="/dashboard" element={<DashboardDispatcher />} />

          {/* 2. Nhóm Route Xác thực (Auth Module Routes) */}
          {authRoutes}

          {/* 3. Nhóm Route Quản lý Admin (Dashboard Layout & Routes) */}
          {adminRoutes}
          {userRoutes} 

          {/* Tự động điều hướng về trang chủ nếu URL không khớp */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
