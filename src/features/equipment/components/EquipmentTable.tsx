import { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Wrench,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';
import type { EquipmentItem, EquipmentStatus } from '../types';
import './EquipmentTable.css';

interface EquipmentTableProps {
  equipments: EquipmentItem[];
  loading: boolean;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  onEdit: (item: EquipmentItem) => void;
  onDelete: (id: number) => void;
  onBulkUpdateStatus: (status: EquipmentStatus) => void;
  onBulkDelete: () => void;
}

export default function EquipmentTable({
  equipments,
  loading,
  selectedIds,
  setSelectedIds,
  onEdit,
  onDelete,
  onBulkUpdateStatus,
  onBulkDelete
}: EquipmentTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Auto reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter & Paginate
  const filteredEquipments = equipments.filter(item => {
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEquipments.slice(indexOfFirstItem, indexOfLastItem);

  const isAllSelectedOnPage =
    currentItems.length > 0 && currentItems.every(item => selectedIds.includes(item.id));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const idsOnPage = currentItems.map(item => item.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...idsOnPage])));
    } else {
      const idsOnPage = currentItems.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !idsOnPage.includes(id)));
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <div className="table-section">
      <div className="actions-row">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 ? (
          <div className="bulk-action-bar">
            <span className="bulk-badge">Đã chọn {selectedIds.length} máy:</span>
            <button
              onClick={() => onBulkUpdateStatus('OPERATIONAL')}
              className="btn-bulk"
            >
              Hoạt động
            </button>
            <button
              onClick={() => onBulkUpdateStatus('UNDER_MAINTENANCE')}
              className="btn-bulk-warning"
            >
              Bảo trì
            </button>
            <button
              onClick={() => onBulkUpdateStatus('OUT_OF_SERVICE')}
              className="btn-bulk-danger"
            >
              Báo hỏng
            </button>
            <button
              onClick={onBulkDelete}
              className="btn-bulk-delete"
            >
              Xóa hết
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Tìm tên hoặc mã thiết bị..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <div className="table-scroll-wrapper">
          <table className="equipment-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-cell-check">
                  <input
                    type="checkbox"
                    checked={isAllSelectedOnPage}
                    onChange={handleSelectAll}
                    className="table-checkbox"
                  />
                </th>
                <th className="table-cell-header">
                  Tên thiết bị / Vị trí
                </th>
                <th className="table-cell-header">
                  Trạng thái
                </th>
                <th className="table-cell-header">
                  Mã thiết bị
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center', color: '#71717a', fontSize: '0.875rem' }}>
                    Đang tải danh sách trang thiết bị...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map(item => (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell-check">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={e => handleSelectItem(item.id, e.target.checked)}
                        className="table-checkbox"
                      />
                    </td>
                    <td className="table-cell-content">
                      <div>
                        <div className="item-name">
                          {item.name}
                        </div>
                        <div className="item-details">
                          Vị trí: {item.location} • Bảo dưỡng: {item.lastServiceDate}
                          {item.note && ` • Ghi chú: ${item.note}`}
                        </div>
                      </div>
                    </td>

                    <td className="table-cell-content">
                      <div className="status-badge-wrapper">
                        {item.status === 'OPERATIONAL' && (
                          <>
                            <CheckCircle2 className="status-icon operational" size={16} />
                            <span className="status-text operational">
                              Hoạt động
                            </span>
                          </>
                        )}
                        {item.status === 'UNDER_MAINTENANCE' && (
                          <>
                            <Wrench className="status-icon maintenance" size={16} />
                            <span className="status-text maintenance">
                              Bảo trì
                            </span>
                          </>
                        )}
                        {item.status === 'OUT_OF_SERVICE' && (
                          <>
                            <XCircle className="status-icon broken" size={16} />
                            <span className="status-text broken">
                              Hỏng
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="table-cell-code">{item.code}</td>

                    <td className="table-cell-content">
                      <div className="row-actions">
                        <button
                          onClick={() => onEdit(item)}
                          className="btn-row-action edit"
                          title="Sửa thiết bị"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="btn-row-action delete"
                          title="Xóa thiết bị"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center', color: '#71717a', fontSize: '0.875rem' }}>
                    Không tìm thấy thiết bị nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <div className="pagination-info">
            Hiển thị{' '}
            <span>
              {filteredEquipments.length === 0 ? 0 : indexOfFirstItem + 1}
            </span>{' '}
            -{' '}
            <span>
              {Math.min(indexOfLastItem, filteredEquipments.length)}
            </span>{' '}
            trong số <span>{filteredEquipments.length}</span>{' '}
            thiết bị
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-pagination-arrow"
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`btn-page-number ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="btn-pagination-arrow"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
