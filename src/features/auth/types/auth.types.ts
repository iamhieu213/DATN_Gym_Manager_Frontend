export interface User {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
}

// Đăng ký
export interface RegisterRequest {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    registerToken: string;
  };
}

// Xác thực đăng ký OTP
export interface VerifyRegisterRequest {
  email: string;
  registerToken: string;
  otpCode: string;
}

export interface VerifyRegisterResponse {
  success: boolean;
  message: string;
  data: User;
}

// Đăng nhập
export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// Quên mật khẩu - Bước 1: Yêu cầu gửi OTP
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

// Quên mật khẩu - Bước 2: Xác thực OTP lấy Reset Token
export interface VerifyForgotPasswordRequest {
  email: string;
  otpCode: string;
}

export interface VerifyForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    resetPasswordToken: string;
  };
}

// Quên mật khẩu - Bước 3: Đặt mật khẩu mới bằng Reset Token
export interface ResetPasswordRequest {
  resetPasswordToken: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

// Đổi mật khẩu trong hệ thống
export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: null;
}