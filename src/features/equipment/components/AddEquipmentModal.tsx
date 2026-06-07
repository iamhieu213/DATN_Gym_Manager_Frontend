import { useState } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    baseCode: string;
    quantity: number;
    purchaseDate?: string;
    note?: string;
  }) => Promise<void>;
}

export default function AddEquipmentModal({ isOpen, onClose, onSubmit }: AddEquipmentModalProps) {
  const [name, setName] = useState('');
  const [baseCode, setBaseCode] = useState('EQ-RUN');
  const [quantity, setQuantity] = useState(1);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !baseCode || quantity <= 0) {
      Swal.fire({
        title: 'Thông tin chưa đầy đủ!',
        text: 'Vui lòng điền đầy đủ Tên, Mã tiền tố và Số lượng!',
        icon: 'warning',
        background: '#09090b',
        color: '#fafafa',
        confirmButtonColor: '#c3f400',
        confirmButtonText: 'Đã hiểu',
        customClass: {
          confirmButton: 'text-black font-bold'
        }
      });
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name,
        baseCode,
        quantity,
        purchaseDate: purchaseDate || undefined,
        note: note || undefined
      });
      // Reset form
      setName('');
      setBaseCode('EQ-RUN');
      setQuantity(1);
      setPurchaseDate('');
      setNote('');
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
          <Plus className="text-[#c3f400] h-5 w-5" />
          Thêm Mới Thiết Bị Hàng Loạt
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Tên loại máy tập
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Máy đạp đùi Leg Press..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#c3f400]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#71717a] font-bold uppercase tracking-wider">
                Mã tiền tố (Prefix)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: EQ-LEG"
                value={baseCode}
                onChange={e => setBaseCode(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#c3f400]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#71717a] font-bold uppercase tracking-wider">
                Số lượng mua
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c3f400]"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Ngày mua thiết bị
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c3f400]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#71717a] font-bold uppercase tracking-wider">
              Ghi chú (Gốc mua/Xuất xứ)
            </label>
            <textarea
              placeholder="Nhập ghi chú xuất xứ máy tập..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-lg p-2.5 text-white placeholder-[#71717a] focus:outline-none focus:border-[#c3f400] h-20 resize-none"
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
              {submitting ? 'Đang thêm...' : 'Thêm máy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
