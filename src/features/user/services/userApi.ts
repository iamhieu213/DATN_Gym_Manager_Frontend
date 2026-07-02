import apiClient from '../../auth/services/apiClient';

// 1. Cập nhật thông tin cá nhân
export async function updateMyProfile(payload: {
  name?: string;
  phone?: string;
  dateOfBirth?: string; // Định dạng YYYY-MM-DD
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  citizenId?: string;
  address?: string;
  emergencyContact?: string;
}): Promise<any> {
  const response = await apiClient.patch('/users/me', payload);
  return response.data;
}

// 2. Tải lên và cập nhật ảnh đại diện
export async function updateMyAvatar(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await apiClient.patch('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// 3. Lấy lịch sử chỉ số sức khỏe cơ thể
export async function getBodyMetricsHistory(): Promise<any> {
  const response = await apiClient.get('/body-metrics/history');
  return response.data;
}

// 4. Ghi nhận chỉ số sức khỏe cơ thể mới
export async function createBodyMetric(payload: {
  weight_kg: number;
  height_cm: number;
  note?: string;
}): Promise<any> {
  const response = await apiClient.post('/body-metrics', payload);
  return response.data;
}

// 5. Lấy gói hội viên đang hoạt động
export async function getActiveMembership(): Promise<any> {
  const response = await apiClient.get('/membership/active');
  return response.data;
}
