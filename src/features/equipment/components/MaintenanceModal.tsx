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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 box-border">
      <div className="relative box-border flex w-full max-w-lg flex-col gap-4 rounded-xl border border-white/10 bg-zinc-950 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <h3 className="m-0 flex items-center gap-2 text-lg font-bold text-white [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-amber-500">
          <Wrench />
          Lên Lịch Bảo Trì Thiết Bị
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left text-xs">
          {/* Select Equipments */}
          <div className="flex flex-col gap-1">
            <label className="block font-bold uppercase tracking-wide text-zinc-500">
              Chọn máy cần bảo trì (Tích chọn)
            </label>

            {/* Search Input inside Modal */}
            <div className="relative mb-1 flex items-center">
              <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Tìm nhanh mã máy hoặc tên máy..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="box-border w-full rounded-lg border border-white/5 bg-white/5 px-8 py-2 text-[11px] text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 flex items-center justify-center border-none bg-transparent text-zinc-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex max-h-40 select-none flex-col gap-1 overflow-y-auto rounded-lg border border-white/10 bg-white/5 p-2">
              {filteredEquipments.length === 0 ? (
                <div className="py-4 text-center font-mono text-[11px] text-zinc-500">
                  Không tìm thấy máy tập phù hợp
                </div>
              ) : (
                filteredEquipments.map(eq => {
                  const isChecked = equipmentIds.includes(eq.id);
                  return (
                    <label key={eq.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-white transition-colors duration-200 hover:bg-white/5">
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
                        className="h-4 w-4 cursor-pointer"
                      />
                      <span className="text-xs">
                        <span className="mr-1 font-bold text-brand">{eq.code}</span> - {eq.name}
                        <span className={`ml-2 font-mono text-[10px] uppercase ${
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
              <div className="mt-2 flex flex-col gap-2">
                <span className="font-bold uppercase tracking-wide text-zinc-500 text-[10px]">
                  Thiết bị đã chọn ({equipmentIds.length}):
                </span>
                <div className="box-border flex max-h-24 flex-wrap gap-1.5 overflow-y-auto rounded-lg border border-white/10 bg-white/3 p-2">
                  {equipmentIds.map(id => {
                    const eq = equipments.find(e => e.id === id);
                    if (!eq) return null;
                    return (
                      <span key={id} className="inline-flex items-center gap-1 rounded bg-brand/10 border border-brand/20 px-2 py-0.5 text-[10px] font-bold text-brand">
                        {eq.code}
                        <button
                          type="button"
                          onClick={() => setEquipmentIds(prev => prev.filter(item => item !== id))}
                          className="flex items-center justify-center border-none bg-transparent p-0 text-brand hover:text-white"
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
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Tiêu đề công việc
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Thay dây cáp tạ kéo..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Scheduled Date */}
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase tracking-wide text-zinc-500">
                Ngày thực hiện
              </label>
              <input
                type="date"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
                required
              />
            </div>

            {/* Assigned Team */}
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase tracking-wide text-zinc-500">
                Đội kỹ thuật phụ trách
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Phòng Kỹ Thuật Cơ Điện"
                value={assignedTeam}
                onChange={e => setAssignedTeam(e.target.value)}
                className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">Độ ưu tiên</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              className="w-full box-border cursor-pointer rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 focus:border-brand [&_option]:bg-zinc-950 [&_option]:text-white"
            >
              <option value="NORMAL">
                Bình thường (NORMAL)
              </option>
              <option value="ROUTINE">
                Định kỳ (ROUTINE)
              </option>
              <option value="CRITICAL">
                Khẩn cấp (CRITICAL)
              </option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Mô tả công việc
            </label>
            <textarea
              placeholder="Mô tả các linh kiện cần sửa hoặc thay mới..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="h-16 w-full box-border resize-none rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg bg-white/5 px-4 py-2 font-bold text-white transition-all duration-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-brand px-5 py-2 font-bold text-black transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : 'Lưu lịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
