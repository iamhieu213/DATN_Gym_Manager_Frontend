import apiClient from '../../../shared/api/apiClient';

export const getDashboardStats = async (range: string) => {
  const response = await apiClient.get(`/dashboard/admin/stats?range=${range}`);
  return response.data;
};