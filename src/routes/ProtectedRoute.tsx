import React from 'react';
import { Navigate } from 'react-router-dom';

type UserRole = 'ADMIN' | 'COACH' | 'STAFF' | 'USER';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    // 1. Chưa đăng nhập -> Điều hướng về Login
    return <Navigate to="/login" replace />;
  }

  const payload = decodeJwt(token);

  // 2. Kiểm tra token hết hạn
  if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    return <Navigate to="/login" replace />;
  }

  // 3. Kiểm tra phân quyền
  if (!allowedRoles.includes(payload.role)) {
    alert('Tài khoản của bạn không có quyền truy cập vào khu vực này!');
    return <Navigate to="/" replace />;
  }

  // Hợp lệ
  return <>{children}</>;
}
