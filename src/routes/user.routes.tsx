// src/routes/user.routes.tsx
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Tải lazy Layout và Dashboard của User
const UserLayout = lazy(() => import('../components/UserLayout'));
const UserDashboardPage = lazy(() => import('../features/user/pages/UserDashboardPage'));
const UserProfilePage = lazy(() => import('../features/user/pages/UserProfilePage'));
const ChangePasswordPage = lazy(() => import('../features/user/pages/ChangePasswordPage'));
const UserPlansPage = lazy(() => import('../features/user/pages/UserPlansPage'));

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
  </Route>
);