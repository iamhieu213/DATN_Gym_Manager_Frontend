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
import './EquipmentTable.animations.css';

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
    <div className="flex flex-col gap-6 xl:col-span-2">
      <div className="flex flex-col gap-4 items-center justify-between md:flex-row">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 bg-brand/5 border border-brand/20 rounded-lg px-3 py-1.5 text-xs text-white animate-[fadeIn_0.3s_ease]">
            <span className="font-bold text-brand mr-1">Đã chọn {selectedIds.length} máy:</span>
            <button
              onClick={() => onBulkUpdateStatus('OPERATIONAL')}
              className="px-2 py-1 bg-white/5 rounded font-bold text-white cursor-pointer transition-all duration-200 text-[10px] hover:bg-white/10"
            >
              Hoạt động
            </button>
            <button
              onClick={() => onBulkUpdateStatus('UNDER_MAINTENANCE')}
              className="px-2 py-1 bg-amber-500/10 rounded font-bold text-amber-500 cursor-pointer transition-all duration-200 text-[10px] hover:bg-amber-500/20"
            >
              Bảo trì
            </button>
            <button
              onClick={() => onBulkUpdateStatus('OUT_OF_SERVICE')}
              className="px-2 py-1 bg-red-500/10 rounded font-bold text-red-400 cursor-pointer transition-all duration-200 text-[10px] hover:bg-red-500/20"
            >
              Báo hỏng
            </button>
            <button
              onClick={onBulkDelete}
              className="px-2.5 py-1 bg-red-600 rounded font-bold text-white cursor-pointer transition-all duration-200 ml-2 text-[10px] hover:bg-red-500"
            >
              Xóa hết
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm tên hoặc mã thiết bị..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pr-4 pl-9 text-xs text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-brand box-border"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white/[1.5%] border border-white/5 rounded-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[2%]">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelectedOnPage}
                    onChange={handleSelectAll}
                    className="rounded border border-white/10 bg-white/5 cursor-pointer w-3.5 h-3.5 checked:bg-brand checked:border-brand"
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Tên thiết bị / Vị trí
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Mã thiết bị
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-zinc-500 text-sm px-6 py-12">
                    Đang tải danh sách trang thiết bị...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map(item => (
                  <tr key={item.id} className="group border-b border-white/5 last:border-b-0 transition-colors duration-200 hover:bg-white/[2%]">
                    <td className="px-6 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={e => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border border-white/10 bg-white/5 cursor-pointer w-3.5 h-3.5 checked:bg-brand checked:border-brand"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-white transition-colors duration-200 group-hover:text-brand">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          Vị trí: {item.location} • Bảo dưỡng: {item.lastServiceDate}
                          {item.note && ` • Ghi chú: ${item.note}`}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.status === 'OPERATIONAL' && (
                          <>
                            <CheckCircle2 className="text-brand fill-brand/10" size={16} />
                            <span className="text-brand text-[10px] font-bold uppercase tracking-wider">
                              Hoạt động
                            </span>
                          </>
                        )}
                        {item.status === 'UNDER_MAINTENANCE' && (
                          <>
                            <Wrench className="text-amber-400 fill-amber-400/10" size={16} />
                            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                              Bảo trì
                            </span>
                          </>
                        )}
                        {item.status === 'OUT_OF_SERVICE' && (
                          <>
                            <XCircle className="text-red-500 fill-red-500/10" size={16} />
                            <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">
                              Hỏng
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{item.code}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded border-none bg-transparent cursor-pointer transition-all duration-200 flex items-center justify-center text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          title="Sửa thiết bị"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 rounded border-none bg-transparent cursor-pointer transition-all duration-200 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-400/10"
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
                  <td colSpan={5} className="text-center text-zinc-500 text-sm px-6 py-12">
                    Không tìm thấy thiết bị nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col items-center justify-between gap-4 px-6 py-4 border-t border-white/5 bg-white/[1%] box-border sm:flex-row">
          <div className="text-xs text-zinc-500">
            Hiển thị{' '}
            <span className="font-semibold text-white">
              {filteredEquipments.length === 0 ? 0 : indexOfFirstItem + 1}
            </span>{' '}
            -{' '}
            <span className="font-semibold text-white">
              {Math.min(indexOfLastItem, filteredEquipments.length)}
            </span>{' '}
            trong số <span className="font-semibold text-white">{filteredEquipments.length}</span>{' '}
            thiết bị
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/5 bg-white/[2%] text-zinc-500 cursor-pointer transition-all duration-200 flex items-center justify-center hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
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
                    className={`w-7 h-7 rounded-lg text-xs font-bold border cursor-pointer transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-brand text-black border-brand shadow-[0_0_10px_rgba(195,244,0,0.35)]'
                        : 'border-white/5 bg-white/[2%] text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-white/5 bg-white/[2%] text-zinc-500 cursor-pointer transition-all duration-200 flex items-center justify-center hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
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
