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
    <div className="xl:col-span-2 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 bg-[#c3f400]/5 border border-[#c3f400]/20 rounded-lg px-3 py-1.5 text-xs text-white animate-fade-in">
            <span className="font-bold text-[#c3f400] mr-1">Đã chọn {selectedIds.length} máy:</span>
            <button
              onClick={() => onBulkUpdateStatus('OPERATIONAL')}
              className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded font-bold cursor-pointer transition-all text-[10px]"
            >
              Hoạt động
            </button>
            <button
              onClick={() => onBulkUpdateStatus('UNDER_MAINTENANCE')}
              className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded font-bold cursor-pointer transition-all text-[10px]"
            >
              Bảo trì
            </button>
            <button
              onClick={() => onBulkUpdateStatus('OUT_OF_SERVICE')}
              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded font-bold cursor-pointer transition-all text-[10px]"
            >
              Báo hỏng
            </button>
            <button
              onClick={onBulkDelete}
              className="px-2.5 py-1 bg-red-600 text-white font-bold rounded hover:bg-red-500 cursor-pointer transition-all ml-2 text-[10px]"
            >
              Xóa hết
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm tên hoặc mã thiết bị..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#71717a] focus:ring-1 focus:ring-[#c3f400] focus:border-[#c3f400] focus:outline-none"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white/1.5 border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelectedOnPage}
                    onChange={handleSelectAll}
                    className="rounded border-white/10 bg-white/5 text-[#c3f400] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">
                  Tên thiết bị / Vị trí
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">
                  Mã thiết bị
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#71717a] text-sm">
                    Đang tải danh sách trang thiết bị...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map(item => (
                  <tr key={item.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={e => handleSelectItem(item.id, e.target.checked)}
                        className="rounded border-white/10 bg-white/5 text-[#c3f400] focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-white group-hover:text-[#c3f400] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#71717a] mt-0.5">
                          Vị trí: {item.location} • Bảo dưỡng: {item.lastServiceDate}
                          {item.note && ` • Ghi chú: ${item.note}`}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.status === 'OPERATIONAL' && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#c3f400] fill-[#c3f400]/10" />
                            <span className="text-[#c3f400] text-[10px] font-bold uppercase tracking-wider">
                              Hoạt động
                            </span>
                          </>
                        )}
                        {item.status === 'UNDER_MAINTENANCE' && (
                          <>
                            <Wrench className="w-4 h-4 text-amber-400 fill-amber-400/10" />
                            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                              Bảo trì
                            </span>
                          </>
                        )}
                        {item.status === 'OUT_OF_SERVICE' && (
                          <>
                            <XCircle className="w-4 h-4 text-red-500 fill-red-500/10" />
                            <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">
                              Hỏng
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-[#71717a]">{item.code}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 rounded hover:bg-blue-500/10 cursor-pointer transition-all"
                          title="Sửa thiết bị"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 cursor-pointer transition-all"
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
                  <td colSpan={5} className="px-6 py-12 text-center text-[#71717a] text-sm">
                    Không tìm thấy thiết bị nào khớp với từ khóa tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/5 bg-white/1">
          <div className="text-xs text-[#71717a]">
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
                className="p-1.5 rounded-lg border border-white/5 bg-white/2 text-[#71717a] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:text-[#71717a] disabled:hover:bg-transparent cursor-pointer transition-all"
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
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#c3f400] text-black shadow-[0_0_10px_rgba(195,244,0,0.35)]'
                        : 'border border-white/5 bg-white/2 text-[#71717a] hover:text-white hover:bg-white/5'
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
                className="p-1.5 rounded-lg border border-white/5 bg-white/2 text-[#71717a] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:text-[#71717a] disabled:hover:bg-transparent cursor-pointer transition-all"
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
