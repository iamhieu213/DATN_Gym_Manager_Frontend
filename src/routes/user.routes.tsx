// src/routes/user.routes.tsx
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Tải lazy Layout và Dashboard của User
const UserLayout = lazy(() => import('../components/UserLayout'));
const UserDashboardPage = lazy(() => import('../pages/user/UserDashboardPage'));

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

    {/* Bạn có thể thêm các trang con khác của User tại đây sau này */}
    {/* <Route path="profile" element={<div className="p-8 text-white">Trang thông tin cá nhân...</div>} /> */}
  </Route>
);