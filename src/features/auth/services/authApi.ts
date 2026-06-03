import type { ForgotPasswordRequest, ForgotPasswordResponse } from '../types/auth.types';

const API_BASE_URL = 'http://localhost:8080';

export async function requestForgotPasswordOtp(
  payload: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Không thể gửi mã OTP.');
  }

  return data;
}