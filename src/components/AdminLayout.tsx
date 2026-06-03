import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  UserCheck,
  Package,
  Calendar,
  CreditCard,
  TrendingUp,
  Settings,
  Wrench,
  Zap,
  LogOut,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Tách biệt menu điều hướng
  const menuItems = [
    { path: '/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard, section: 'Tổng Quan' },
    { path: '/dashboard/members', label: 'Hội viên', icon: Users, section: 'Tổng Quan' },
    { path: '/dashboard/pts', label: 'Huấn luyện viên', icon: Dumbbell, section: 'Tổng Quan' },

    { path: '/dashboard/staff', label: 'Nhân sự', icon: UserCheck, section: 'Vận Hành' },
    { path: '/dashboard/packages', label: 'Gói tập', icon: Package, section: 'Vận Hành' },
    { path: '/dashboard/bookings', label: 'Lịch đặt chỗ', icon: Calendar, section: 'Vận Hành' },
    { path: '/dashboard/payments', label: 'Thanh toán', icon: CreditCard, section: 'Vận Hành' },

    { path: '/dashboard/reports', label: 'Báo cáo', icon: TrendingUp, section: 'Hệ Thống' },
    { path: '/dashboard/equipment', label: 'Trang thiết bị', icon: Settings, section: 'Hệ Thống' },
    { path: '/dashboard/maintenance', label: 'Bảo trì', icon: Wrench, section: 'Hệ Thống' },
  ];

  // Gom nhóm theo Section
  const sections = ['Tổng Quan', 'Vận Hành', 'Hệ Thống'];

  return (
    <div className="flex min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased selection:bg-[#c3f400] selection:text-black">
      {/* SIDEBAR (THANH ĐIỀU HƯỚNG TRÁI) */}
      <aside className={`fixed h-full border-r border-white/5 bg-[#09090b] flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Brand Logo Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-[#c3f400] rounded-sm flex items-center justify-center text-black shrink-0">
              <Zap size={16} className="fill-current" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <Link to="/" className="text-sm font-bold tracking-tight text-white hover:text-[#c3f400] transition-colors whitespace-nowrap">
                  Kinetic Noir
                </Link>
                <span className="text-[8px] text-[#71717a] font-medium tracking-wider uppercase whitespace-nowrap">Command Center</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-[#71717a] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {sections.map(section => (
            <div key={section} className="space-y-1">
              {!isCollapsed ? (
                <div className="text-[10px] px-3 mb-2 font-bold text-[#71717a] tracking-widest uppercase transition-opacity duration-300">
                  {section}
                </div>
              ) : (
                <div className="h-px bg-white/5 my-2" />
              )}
              {menuItems
                .filter(item => item.section === section)
                .map(item => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center rounded-md transition-all text-left ${
                        isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-[#c3f400]/8 text-[#c3f400] border-r-2 border-[#c3f400]'
                          : 'text-[#71717a] hover:text-white hover:bg-white/5'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium transition-all duration-300 whitespace-nowrap">{item.label}</span>}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* User Card Profile */}
        <div className="mt-auto p-4 border-t border-white/5">
          <div className={`flex items-center rounded-lg bg-white/5 border border-white/5 transition-all duration-300 ${
            isCollapsed ? 'justify-center p-1.5' : 'gap-3 p-2'
          }`}>
            <img
              alt="Marcus"
              className="w-8 h-8 rounded-full border border-white/10 shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPyVOx7u_qADtod-mYf-cX6jmiwaYre8VU2IZS9niiYnZwgHCuwrzNwKhdUtA72rSl6nIUuX9Q1cByyDgnGRLPEtsfJsDNjxw0HPEAzwfxm3vTqyq2vQFD-7ssxooXRdI3H0Ct3uMVD_7SVF81OQGsBNCU0gR5QHENFZo63IFshnT_ID5gpfGs14TJl1uXy6MV4t9kdbeVp9lCVOF4pnmYPWOmJqqfI1D-TAfj-Zktw5XXZUuIQkI28MtPoR4la0m6U09XV_-xh7E"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0 transition-opacity duration-300">
                <div className="text-xs font-bold text-white truncate">Marcus Thorne</div>
                <div className="text-[10px] text-[#71717a] truncate">Giám đốc quản lý</div>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={() => {
                  if (confirm('Bạn muốn đăng xuất?')) {
                    navigate('/');
                  }
                }}
                className="text-[#71717a] hover:text-red-500 transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={() => {
                if (confirm('Bạn muốn đăng xuất?')) {
                  navigate('/');
                }
              }}
              className="w-full flex justify-center mt-2 p-2 rounded-md text-[#71717a] hover:text-red-500 hover:bg-white/5 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          {/* Thanh tìm kiếm */}
          <div className="flex items-center gap-3 w-1/3">
            <Search className="h-5 w-5 text-[#71717a]" />
            <input
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-white placeholder:text-[#71717a] w-full"
              placeholder="Tìm kiếm vận hành, hội viên hoặc giao dịch..."
              type="text"
            />
          </div>

          {/* Công cụ góc phải */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#c3f400]/10 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></div>
              <span className="text-[11px] font-bold text-[#c3f400] tracking-wide uppercase">Hệ thống tối ưu</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-1 text-[#71717a] hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#c3f400] rounded-full border-2 border-[#09090b]"></span>
              </button>
              <button className="p-1 text-[#71717a] hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <button className="bg-[#c3f400] text-black px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(195,244,0,0.2)]">
              Tạo Bản Ghi
            </button>
          </div>
        </header>

        {/* Nội dung trang con sẽ được render ở đây */}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#c3f400] text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(195,244,0,0.4)] hover:scale-105 active:scale-95 transition-all z-50">
        <Plus size={24} />
      </button>
    </div>
  );
}

export default AdminLayout;
