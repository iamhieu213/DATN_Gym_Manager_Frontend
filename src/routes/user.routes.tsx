// src/routes/user.routes.tsx
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Tải lazy Layout và Dashboard của User
const UserLayout = lazy(() => import('../layouts/UserLayout'));
const UserDashboardPage = lazy(() => import('../features/user/pages/UserDashboardPage'));
const UserProfilePage = lazy(() => import('../features/user/pages/UserProfilePage'));
const ChangePasswordPage = lazy(() => import('../features/user/pages/ChangePasswordPage'));
const UserPlansPage = lazy(() => import('../features/user/pages/UserPlansPage'));
const UserSchedulePage = lazy(() => import('../features/user/pages/UserSchedulePage'));
const UserMembershipCardPage = lazy(() => import('../features/user/pages/UserMembershipCardPage'));

export const userRoutes = (
  <Route
    path="/user"
    element={
      <ProtectedRoute allowedRoles={['USER']}>
        <UserLayout />
      </ProtectedRoute>
    }
  >
    {/* Trang chủ Dashboard của Hội viên */}
    <Route index element={<UserDashboardPage />} />

    {/* Trang thông tin cá nhân */}
    <Route path="profile" element={<UserProfilePage />} />

    {/* Trang đổi mật khẩu */}
    <Route path="change-password" element={<ChangePasswordPage />} />

    {/* Trang kế hoạch & đăng ký gói dịch vụ */}
    <Route path="plans" element={<UserPlansPage />} />

    {/* Các trang thuộc nhóm Tổng Quát */}
    <Route path="schedule" element={<UserSchedulePage />} />

    {/* Các trang thuộc nhóm Tập Luyện */}
    <Route path="workouts" element={<div className="p-8 text-white">Tính năng Bài tập của tôi đang phát triển...</div>} />
    <Route path="training" element={<div className="p-8 text-white">Tính năng Tập luyện đang phát triển...</div>} />
    <Route path="exercise-library" element={<div className="p-8 text-white">Tính năng Thư viện bài tập đang phát triển...</div>} />
    <Route path="lesson-library" element={<div className="p-8 text-white">Tính năng Thư viện giáo án đang phát triển...</div>} />

    {/* Các trang thuộc nhóm Hội Viên */}
    <Route path="membership-card" element={<UserMembershipCardPage />} />
    <Route path="body-metrics" element={<div className="p-8 text-white">Tính năng Chỉ số cơ thể đang phát triển...</div>} />
    <Route path="nutrition" element={<div className="p-8 text-white">Tính năng Tra cứu dinh dưỡng đang phát triển...</div>} />

    {/* Các trang thuộc nhóm HLV */}
    <Route path="coaches" element={<div className="p-8 text-white">Tính năng Huấn luyện viên đang phát triển...</div>} />
    <Route path="coach-packages" element={<div className="p-8 text-white">Tính năng Đăng ký gói HLV đang phát triển...</div>} />
  </Route>
);
