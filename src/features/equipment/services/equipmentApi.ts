import apiClient from '../../auth/services/apiClient'; // Điều chỉnh lại đường dẫn tương đối cho đúng với cấu trúc dự án của bạn

// ----------------- Định nghĩa các Kiểu Dữ Liệu (TypeScript Types) -----------------
export type EquipmentStatus = 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE';

export interface EquipmentItem {
  id: number;
  name: string;
  code: string;
  status: EquipmentStatus;
  location?: string | null;
  purchaseDate?: string | null;
  lastMaintenanceDate?: string | null;
  note?: string | null;
}

export interface MaintenanceTask {
  id: number;
  equipmentId: number;
  title: string;
  description?: string | null;
  scheduledAt: string;
  completedAt?: string | null;
  priority: 'CRITICAL' | 'ROUTINE' | 'NORMAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTeam?: string | null;
  cost?: number | null;
  notes?: string | null;
  equipment?: {
    name: string;
    code: string;
  };
}

export interface CreateMaintenanceTaskPayload {
  equipmentIds: number[];
  title: string;
  description?: string;
  scheduledAt: string; // Định dạng "YYYY-MM-DD"
  priority: 'CRITICAL' | 'NORMAL' | 'ROUTINE';
  assignedTeam?: string;
}

export interface UpdateMaintenanceTaskPayload {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  cost?: number;
  notes?: string;
}

// ----------------- Định nghĩa các Hàm Gọi API -----------------

/**
 * 1. Lấy thông tin thống kê trạng thái thiết bị (KPI Bento Card)
 * API Backend: GET /equipment/stats
 */
export const getEquipmentStats = async () => {
  const response = await apiClient.get<{
    success: boolean;
    data: {
      total: number;
      operational: number;
      underMaintenance: number;
      outOfService: number;
    }
  }>('/equipment/stats');
  return response.data;
};

/**
 * 2. Lấy danh sách thiết bị chi tiết (Hỗ trợ phân trang, lọc status, tìm kiếm code/tên)
 * API Backend: GET /equipment/details
 */
export const getEquipmentDetails = async (params: {
  status?: string;
  search?: string;
  page: number;
  limit: number;
}) => {
  const response = await apiClient.get<{
    success: boolean;
    data: EquipmentItem[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }>('/equipment/details', { params });
  return response.data;
};

/**
 * 3. Lấy danh sách lịch trình bảo trì (Lọc theo tháng/năm cho lịch biểu hoặc lấy các lịch đang chờ)
 * API Backend: GET /equipment/maintenance/tasks
 */
export const getMaintenanceTasks = async (month?: number, year?: number) => {
  const response = await apiClient.get<{
    success: boolean;
    data: MaintenanceTask[];
  }>('/equipment/maintenance/tasks', {
    params: { month, year }
  });
  return response.data;
};

/**
 * 4. Lên lịch bảo trì mới (hỗ trợ hàng loạt máy)
 * API Backend: POST /equipment/maintenance/tasks
 */
export const createMaintenanceTask = async (payload: CreateMaintenanceTaskPayload) => {
  const response = await apiClient.post('/equipment/maintenance/tasks', payload);
  return response.data;
};

/**
 * 5. Cập nhật tiến trình/hoàn thành bảo trì
 * API Backend: PUT /equipment/maintenance/tasks/:id
 */
export const updateMaintenanceTask = async (id: number, payload: UpdateMaintenanceTaskPayload) => {
  const response = await apiClient.put(`/equipment/maintenance/tasks/${id}`, payload);
  return response.data;
};

/**
 * 6. Đăng ký thiết bị mới hàng loạt (Bulk Create)
 * API Backend: POST /equipment/
 */
export const createEquipment = async (payload: {
  name: string;
  baseCode: string;
  quantity: number;
  purchaseDate?: string;
  note?: string;
}) => {
  const response = await apiClient.post('/equipment', payload);
  return response.data;
};

/**
 * 7. Cập nhật trạng thái/thông tin 1 thiết bị cụ thể
 * API Backend: PUT /equipment/:id
 */
export const updateEquipment = async (id: number, payload: {
  status?: 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE';
  note?: string;
  lastMaintenanceDate?: string;
}) => {
  const response = await apiClient.put(`/equipment/${id}`, payload);
  return response.data;
};

/**
 * 8. Xóa 1 thiết bị cụ thể khỏi DB
 * API Backend: DELETE /equipment/:id
 */
export const deleteEquipment = async (id: number) => {
  const response = await apiClient.delete(`/equipment/${id}`);
  return response.data;
};

/**
 * 9. Cập nhật trạng thái thiết bị hàng loạt
 * API Backend: PUT /equipment/bulk-update
 */
export const bulkUpdateEquipment = async (payload: {
  ids: number[];
  status?: 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE';
  note?: string;
}) => {
  const response = await apiClient.put('/equipment/bulk-update', payload);
  return response.data;
};

/**
 * 10. Xóa hàng loạt thiết bị khỏi DB
 * API Backend: POST /equipment/bulk-delete
 */
export const bulkDeleteEquipment = async (ids: number[]) => {
  const response = await apiClient.post('/equipment/bulk-delete', { ids });
  return response.data;
};