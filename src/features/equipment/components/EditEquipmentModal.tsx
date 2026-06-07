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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#09090b] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="text-blue-500 h-5 w-5" />
          Sửa Trạng Thái Thiết Bị
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
          {/* Machine Name */}
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Tên thiết bị (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.name}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-[#71717a] cursor-not-allowed"
              disabled
            />
          </div>

          {/* Machine Code */}
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Mã máy (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.code}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-[#71717a] cursor-not-allowed"
              disabled
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Trạng thái máy tập
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c3f400]"
            >
              <option value="OPERATIONAL" className="bg-[#09090b]">
                Hoạt động (OPERATIONAL)
              </option>
              <option value="UNDER_MAINTENANCE" className="bg-[#09090b]">
                Bảo trì (UNDER_MAINTENANCE)
              </option>
              <option value="OUT_OF_SERVICE" className="bg-[#09090b]">
                Hỏng hóc (OUT_OF_SERVICE)
              </option>
            </select>
          </div>

          {/* Location (Read-only) */}
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Vị trí đặt máy (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.location}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-[#71717a] cursor-not-allowed"
              disabled
            />
          </div>

          {/* Note (Editable) */}
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">Ghi chú thiết bị</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ví dụ: Lỗi cảm biến nhịp tim, Hàng nhập khẩu..."
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#c3f400]"
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
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
