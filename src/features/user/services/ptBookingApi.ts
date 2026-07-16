import apiClient from '../../auth/services/apiClient';

// 1. Lấy thông tin huấn luyện viên cá nhân đang hỗ trợ hiện tại
export async function getMyActiveCoach(): Promise<any> {
  const response = await apiClient.get('/pt-booking/my-coach');
  return response.data;
}

// 2. Lấy danh sách Huấn luyện viên (PT) công khai
export async function getCoachesList(params?: {
  goal?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  page?: number;
  limit?: number;
}): Promise<any> {
  const response = await apiClient.get('/coach', { params });
  return response.data;
}

// 3. Lấy thông tin chi tiết của một PT (để lấy danh sách gói combo và giá riêng)
export async function getCoachDetail(coachId: number): Promise<any> {
  const response = await apiClient.get(`/coach/${coachId}`);
  return response.data;
}

// 4. Đăng ký thuê PT mới
export async function hirePT(payload: { coachId: number; ptPackageId: number; paymentMethod: string }): Promise<any> {
  const response = await apiClient.post('/pt-booking/hire', payload);
  return response.data;
}
