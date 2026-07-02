// src/routes/user.routes.tsx
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Tải lazy Layout và Dashboard của User
const UserLayout = lazy(() => import('../components/UserLayout'));
const UserDashboardPage = lazy(() => import('../pages/user/UserDashboardPage'));
const UserProfilePage = lazy(() => import('../pages/user/UserProfilePage'));
const ChangePasswordPage = lazy(() => import('../pages/user/ChangePasswordPage'));

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
  </Route>
);