import { useState, useEffect } from 'react';
import { Wrench, X, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import type { EquipmentItem } from '../types';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipments: EquipmentItem[];
  selectedIds: number[];
  onSubmit: (data: {
    equipmentIds: number[];
    title: string;
    description?: string;
    scheduledAt: string;
    priority: 'CRITICAL' | 'NORMAL' | 'ROUTINE';
    assignedTeam?: string;
  }) => Promise<void>;
}

export default function MaintenanceModal({
  isOpen,
  onClose,
  equipments,
  selectedIds,
  onSubmit
}: MaintenanceModalProps) {
  const [equipmentIds, setEquipmentIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [priority, setPriority] = useState<'CRITICAL' | 'NORMAL' | 'ROUTINE'>('NORMAL');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipments = equipments.filter(eq =>
    eq.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    eq.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sync selectedIds from the table when the modal opens
  useEffect(() => {
    if (isOpen) {
      setEquipmentIds(selectedIds);
    }
  }, [isOpen, selectedIds]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const swalDark = {
      background: '#09090b',
      color: '#fafafa',
      confirmButtonColor: '#c3f400',
      confirmButtonText: 'Đã hiểu',
      customClass: {
        confirmButton: 'text-black font-bold'
      }
    };

    if (equipmentIds.length === 0) {
      Swal.fire({
        title: 'Chưa chọn thiết bị!',
        text: 'Vui lòng chọn ít nhất một thiết bị cần bảo trì!',
        icon: 'warning',
        ...swalDark
      });
      return;
    }
    if (!title || !scheduledAt) {
      Swal.fire({
        title: 'Thông tin chưa đầy đủ!',
        text: 'Vui lòng điền đầy đủ Tiêu đề và Ngày thực hiện!',
        icon: 'warning',
        ...swalDark
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        equipmentIds,
        title,
        description: description || undefined,
        scheduledAt,
        priority,
        assignedTeam: assignedTeam || undefined
      });
      // Reset form
      setTitle('');
      setDescription('');
      setScheduledAt('');
      setPriority('NORMAL');
      setAssignedTeam('');
      setEquipmentIds([]);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl relative space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Wrench className="text-amber-500 h-5 w-5" />
          Lên Lịch Bảo Trì Thiết Bị
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
          {/* Select Equipments */}
          <div className="space-y-2">
            <label className="text-[#71717a] font-bold uppercase tracking-wider block">
              Chọn máy cần bảo trì (Tích chọn)
            </label>
            
            {/* Search Input inside Modal */}
            <div className="relative flex items-center mb-1">
              <Search className="absolute left-2.5 text-[#71717a] h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Tìm nhanh mã máy hoặc tên máy..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-lg pl-8 pr-8 py-1.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#c3f400] text-[11px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#71717a] hover:text-white cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="max-h-40 overflow-y-auto border border-white/10 rounded-lg p-2 bg-white/5 space-y-1 select-none">
              {filteredEquipments.length === 0 ? (
                <div className="text-center py-4 text-[#71717a] text-[11px] font-mono">
                  Không tìm thấy máy tập phù hợp
                </div>
              ) : (
                filteredEquipments.map(eq => {
                  const isChecked = equipmentIds.includes(eq.id);
                  return (
                    <label key={eq.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer text-white">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setEquipmentIds(prev => prev.filter(id => id !== eq.id));
                          } else {
                            setEquipmentIds(prev => [...prev, eq.id]);
                          }
                        }}
                        className="rounded border-white/10 bg-white/5 text-[#c3f400] focus:ring-0 cursor-pointer w-4 h-4"
                      />
                      <span className="text-xs">
                        <span className="font-bold text-[#c3f400] mr-1">{eq.code}</span> - {eq.name}
                        <span className={`ml-2 text-[10px] uppercase font-mono ${
                          eq.status === 'OPERATIONAL' ? 'text-emerald-400' : eq.status === 'UNDER_MAINTENANCE' ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          ({eq.status === 'OPERATIONAL' ? 'Đang chạy' : eq.status === 'UNDER_MAINTENANCE' ? 'Đang bảo trì' : 'Hỏng'})
                        </span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {/* Selected tags */}
            {equipmentIds.length > 0 && (
              <div className="space-y-1.5 mt-2">
                <span className="text-[10px] text-[#71717a] font-bold uppercase tracking-wider block">
                  Thiết bị đã chọn ({equipmentIds.length}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 border border-white/10 bg-white/3 rounded-lg">
                  {equipmentIds.map(id => {
                    const eq = equipments.find(e => e.id === id);
                    if (!eq) return null;
                    return (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#c3f400]/10 border border-[#c3f400]/20 text-[#c3f400] text-[10px] font-bold">
                        {eq.code}
                        <button
                          type="button"
                          onClick={() => setEquipmentIds(prev => prev.filter(item => item !== id))}
                          className="hover:text-white transition-colors cursor-pointer ml-0.5"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Tiêu đề công việc
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Thay dây cáp tạ kéo..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#c3f400]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Scheduled Date */}
            <div className="space-y-1">
              <label className="text-[#71717a] font-bold uppercase tracking-wider">
                Ngày thực hiện
              </label>
              <input
                type="date"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c3f400]"
                required
              />
            </div>

            {/* Assigned Team */}
            <div className="space-y-1">
              <label className="text-[#71717a] font-bold uppercase tracking-wider">
                Đội kỹ thuật phụ trách
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Phòng Kỹ Thuật Cơ Điện"
                value={assignedTeam}
                onChange={e => setAssignedTeam(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#c3f400]"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">Độ ưu tiên</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c3f400]"
            >
              <option value="NORMAL" className="bg-[#09090b]">
                Bình thường (NORMAL)
              </option>
              <option value="ROUTINE" className="bg-[#09090b]">
                Định kỳ (ROUTINE)
              </option>
              <option value="CRITICAL" className="bg-[#09090b]">
                Khẩn cấp (CRITICAL)
              </option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Mô tả công việc
            </label>
            <textarea
              placeholder="Mô tả các linh kiện cần sửa hoặc thay mới..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#c3f400] h-16 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 bg-white/5 text-white hover:bg-white/10 rounded-lg font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#c3f400] text-black font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : 'Lưu lịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
