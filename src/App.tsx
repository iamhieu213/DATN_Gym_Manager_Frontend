import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authRoutes } from './routes/auth.routes';
import { adminRoutes } from './routes/admin.routes';
import DashboardDispatcher from './routes/DashboardDispatcher';
import { userRoutes } from './routes/user.routes'; 
import { coachRoutes } from './routes/coach.routes';
import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from './shared/lib/socket';
import Swal from 'sweetalert2'; 

// Load lazy trang Landing chính
const LandingPage = lazy(() => import('./features/public/pages/LandingPage'));
const NotFoundPage = lazy(() => import('./features/public/pages/NotFoundPage'))
// Giao diện loading đơn giản khi tải các trang lazy
const PageLoader = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950 font-mono text-lg text-brand">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
      <span className="text-xs tracking-[0.1em] uppercase">ĐANG TẢI DỮ LIỆU...</span>
    </div>
  </div>
);

function App() {

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if(token) {
      //1. Ket noi toi server
      const socket = connectSocket(token);

      socket.on('new_notification', (data : any) => {
        // Hiện thông báo dạng Toast (góc màn hình) nhanh 4 giây rồi tự ẩn
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: data.title,
          text: data.content,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          background: '#1c1c1c',
          color: '#fff',
        })
      })
    }

    return () => {
      disconnectSocket(); // Ngắt kết nối khi component unmount
    }
  }, [])
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
          {coachRoutes}
          {userRoutes}

          {/* Tự động điều hướng về trang chủ nếu URL không khớp */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
