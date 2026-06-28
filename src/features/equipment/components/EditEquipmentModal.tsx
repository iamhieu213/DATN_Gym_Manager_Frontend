import { useState, useEffect } from 'react';
import { Sliders } from 'lucide-react';
import type { EquipmentItem, EquipmentStatus } from '../types';
import './EditEquipmentModal.css';

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
    <div className="modal-overlay">
      <div className="modal-container">
        <h3 className="modal-title">
          <Sliders />
          Sửa Trạng Thái Thiết Bị
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Machine Name */}
          <div className="form-field">
            <label className="form-label">
              Tên thiết bị (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.name}
              className="form-input"
              disabled
            />
          </div>

          {/* Machine Code */}
          <div className="form-field">
            <label className="form-label">
              Mã máy (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.code}
              className="form-input"
              disabled
            />
          </div>

          {/* Status */}
          <div className="form-field">
            <label className="form-label">
              Trạng thái máy tập
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="form-select"
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
          <div className="form-field">
            <label className="form-label">
              Vị trí đặt máy (Xem trước)
            </label>
            <input
              type="text"
              value={equipment.location}
              className="form-input"
              disabled
            />
          </div>

          {/* Note (Editable) */}
          <div className="form-field">
            <label className="form-label">Ghi chú thiết bị</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ví dụ: Lỗi cảm biến nhịp tim, Hàng nhập khẩu..."
              className="form-input"
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
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
