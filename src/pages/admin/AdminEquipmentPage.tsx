import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Plus,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Wrench,
  XCircle,
  Sliders,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type EquipmentStatus = 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE';

interface EquipmentItem {
  id: number;
  name: string;
  code: string;
  status: EquipmentStatus;
  location: string;
  category: 'Cardio' | 'Strength' | 'Functional' | 'Recovery';
  lastServiceDate: string;
  image: string;
}

interface MaintenanceTask {
  id: number;
  day: string;
  month: string;
  title: string;
  description: string;
  priority: 'CRITICAL' | 'ROUTINE' | 'NORMAL';
  assignedTeam?: string;
  avatars?: string[];
}

function AdminEquipmentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Cardio' | 'Strength' | 'Functional' | 'Recovery'>('All');
  
  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Chỉ hiển thị tối đa 5 thiết bị trên 1 trang

  // Danh sách 16 thiết bị đồng bộ với database
  const [equipments] = useState<EquipmentItem[]>([
    {
      id: 1,
      name: 'Máy chạy bộ Impulse RT500',
      code: 'EQ-RUN-01',
      status: 'OPERATIONAL',
      location: 'Khu Cardio',
      category: 'Cardio',
      lastServiceDate: '12/10/2025',
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=150'
    },
    {
      id: 2,
      name: 'Máy chạy bộ Impulse RT500',
      code: 'EQ-RUN-02',
      status: 'OPERATIONAL',
      location: 'Khu Cardio',
      category: 'Cardio',
      lastServiceDate: '15/10/2025',
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=150'
    },
    {
      id: 3,
      name: 'Máy chạy bộ Technogym Skillrun',
      code: 'EQ-RUN-03',
      status: 'UNDER_MAINTENANCE',
      location: 'Khu Cardio',
      category: 'Cardio',
      lastServiceDate: '01/11/2025',
      image: 'https://images.unsplash.com/photo-1578762560072-46cf12a052ea?w=150'
    },
    {
      id: 4,
      name: 'Máy chạy bộ Matrix T70',
      code: 'EQ-RUN-04',
      status: 'OUT_OF_SERVICE',
      location: 'Khu Cardio',
      category: 'Cardio',
      lastServiceDate: '28/09/2025',
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150'
    },
    {
      id: 5,
      name: 'Xe đạp trượt tuyết Elliptical BH',
      code: 'EQ-CYC-01',
      status: 'OPERATIONAL',
      location: 'Khu Cardio',
      category: 'Cardio',
      lastServiceDate: '10/10/2025',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150'
    },
    {
      id: 6,
      name: 'Xe đạp tập Impulse DUO',
      code: 'EQ-CYC-02',
      status: 'OPERATIONAL',
      location: 'Khu Cardio',
      category: 'Cardio',
      lastServiceDate: '18/10/2025',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150'
    },
    {
      id: 7,
      name: 'Máy chèo thuyền WaterRower',
      code: 'EQ-ROW-01',
      status: 'OPERATIONAL',
      location: 'Khu Cardio',
      category: 'Cardio',
      lastServiceDate: '05/11/2025',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150'
    },
    {
      id: 8,
      name: 'Khung gánh tạ Squat Rack DHZ',
      code: 'EQ-SQU-01',
      status: 'OPERATIONAL',
      location: 'Khu FreeWeight',
      category: 'Strength',
      lastServiceDate: '30/09/2025',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150'
    },
    {
      id: 9,
      name: 'Khung Smith Machine Matrix',
      code: 'EQ-SQU-02',
      status: 'OPERATIONAL',
      location: 'Khu FreeWeight',
      category: 'Strength',
      lastServiceDate: '12/10/2025',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150'
    },
    {
      id: 10,
      name: 'Máy đạp đùi Leg Press Matrix',
      code: 'EQ-LEG-01',
      status: 'OPERATIONAL',
      location: 'Khu máy khối',
      category: 'Strength',
      lastServiceDate: '24/10/2025',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150'
    },
    {
      id: 11,
      name: 'Máy đùi sau Leg Curl DHZ',
      code: 'EQ-LEG-02',
      status: 'UNDER_MAINTENANCE',
      location: 'Khu máy khối',
      category: 'Strength',
      lastServiceDate: '02/11/2025',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150'
    },
    {
      id: 12,
      name: 'Dàn tạ đĩa 500kg Iron Bull',
      code: 'EQ-FWE-01',
      status: 'OPERATIONAL',
      location: 'Khu FreeWeight',
      category: 'Functional',
      lastServiceDate: '01/10/2025',
      image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=150'
    },
    {
      id: 13,
      name: 'Dàn tạ tay Dumbbells 5kg-40kg',
      code: 'EQ-FWE-02',
      status: 'OPERATIONAL',
      location: 'Khu FreeWeight',
      category: 'Functional',
      lastServiceDate: '01/10/2025',
      image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=150'
    },
    {
      id: 14,
      name: 'Ghế tập ngực ngang Bench Press',
      code: 'EQ-FWE-03',
      status: 'OPERATIONAL',
      location: 'Khu FreeWeight',
      category: 'Functional',
      lastServiceDate: '15/10/2025',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150'
    },
    {
      id: 15,
      name: 'Ghế tập ngực dốc Incline Bench',
      code: 'EQ-FWE-04',
      status: 'OUT_OF_SERVICE',
      location: 'Khu FreeWeight',
      category: 'Functional',
      lastServiceDate: '18/10/2025',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150'
    },
    {
      id: 16,
      name: 'Máy ép ngực Pec Fly Matrix',
      code: 'EQ-PEC-01',
      status: 'OPERATIONAL',
      location: 'Khu máy khối',
      category: 'Strength',
      lastServiceDate: '26/10/2025',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150'
    }
  ]);

  const [maintenanceTasks] = useState<MaintenanceTask[]>([
    {
      id: 1,
      day: '05',
      month: 'Nov',
      title: 'Căn chỉnh băng tải chạy',
      description: '6 Máy chạy bộ • Sảnh A',
      priority: 'NORMAL',
      assignedTeam: 'Đội Kỹ Thuật Cơ Điện',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50'
      ]
    },
    {
      id: 2,
      day: '08',
      month: 'Nov',
      title: 'Kiểm tra cáp chịu lực',
      description: 'Dàn máy tập khối Tạ kéo',
      priority: 'CRITICAL'
    },
    {
      id: 3,
      day: '12',
      month: 'Nov',
      title: 'Nạp khí Cryo Tank Nitơ',
      description: 'Trung tâm Phục hồi trị liệu',
      priority: 'ROUTINE'
    }
  ]);

  // Các chỉ số Metric
  const totalCount = equipments.length;
  const inUseCount = equipments.filter(e => e.status === 'OPERATIONAL').length;
  const maintenanceCount = equipments.filter(e => e.status === 'UNDER_MAINTENANCE').length;
  const brokenCount = equipments.filter(e => e.status === 'OUT_OF_SERVICE').length;
  const loadPercentage = Math.round((inUseCount / totalCount) * 100);

  // Lọc thiết bị
  const filteredEquipments = equipments.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset trang về 1 khi thay đổi bộ lọc tìm kiếm hoặc danh mục
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  // Phân chia dữ liệu theo trang hiện tại
  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEquipments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-8 w-full space-y-8 flex-1">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Sliders className="text-[#c3f400] h-8 w-8" />
            Quản Lý Trang Thiết Bị
          </h1>
          <p className="text-[#71717a] text-sm mt-1">
            Theo dõi, phân tích trạng thái bảo trì và quản lý cơ sở vật chất phòng gym Kinetic.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white/3 border border-white/5 rounded-lg text-xs font-bold text-white flex items-center gap-2 hover:bg-white/5 active:scale-95 transition-all cursor-pointer">
            <Download size={14} /> Xuất file báo cáo
          </button>
          <button className="px-5 py-2.5 bg-[#c3f400] text-black rounded-lg text-xs font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer">
            <Plus size={14} /> Thêm thiết bị mới
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 hover:-translate-y-1 transition-all duration-300">
          <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Tổng thiết bị</span>
          <div className="flex items-baseline gap-2 mt-4">
            <h3 className="text-3xl font-black text-white">{totalCount}</h3>
            <span className="text-[#c3f400] text-xs font-bold">+2 trong tháng</span>
          </div>
        </div>
        
        <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 border-l-2 border-l-[#c3f400] hover:-translate-y-1 transition-all duration-300">
          <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Đang hoạt động tốt</span>
          <div className="flex items-baseline gap-2 mt-4">
            <h3 className="text-3xl font-black text-[#c3f400]">{inUseCount}</h3>
            <span className="text-[#71717a] text-xs font-semibold">Tải công suất {loadPercentage}%</span>
          </div>
        </div>

        <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 hover:-translate-y-1 transition-all duration-300">
          <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Đang bảo trì định kỳ</span>
          <div className="flex items-baseline gap-2 mt-4">
            <h3 className="text-3xl font-black text-amber-400">{maintenanceCount}</h3>
            <span className="text-amber-400 text-xs font-semibold">Ưu tiên: Trung bình</span>
          </div>
        </div>

        <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 hover:-translate-y-1 transition-all duration-300">
          <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Hỏng hóc / Ngừng hoạt động</span>
          <div className="flex items-baseline gap-2 mt-4">
            <h3 className="text-3xl font-black text-red-500">{brokenCount}</h3>
            <span className="text-red-500 text-xs font-bold">Cần xử lý gấp</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Bảng danh sách thiết bị */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
              {(['All', 'Cardio', 'Strength', 'Functional', 'Recovery'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCategory(tab)}
                  className={`px-4 py-1.5 rounded text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === tab 
                      ? 'bg-white/10 text-[#c3f400]' 
                      : 'text-[#71717a] hover:text-white'
                  }`}
                >
                  {tab === 'All' ? 'Tất cả' : tab}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm tên hoặc mã thiết bị..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    <th className="px-6 py-4 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Tên thiết bị / Vị trí</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Phân loại</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Trạng thái</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Mã thiết bị</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/2 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#0e0e0e] flex items-center justify-center overflow-hidden border border-white/5 shrink-0">
                              <img 
                                alt={item.name} 
                                src={item.image} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-[#c3f400] transition-colors">{item.name}</div>
                              <div className="text-[10px] text-[#71717a] mt-0.5">Vị trí: {item.location} • Bảo dưỡng: {item.lastServiceDate}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded border border-white/5 bg-white/5 text-[#71717a]">
                            {item.category}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {item.status === 'OPERATIONAL' && (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-[#c3f400] fill-[#c3f400]/10" />
                                <span className="text-[#c3f400] text-[10px] font-bold uppercase tracking-wider">Hoạt động</span>
                              </>
                            )}
                            {item.status === 'UNDER_MAINTENANCE' && (
                              <>
                                <Wrench className="w-4 h-4 text-amber-400 fill-amber-400/10" />
                                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Bảo trì</span>
                              </>
                            )}
                            {item.status === 'OUT_OF_SERVICE' && (
                              <>
                                <XCircle className="w-4 h-4 text-red-500 fill-red-500/10" />
                                <span className="text-red-500 text-[10px] font-bold uppercase tracking-wider">Hỏng</span>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono text-xs text-[#71717a]">
                          {item.code}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button className="p-1 rounded text-[#71717a] hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                            <MoreVertical size={16} />
                          </button>
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
            
            {/* THANH PHÂN TRANG (Pagination Bar) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-white/5 bg-white/1">
              <div className="text-xs text-[#71717a]">
                Hiển thị <span className="font-semibold text-white">{filteredEquipments.length === 0 ? 0 : indexOfFirstItem + 1}</span> -{' '}
                <span className="font-semibold text-white">{Math.min(indexOfLastItem, filteredEquipments.length)}</span> trong số{' '}
                <span className="font-semibold text-white">{filteredEquipments.length}</span> thiết bị
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

        {/* Right Column: Lịch biểu bảo trì sắp tới */}
        <div className="space-y-6">
          <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Calendar className="text-[#c3f400] w-4 h-4" />
                Lịch trình bảo dưỡng
              </h3>
              <span className="text-[10px] font-mono text-[#71717a]">Tháng 11/2026</span>
            </div>

            {/* Lịch nhỏ (Mini Calendar Header) */}
            <div className="grid grid-cols-7 gap-1 text-center mb-6 text-xs border-b border-white/5 pb-4">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                <span key={day} className="text-[9px] font-bold text-[#71717a] uppercase">{day}</span>
              ))}
              <div className="p-1.5 text-[#71717a]/30">28</div>
              <div className="p-1.5 text-[#71717a]/30">29</div>
              <div className="p-1.5 text-[#71717a]/30">30</div>
              <div className="p-1.5 text-[#71717a]/30">31</div>
              <div className="p-1.5 font-bold text-white bg-white/10 rounded-sm">1</div>
              <div className="p-1.5 text-white">2</div>
              <div className="p-1.5 text-white">3</div>
              <div className="p-1.5 text-white">4</div>
              <div className="p-1.5 relative text-[#c3f400] font-bold">
                5 
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c3f400]"></span>
              </div>
              <div className="p-1.5 text-white">6</div>
              <div className="p-1.5 text-white">7</div>
              <div className="p-1.5 text-white">8</div>
              <div className="p-1.5 text-white">9</div>
              <div className="p-1.5 text-white">10</div>
            </div>

            {/* List Công việc sắp tới */}
            <div className="space-y-4 flex-1">
              <h4 className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest border-b border-white/5 pb-2">Nhiệm vụ sắp tới</h4>
              
              {maintenanceTasks.map(task => (
                <div key={task.id} className="flex gap-4 items-start group">
                  <div className="flex flex-col items-center justify-center bg-white/5 border border-white/5 rounded-lg p-2 min-w-12 text-center shrink-0">
                    <span className="font-extrabold text-white text-md tracking-tighter">{task.day}</span>
                    <span className="text-[9px] text-[#71717a] uppercase font-mono">{task.month}</span>
                  </div>

                  <div className="flex-1 bg-white/2 rounded-xl p-4 border border-white/5 group-hover:border-[#c3f400]/20 transition-all duration-300">
                    <div className="font-bold text-xs text-white group-hover:text-[#c3f400] transition-colors">{task.title}</div>
                    <div className="text-[10px] text-[#71717a] mt-0.5 mb-2">{task.description}</div>
                    
                    {task.priority === 'CRITICAL' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-black tracking-widest uppercase">
                        Khẩn cấp
                      </span>
                    )}
                    {task.priority === 'ROUTINE' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#c3f400]/10 text-[#c3f400] text-[8px] font-black tracking-widest uppercase">
                        Định kỳ
                      </span>
                    )}
                    
                    {task.assignedTeam && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/2">
                        {task.avatars && (
                          <div className="flex -space-x-1.5">
                            {task.avatars.map((avatarUrl, idx) => (
                              <img 
                                key={idx} 
                                alt="Thợ sửa" 
                                src={avatarUrl} 
                                className="w-5 h-5 rounded-full border border-[#09090b] object-cover shrink-0" 
                              />
                            ))}
                          </div>
                        )}
                        <span className="text-[9px] text-[#71717a] font-medium">{task.assignedTeam}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="mt-6 w-full border border-white/10 py-2.5 rounded-lg font-bold text-xs text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer">
              Mở lịch biểu chi tiết
            </button>
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 right-0 -z-10 w-150 h-100 bg-[#c3f400]/3 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}

export default AdminEquipmentPage;