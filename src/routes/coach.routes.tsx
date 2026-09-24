// src/routes/coach.routes.tsx
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const CoachLayout = lazy(() => import('../layouts/CoachLayout'));
const CoachDashboardPage = lazy(() => import('../features/coach/pages/CoachDashboardPage'));

// Khu vực dành riêng cho Huấn luyện viên (role COACH)
export const coachRoutes = (
  <Route
    path="/coach"
    element={
      <ProtectedRoute allowedRoles={['COACH']}>
        <CoachLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<CoachDashboardPage />} />

    {/* Các trang chức năng của HLV */}
    <Route path="students" element={<div className="p-8 text-white">Tính năng Học viên của tôi đang phát triển...</div>} />
    <Route path="availability" element={<div className="p-8 text-white">Tính năng Lịch rảnh đang phát triển...</div>} />
    <Route path="profile" element={<div className="p-8 text-white">Tính năng Hồ sơ HLV đang phát triển...</div>} />
  </Route>
);
