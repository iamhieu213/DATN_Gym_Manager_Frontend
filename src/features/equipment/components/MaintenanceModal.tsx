import { useState, useEffect } from 'react';
import { Wrench, X, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import type { EquipmentItem } from '../types';
import './MaintenanceModal.css';

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
    <div className="modal-overlay">
      <div className="modal-container">
        <h3 className="modal-title">
          <Wrench />
          Lên Lịch Bảo Trì Thiết Bị
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Select Equipments */}
          <div className="form-field">
            <label className="form-label">
              Chọn máy cần bảo trì (Tích chọn)
            </label>
            
            {/* Search Input inside Modal */}
            <div className="modal-search-wrapper">
              <Search className="absolute left-2.5 text-[#71717a] h-3.5 w-3.5" style={{ pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Tìm nhanh mã máy hoặc tên máy..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="modal-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn-clear-search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="equipment-select-list">
              {filteredEquipments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#71717a', fontSize: '11px', fontFamily: 'monospace' }}>
                  Không tìm thấy máy tập phù hợp
                </div>
              ) : (
                filteredEquipments.map(eq => {
                  const isChecked = equipmentIds.includes(eq.id);
                  return (
                    <label key={eq.id} className="list-row-label">
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
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold', color: '#c3f400', marginRight: '4px' }}>{eq.code}</span> - {eq.name}
                        <span className={`list-row-status ${
                          eq.status === 'OPERATIONAL' ? 'operational' : eq.status === 'UNDER_MAINTENANCE' ? 'maintenance' : 'broken'
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
              <div className="form-field-double">
                <span className="form-label" style={{ fontSize: '10px' }}>
                  Thiết bị đã chọn ({equipmentIds.length}):
                </span>
                <div className="selected-tags-container">
                  {equipmentIds.map(id => {
                    const eq = equipments.find(e => e.id === id);
                    if (!eq) return null;
                    return (
                      <span key={id} className="selected-tag-item">
                        {eq.code}
                        <button
                          type="button"
                          onClick={() => setEquipmentIds(prev => prev.filter(item => item !== id))}
                          className="btn-clear-tag"
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
          <div className="form-field">
            <label className="form-label">
              Tiêu đề công việc
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Thay dây cáp tạ kéo..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-grid-2">
            {/* Scheduled Date */}
            <div className="form-field">
              <label className="form-label">
                Ngày thực hiện
              </label>
              <input
                type="date"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Assigned Team */}
            <div className="form-field">
              <label className="form-label">
                Đội kỹ thuật phụ trách
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Phòng Kỹ Thuật Cơ Điện"
                value={assignedTeam}
                onChange={e => setAssignedTeam(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="form-field">
            <label className="form-label">Độ ưu tiên</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              className="form-select"
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
          <div className="form-field">
            <label className="form-label">
              Mô tả công việc
            </label>
            <textarea
              placeholder="Mô tả các linh kiện cần sửa hoặc thay mới..."
              value={description}
              onChange={e => setDescription(e.target.value)}
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
              {submitting ? 'Đang lưu...' : 'Lưu lịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
