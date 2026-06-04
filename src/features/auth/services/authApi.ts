import axios from 'axios';
import type { ForgotPasswordRequest, ForgotPasswordResponse, RegisterRequest, RegisterResponse } from '../types/auth.types';

const API_BASE_URL = 'http://localhost:3000';

export async function registerUser(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register`, payload);
  return response.data;
}

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