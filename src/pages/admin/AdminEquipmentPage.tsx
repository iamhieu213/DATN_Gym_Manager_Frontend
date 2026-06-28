import { useState, useEffect } from 'react';
import { Download, Plus, Wrench, Sliders } from 'lucide-react';
import Swal from 'sweetalert2';
import './AdminEquipmentPage.css';

// CHỈ IMPORT các hàm gọi API
import {
  getEquipmentStats,
  getEquipmentDetails,
  getMaintenanceTasks,
  updateMaintenanceTask,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  bulkUpdateEquipment,
  bulkDeleteEquipment,
  createMaintenanceTask
} from '../../features/equipment/services/equipmentApi';

// Import types dùng chung
import type { EquipmentItem, EquipmentStatus, MaintenanceTask } from '../../features/equipment/types';

// Import các sub-component
import EquipmentStats from '../../features/equipment/components/EquipmentStats';
import EquipmentTable from '../../features/equipment/components/EquipmentTable';
import MaintenanceCalendar from '../../features/equipment/components/MaintenanceCalendar';
import AddEquipmentModal from '../../features/equipment/components/AddEquipmentModal';
import MaintenanceModal from '../../features/equipment/components/MaintenanceModal';
import EditEquipmentModal from '../../features/equipment/components/EditEquipmentModal';

