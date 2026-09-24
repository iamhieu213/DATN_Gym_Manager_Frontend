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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 box-border">
      <div className="relative box-border flex w-full max-w-md flex-col gap-4 rounded-xl border border-white/10 bg-zinc-950 p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <h3 className="m-0 flex items-center gap-2 text-lg font-bold text-white [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-brand">
          <Plus />
          Thêm Mới Thiết Bị Hàng Loạt
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Tên loại máy tập
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Máy đạp đùi Leg Press..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase tracking-wide text-zinc-500">
                Mã tiền tố (Prefix)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: EQ-LEG"
                value={baseCode}
                onChange={e => setBaseCode(e.target.value)}
                className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold uppercase tracking-wide text-zinc-500">
                Số lượng mua
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Ngày mua thiết bị
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
              className="w-full box-border rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold uppercase tracking-wide text-zinc-500">
              Ghi chú (Gốc mua/Xuất xứ)
            </label>
            <textarea
              placeholder="Nhập ghi chú xuất xứ máy tập..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="h-20 w-full box-border resize-none rounded-lg border border-white/5 bg-white/5 p-2.5 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand"
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
              {submitting ? 'Đang thêm...' : 'Thêm máy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
