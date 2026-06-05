import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authRoutes } from './routes/auth.routes';
import { adminRoutes } from './routes/admin.routes';

// Load lazy trang Landing chính
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
// Giao diện loading đơn giản khi tải các trang lazy
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#131313] text-[#c3f400] font-mono text-lg z-9999">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c3f400]/20 border-t-[#c3f400]" />
      <span className="tracking-widest uppercase text-xs">ĐANG TẢI DỮ LIỆU...</span>
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

          {/* 2. Nhóm Route Xác thực (Auth Module Routes) */}
          {authRoutes}

          {/* 3. Nhóm Route Quản lý Admin (Dashboard Layout & Routes) */}
          {adminRoutes}

          {/* Tự động điều hướng về trang chủ nếu URL không khớp */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