function AdminEquipmentPage() {
  // Thống kê động
  const [stats, setStats] = useState({ total: 0, operational: 0, underMaintenance: 0, outOfService: 0 });
  const [equipments, setEquipments] = useState<EquipmentItem[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(false);

  // Chọn dòng hàng loạt
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Bộ lọc lịch ngày
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Quản lý trạng thái mở Modal
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentItem | null>(null);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // ----------------- API Async Triggers -----------------

  // 1. Tải số liệu thống kê Bento Grid KPI
  const fetchStats = async () => {
    try {
      const res = await getEquipmentStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Lỗi lấy thống kê thiết bị:', error);
    }
  };

  // 2. Tải danh sách thiết bị và map
  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const res = await getEquipmentDetails({
        page: 1,
        limit: 100, // Tải danh sách đầy đủ để lọc, phân trang ở Frontend
      });

      if (res.success) {
        const mappedData: EquipmentItem[] = res.data.map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            code: item.code,
            status: item.status,
            location: item.location || 'Khu vực chung',
            lastServiceDate: item.lastMaintenanceDate
              ? new Date(item.lastMaintenanceDate).toLocaleDateString('vi-VN')
              : 'Chưa bảo trì',
            note: item.note || ''
          };
        });

        setEquipments(mappedData);
      }
    } catch (error) {
      console.error('Lỗi lấy danh sách máy tập:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Tải danh sách lịch trình bảo trì trong tháng
  const fetchMaintenanceTasks = async () => {
    try {
      const res = await getMaintenanceTasks(currentMonth, currentYear);

      if (res.success) {
        const mappedTasks: MaintenanceTask[] = res.data.map((task: any) => {
          const taskDate = new Date(task.scheduledAt);
          const day = taskDate.getDate().toString().padStart(2, '0');
          const month = taskDate.toLocaleString('en-US', { month: 'short' });

          const avatars = [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50'
          ];

          return {
            id: task.id,
            day,
            month,
            title: task.title,
            description: `${task.equipment?.name || 'Thiết bị'} • Mã: ${task.equipment?.code || 'EQ'}`,
            priority: task.priority,
            status: task.status,
            assignedTeam: task.assignedTeam || undefined,
            avatars: task.assignedTeam ? avatars : undefined
          };
        });

        setMaintenanceTasks(mappedTasks);
      }
    } catch (error) {
      console.error('Lỗi lấy lịch trình bảo trì:', error);
    }
  };

  // Helper SweetAlert2 styling
  const swalDark = {
    background: '#09090b',
    color: '#fafafa',
    confirmButtonColor: '#c3f400',
    cancelButtonColor: '#27272a',
    customClass: {
      confirmButton: 'text-black font-bold'
    }
  };

  const confirmAction = (title: string, text: string, onConfirm: () => void) => {
    Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      ...swalDark
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  };

  const showSuccess = (text: string) => {
    Swal.fire({
      title: 'Thành công!',
      text,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      background: '#09090b',
      color: '#fafafa',
    });
  };

  const showError = (text: string) => {
    Swal.fire({
      title: 'Thất bại!',
      text,
      icon: 'error',
      ...swalDark,
      confirmButtonText: 'Đóng'
    });
  };

  // 4. Hoàn thành sửa chữa thiết bị
  const handleCompleteTask = async (taskId: number) => {
    confirmAction(
      'Hoàn thành sửa chữa?',
      'Xác nhận thiết bị đã sửa xong và sẵn sàng hoạt động?',
      async () => {
        try {
          const res = await updateMaintenanceTask(taskId, {
            status: 'COMPLETED',
            notes: 'Đã bảo dưỡng định kỳ và đưa vào vận hành lại.'
          });
          if (res.success) {
            showSuccess('Cập nhật trạng thái bảo trì thành công.');
            fetchStats();
            fetchEquipments();
            fetchMaintenanceTasks();
          }
        } catch (error) {
          console.error('Lỗi cập nhật bảo trì:', error);
          showError('Không thể cập nhật trạng thái bảo trì.');
        }
      }
    );
  };

  // 5. Đăng ký thiết bị mới hàng loạt
  const handleCreateEquipment = async (data: {
    name: string;
    baseCode: string;
    quantity: number;
    purchaseDate?: string;
    note?: string;
  }) => {
    try {
      const res = await createEquipment(data);
      if (res.success) {
        showSuccess('Thêm mới thiết bị thành công!');
        setIsAddEquipmentModalOpen(false);
        fetchStats();
        fetchEquipments();
      }
    } catch (error) {
      console.error(error);
      showError('Đăng ký thiết bị thất bại!');
    }
  };

  // 6. Lên lịch bảo trì thiết bị hàng loạt
  const handleCreateMaintenance = async (data: {
    equipmentIds: number[];
    title: string;
    description?: string;
    scheduledAt: string;
    priority: 'CRITICAL' | 'NORMAL' | 'ROUTINE';
    assignedTeam?: string;
  }) => {
    try {
      const res = await createMaintenanceTask(data);
      if (res.success) {
        showSuccess('Lên lịch bảo trì thành công!');
        setIsMaintenanceModalOpen(false);
        setSelectedIds([]); // Clear selection in table
        fetchStats();
        fetchEquipments();
        fetchMaintenanceTasks();
      }
    } catch (error) {
      console.error(error);
      showError('Không thể tạo lịch bảo trì!');
    }
  };

  // 7. Cập nhật thiết bị đơn lẻ
  const handleUpdateEquipment = async (status: EquipmentStatus, note?: string) => {
    if (!editingEquipment) return;
    try {
      const res = await updateEquipment(editingEquipment.id, { status, note });
      if (res.success) {
        showSuccess('Cập nhật thiết bị thành công!');
        setEditingEquipment(null);
        fetchStats();
        fetchEquipments();
      }
    } catch (error) {
      console.error(error);
      showError('Cập nhật thiết bị thất bại!');
    }
  };

  // 8. Xóa thiết bị đơn lẻ
  const handleDeleteSingleEquipment = async (id: number) => {
    confirmAction(
      'Xóa thiết bị?',
      'CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn thiết bị này?',
      async () => {
        try {
          const res = await deleteEquipment(id);
          if (res.success) {
            showSuccess('Xóa thiết bị thành công!');
            setSelectedIds(prev => prev.filter(item => item !== id));
            fetchStats();
            fetchEquipments();
          }
        } catch (error) {
          console.error(error);
          showError('Xóa thiết bị thất bại!');
        }
      }
    );
  };

  // 9. Cập nhật trạng thái hàng loạt
  const handleBulkUpdateStatus = async (status: EquipmentStatus) => {
    if (selectedIds.length === 0) return;
    confirmAction(
      'Cập nhật hàng loạt?',
      `Xác nhận cập nhật trạng thái của ${selectedIds.length} thiết bị đã chọn?`,
      async () => {
        try {
          const res = await bulkUpdateEquipment({
            ids: selectedIds,
            status,
            note: 'Cập nhật hàng loạt từ giao diện Admin'
          });
          if (res.success) {
            showSuccess('Cập nhật trạng thái hàng loạt thành công!');
            setSelectedIds([]);
            fetchStats();
            fetchEquipments();
          }
        } catch (error) {
          console.error(error);
          showError('Cập nhật trạng thái hàng loạt thất bại!');
        }
      }
    );
  };

  // 10. Xóa hàng loạt thiết bị
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    confirmAction(
      'XÓA HÀNG LOẠT?',
      `CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.length} thiết bị đã chọn khỏi hệ thống?`,
      async () => {
        try {
          const res = await bulkDeleteEquipment(selectedIds);
          if (res.success) {
            showSuccess('Đã xóa các thiết bị thành công!');
            setSelectedIds([]);
            fetchStats();
            fetchEquipments();
          }
        } catch (error) {
          console.error(error);
          showError('Xóa hàng loạt thiết bị thất bại!');
        }
      }
    );
  };

  useEffect(() => {
    fetchStats();
    fetchEquipments();
    fetchMaintenanceTasks();
  }, []);

  return (
    <div className="equipment-page-container">
      {/* Tiêu đề & Nút thao tác Header */}
      <div className="equipment-header">
        <div>
          <h1 className="equipment-title">
            <Sliders className="equipment-title-icon" />
            Quản Lý Trang Thiết Bị
          </h1>
          <p className="equipment-subtitle">
            Theo dõi, phân tích trạng thái bảo trì và quản lý cơ sở vật chất phòng gym Kinetic.
          </p>
        </div>
        <div className="equipment-header-actions">
          <button className="btn-action-outline">
            <Download size={14} /> Xuất file báo cáo
          </button>

          {/* Nút lên lịch bảo trì */}
          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="btn-action-warning"
          >
            <Wrench size={14} /> Lên lịch bảo trì
          </button>

          {/* Nút thêm thiết bị */}
          <button
            onClick={() => setIsAddEquipmentModalOpen(true)}
            className="btn-action-primary"
          >
            <Plus size={14} /> Thêm thiết bị mới
          </button>
        </div>
      </div>

      {/* Bento Grid Stats Card */}
      <EquipmentStats
        total={stats.total}
        operational={stats.operational}
        underMaintenance={stats.underMaintenance}
        outOfService={stats.outOfService}
      />

      {/* Main Layout Grid */}
      <div className="equipment-layout-grid">
        {/* Cột Trái: Bảng danh sách thiết bị */}
        <EquipmentTable
          equipments={equipments}
          loading={loading}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onEdit={setEditingEquipment}
          onDelete={handleDeleteSingleEquipment}
          onBulkUpdateStatus={handleBulkUpdateStatus}
          onBulkDelete={handleBulkDelete}
        />

        {/* Cột Phải: Lịch biểu bảo trì sắp tới */}
        <MaintenanceCalendar
          maintenanceTasks={maintenanceTasks}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onCompleteTask={handleCompleteTask}
        />
      </div>

      {/* ----------------- HỘP THOẠI MODAL ----------------- */}
      <AddEquipmentModal
        isOpen={isAddEquipmentModalOpen}
        onClose={() => setIsAddEquipmentModalOpen(false)}
        onSubmit={handleCreateEquipment}
      />

      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        equipments={equipments}
        selectedIds={selectedIds}
        onSubmit={handleCreateMaintenance}
      />

      <EditEquipmentModal
        isOpen={!!editingEquipment}
        onClose={() => setEditingEquipment(null)}
        equipment={editingEquipment}
        onSubmit={handleUpdateEquipment}
      />

      {/* Glow background */}
      <div className="glow-bottom-right"></div>
    </div>
  );
}

export default AdminEquipmentPage;