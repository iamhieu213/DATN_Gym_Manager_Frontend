import { lazy } from 'react';
import { Route } from 'react-router-dom';

// Load lazy các trang auth
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/pages/ResetPasswordPage'));
const VerifyRegisterPage = lazy(() => import('../features/auth/pages/VerifyRegisterPage'));
const VerifyForgotPasswordPage = lazy(() => import('../features/auth/pages/VerifyForgotPasswordPage'));

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/verify-register" element={<VerifyRegisterPage />} />
    <Route path="/verify-forgot-password" element={<VerifyForgotPasswordPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
  </>
);
