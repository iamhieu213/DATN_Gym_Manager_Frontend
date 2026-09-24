import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getMyProfile, logoutUser } from '../features/auth/services/authApi';
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
  const [userProfile, setUserProfile] = useState<{
    name: string;
    avatarUrl: string | null;
    role: string;
  } | null>(null);

  // Lấy thông tin cá nhân của tài khoản đăng nhập
  useEffect(() => {
    getMyProfile()
      .then((res: any) => {
        if (res.success) {
          setUserProfile(res.data);
        }
      })
      .catch((err: any) => {
        console.error("Lỗi khi tải thông tin cá nhân:", err);
      });
  }, []);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'STAFF':
        return 'Nhân viên vận hành';
      default:
        return 'Nhân viên';
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Đăng xuất?',
      text: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      background: '#09090b',
      color: '#fafafa',
      confirmButtonColor: '#c3f400',
      cancelButtonColor: '#27272a',
      customClass: {
        confirmButton: 'text-black font-bold',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            await logoutUser(refreshToken);
          }
        } catch (err) {
          console.error("Lỗi khi gọi API logout:", err);
        } finally {
          // Xóa token ở client trong mọi trường hợp
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // Thông báo đăng xuất thành công
          Swal.fire({
            title: 'Đã đăng xuất!',
            text: 'Bạn đã đăng xuất khỏi hệ thống thành công.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#09090b',
            color: '#fafafa',
          }).then(() => {
            navigate('/login');
          });
        }
      }
    });
  };

  // Tách biệt menu điều hướng
  const menuItems = [
    { path: '/admin', label: 'Bảng điều khiển', icon: LayoutDashboard, section: 'Tổng Quan' },
    { path: '/admin/members', label: 'Hội viên', icon: Users, section: 'Tổng Quan' },
    { path: '/admin/pts', label: 'Huấn luyện viên', icon: Dumbbell, section: 'Tổng Quan' },

    { path: '/admin/staff', label: 'Nhân sự', icon: UserCheck, section: 'Vận Hành' },
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
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-brand selection:text-black">
      {/* SIDEBAR (THANH ĐIỀU HƯỚNG TRÁI) */}
      <aside
        className={`fixed h-full border-r border-white/5 bg-zinc-950 flex flex-col z-50 transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Brand Logo Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-brand rounded flex items-center justify-center text-black shrink-0">
              <Zap size={16} fill="currentColor" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <Link to="/" className="text-sm font-bold tracking-[-0.02em] text-white no-underline transition-colors duration-200 whitespace-nowrap hover:text-brand">
                  Kinetic Noir
                </Link>
                <span className="text-[8px] text-zinc-500 font-medium tracking-wider uppercase whitespace-nowrap">Command Center</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-zinc-500 bg-transparent border-none cursor-pointer flex items-center justify-center transition-colors duration-200 hover:text-white hover:bg-white/5"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-xs">
          {sections.map(section => (
            <div key={section} className="flex flex-col gap-1">
              {!isCollapsed ? (
                <div className="text-[10px] px-3 mb-2 font-bold text-zinc-500 tracking-widest uppercase">
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
                      className={`flex items-center rounded-md no-underline transition-all duration-200 gap-3 ${isCollapsed ? 'justify-center p-2.5' : 'py-2.5 px-3'} ${isActive ? 'bg-brand/8 text-brand border-r-2 border-brand' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* User Card Profile */}
        <div className="mt-auto p-4 border-t border-white/5">
          <div className={`flex items-center rounded-lg bg-white/5 border border-white/5 gap-3 transition-all duration-300 ${isCollapsed ? 'justify-center p-1.5' : 'p-2'}`}>
            <img
              alt={userProfile?.name || "User Avatar"}
              className="w-8 h-8 rounded-full border border-white/10 shrink-0 object-cover"
              src={userProfile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100"}
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {userProfile?.name || "Đang tải..."}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">
                  {userProfile ? getRoleLabel(userProfile.role) : "---"}
                </div>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="bg-transparent border-none text-zinc-500 cursor-pointer p-1 flex items-center justify-center transition-colors duration-200 hover:text-red-500"
                title="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center mt-2 p-2 rounded-md bg-transparent border-none text-zinc-500 cursor-pointer transition-colors duration-200 hover:text-red-500 hover:bg-white/5"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 min-h-screen flex flex-col transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          {/* Thanh tìm kiếm */}
          <div className="flex items-center gap-3 w-1/3">
            <Search className="h-5 w-5 text-zinc-500" />
            <input
              className="bg-transparent border-none text-white text-sm w-full outline-none placeholder:text-zinc-500"
              placeholder="Tìm kiếm vận hành, hội viên hoặc giao dịch..."
              type="text"
            />
          </div>

          {/* Công cụ góc phải */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 py-1 px-3 bg-brand/10 rounded-full">
              <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
              <span className="text-[11px] font-bold text-brand tracking-wider uppercase">Hệ thống tối ưu</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative bg-transparent border-none p-1 text-zinc-500 cursor-pointer flex items-center justify-center transition-colors duration-200 hover:text-white">
                <Bell className="h-5 w-5 text-zinc-500" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full border-2 border-zinc-950"></span>
              </button>
              <button className="relative bg-transparent border-none p-1 text-zinc-500 cursor-pointer flex items-center justify-center transition-colors duration-200 hover:text-white">
                <Settings className="h-5 w-5 text-zinc-500" />
              </button>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <button className="bg-brand text-black py-2 px-4 rounded-md border-none text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(195,244,0,0.2)] transition-all duration-200 hover:brightness-110 active:scale-95">
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
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-brand text-black rounded-full flex items-center justify-center border-none cursor-pointer shadow-[0_0_20px_rgba(195,244,0,0.4)] transition-transform duration-200 z-50 hover:scale-105 active:scale-95">
        <Plus size={24} />
      </button>
    </div>
  );
}

export default AdminLayout;
