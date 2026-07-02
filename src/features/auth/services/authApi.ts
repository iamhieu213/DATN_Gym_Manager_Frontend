import apiClient from './apiClient';
import type { 
  RegisterRequest, RegisterResponse,
  VerifyRegisterRequest, VerifyRegisterResponse,
  LoginRequest, LoginResponse,
  ForgotPasswordRequest, ForgotPasswordResponse,
  VerifyForgotPasswordRequest, VerifyForgotPasswordResponse,
  ResetPasswordRequest, ResetPasswordResponse
} from '../types/auth.types';

// 1. Đăng ký tài khoản mới (gửi OTP tới email)
export async function registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>('/auth/register', payload);
  return response.data;
}

// 2. Xác thực mã OTP đăng ký để tạo tài khoản
export async function verifyRegisterOtp(payload: VerifyRegisterRequest): Promise<VerifyRegisterResponse> {
  const response = await apiClient.post<VerifyRegisterResponse>('/auth/verify-register', payload);
  return response.data;
}

// 3. Đăng nhập bằng Email/Password
export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
}

// 4. Yêu cầu mã OTP Quên mật khẩu
export async function requestForgotPasswordOtp(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const response = await apiClient.post<ForgotPasswordResponse>('/auth/request-forgot-password-otp', payload);
  return response.data;
}

// 5. Xác thực mã OTP Quên mật khẩu để lấy Reset Token
export async function verifyForgotPasswordOtp(payload: VerifyForgotPasswordRequest): Promise<VerifyForgotPasswordResponse> {
  const response = await apiClient.post<VerifyForgotPasswordResponse>('/auth/verify-forgot-password-otp', payload);
  return response.data;
}

// 6. Đặt lại mật khẩu mới bằng Reset Token
export async function resetPassword(payload: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', payload);
  return response.data;
}

// 7. Đăng xuất tài khoản
export async function logoutUser(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken });
}

// 8. Lấy thông tin cá nhân của người đăng nhập
export async function getMyProfile(): Promise<any> {
  const response = await apiClient.get<any>('/users/me');
  return response.data;
}

// 9. Đổi mật khẩu tài khoản
export async function changePassword(payload: any): Promise<any> {
  const response = await apiClient.post<any>('/auth/change-password', payload);
  return response.data;
}
