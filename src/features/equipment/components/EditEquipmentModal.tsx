import { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import type { EquipmentItem, EquipmentStatus } from '../types';

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: EquipmentItem | null;
  onSubmit: (status: EquipmentStatus, note?: string) => Promise<void>;
}

export default function EditEquipmentModal({
  isOpen,
  onClose,
  equipment,
  onSubmit
}: EditEquipmentModalProps) {
  const [status, setStatus] = useState<EquipmentStatus>('OPERATIONAL');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (equipment) {
      setStatus(equipment.status);
      setNote(equipment.note || '');
    }
  }, [equipment]);

  if (!isOpen || !equipment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(status, note);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 box-border">
      <div className="relative box-border flex w-full max-w-md flex-col gap-4 rounded-xl border border-white/10 bg-zinc-950 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <h3 className="m-0 flex items-center gap-2 text-lg font-bold text-white [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-blue-500">
          <Sliders />
          Sửa Trạng Thái Thiết Bị
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left text-xs">
          {/* Machine Name */}
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Tên thiết bị (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.name}
              className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:text-zinc-500"
              disabled
            />
          </div>

          {/* Machine Code */}
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Mã máy (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.code}
              className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:text-zinc-500"
              disabled
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Trạng thái máy tập
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full box-border cursor-pointer rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 focus:border-brand [&_option]:bg-zinc-950 [&_option]:text-white"
            >
              <option value="OPERATIONAL">
                Hoạt động (OPERATIONAL)
              </option>
              <option value="UNDER_MAINTENANCE">
                Bảo trì (UNDER_MAINTENANCE)
              </option>
              <option value="OUT_OF_SERVICE">
                Hỏng hóc (OUT_OF_SERVICE)
              </option>
            </select>
          </div>

          {/* Location (Read-only) */}
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Vị trí đặt máy (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.location}
              className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:text-zinc-500"
              disabled
            />
          </div>

          {/* Note (Editable) */}
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">Ghi chú thiết bị</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ví dụ: Lỗi cảm biến nhịp tim, Hàng nhập khẩu..."
              className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
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
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
