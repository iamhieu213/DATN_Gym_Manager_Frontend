import { useState, useEffect } from 'react';
import { Download, Plus, Wrench, Sliders } from 'lucide-react';
import Swal from 'sweetalert2';

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
} from '../../equipment/services/equipmentApi';

// Import types dùng chung
import type { EquipmentItem, EquipmentStatus, MaintenanceTask } from '../../equipment/types';

// Import các sub-component
import EquipmentStats from '../../equipment/components/EquipmentStats';
import EquipmentTable from '../../equipment/components/EquipmentTable';
import MaintenanceCalendar from '../../equipment/components/MaintenanceCalendar';
import AddEquipmentModal from '../../equipment/components/AddEquipmentModal';
import MaintenanceModal from '../../equipment/components/MaintenanceModal';
import EditEquipmentModal from '../../equipment/components/EditEquipmentModal';

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
    <div className="p-8 w-full flex flex-col gap-8 flex-1 box-border">
      {/* Tiêu đề & Nút thao tác Header */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 m-0">
            <Sliders className="text-brand h-8 w-8" />
            Quản Lý Trang Thiết Bị
          </h1>
          <p className="text-zinc-500 text-sm mt-1 mb-0">
            Theo dõi, phân tích trạng thái bảo trì và quản lý cơ sở vật chất phòng gym Kinetic.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-all duration-200 hover:bg-white/5 active:scale-95">
            <Download size={14} /> Xuất file báo cáo
          </button>

          {/* Nút lên lịch bảo trì */}
          <button
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-bold text-amber-500 flex items-center gap-2 cursor-pointer transition-all duration-200 hover:bg-amber-500/20 active:scale-95"
          >
            <Wrench size={14} /> Lên lịch bảo trì
          </button>

          {/* Nút thêm thiết bị */}
          <button
            onClick={() => setIsAddEquipmentModalOpen(true)}
            className="px-5 py-2.5 bg-brand text-black rounded-lg text-xs font-bold flex items-center gap-2 border-none cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95"
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
      <div className="grid grid-cols-1 gap-8 items-start xl:grid-cols-3">
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
      <div className="fixed bottom-0 right-0 -z-10 w-[600px] h-[400px] bg-brand/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}

export default AdminEquipmentPage;