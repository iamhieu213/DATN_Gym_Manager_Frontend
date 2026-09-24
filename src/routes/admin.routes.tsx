import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Load lazy layout admin và trang dashboard
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const DashboardPage = lazy(() => import('../features/admin/pages/AdminDashboardPage'));
const AdminEquipmentPage = lazy(() => import('../features/admin/pages/AdminEquipmentPage'));
// Khu vực quản trị dùng chung cho ADMIN và STAFF (STAFF bị ẩn các mục chỉ dành cho ADMIN ở menu)
export const adminRoutes = (
  <Route
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<DashboardPage />} />
    
    {/* Các trang con phục vụ quản lý */}
    <Route path="members" element={<div className="p-8 text-white">Tính năng quản lý Hội viên đang phát triển...</div>} />
    <Route path="pts" element={<div className="p-8 text-white">Tính năng quản lý Huấn luyện viên đang phát triển...</div>} />
    <Route path="staff" element={<div className="p-8 text-white">Tính năng quản lý Nhân sự đang phát triển...</div>} />
    <Route path="packages" element={<div className="p-8 text-white">Tính năng quản lý Gói tập đang phát triển...</div>} />
    <Route path="bookings" element={<div className="p-8 text-white">Tính năng quản lý Lịch đặt chỗ đang phát triển...</div>} />
    <Route path="payments" element={<div className="p-8 text-white">Tính năng quản lý Thanh toán đang phát triển...</div>} />
    <Route path="reports" element={<div className="p-8 text-white">Tính năng quản lý Báo cáo đang phát triển...</div>} />
    <Route path="equipment" element={<AdminEquipmentPage />} />
    <Route path="maintenance" element={<div className="p-8 text-white">Tính năng quản lý Bảo trì đang phát triển...</div>} />
  </Route>
);
