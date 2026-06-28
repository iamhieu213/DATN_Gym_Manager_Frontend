import { useState } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import './AddEquipmentModal.css';

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
    <div className="modal-overlay">
      <div className="modal-container">
        <h3 className="modal-title">
          <Plus />
          Thêm Mới Thiết Bị Hàng Loạt
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label className="form-label">
              Tên loại máy tập
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Máy đạp đùi Leg Press..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">
                Mã tiền tố (Prefix)
              </label>
              <input
                type="text"
                placeholder="Ví dụ: EQ-LEG"
                value={baseCode}
                onChange={e => setBaseCode(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Số lượng mua
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">
              Ngày mua thiết bị
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={e => setPurchaseDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Ghi chú (Gốc mua/Xuất xứ)
            </label>
            <textarea
              placeholder="Nhập ghi chú xuất xứ máy tập..."
              value={note}
              onChange={e => setNote(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-modal-cancel"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-modal-submit"
            >
              {submitting ? 'Đang thêm...' : 'Thêm máy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
