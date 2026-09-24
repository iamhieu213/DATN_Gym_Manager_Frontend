import apiClient from '../../../shared/api/apiClient';

// 1. Lấy gói hội viên đang hoạt động của người dùng đăng nhập
export async function getActiveMembership(): Promise<any> {
  const response = await apiClient.get('/membership/active');
  return response.data;
}

// 2. Lấy danh sách các gói tập thành viên hiện có
export async function getPlansList(params?: { page?: number; limit?: number }): Promise<any> {
  const response = await apiClient.get('/plan', { params });
  return response.data;
}

// 3. Đăng ký mua gói tập mới
export async function buyMembership(payload: { planId: number; paymentMethod: string }): Promise<any> {
  const response = await apiClient.post('/membership/buy', payload);
  return response.data;
}

// 4. Lấy lịch sử đăng ký gói hội viên (tất cả các gói đã từng đăng ký)
export async function getMembershipHistory(): Promise<any> {
  const response = await apiClient.get('/membership/my-history');
  return response.data;
}
