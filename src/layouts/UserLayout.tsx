import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { getMyProfile } from '../features/auth/services/authApi';
import Header from '../shared/components/Header';
import './UserLayout.animations.css';
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  Users,
  ClipboardList,
  ListChecks,
  BookOpen,
  NotebookText,
  IdCard,
  Activity,
  Apple,
  UserPlus,
  QrCode,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Menu điều hướng của khu vực Hội viên, gom nhóm theo Section (đồng bộ pattern với AdminLayout)
const menuItems = [
  { path: '/user', label: 'Tổng quan', icon: LayoutDashboard, section: 'Tổng Quát' },
  { path: '/user/schedule', label: 'Lịch tập', icon: Calendar, section: 'Tổng Quát' },

  { path: '/user/workouts', label: 'Bài tập của tôi', icon: ListChecks, section: 'Tập Luyện' },
  { path: '/user/training', label: 'Tập luyện', icon: Dumbbell, section: 'Tập Luyện' },
  { path: '/user/plans', label: 'Kế hoạch tập luyện', icon: ClipboardList, section: 'Tập Luyện' },
  { path: '/user/exercise-library', label: 'Thư viện bài tập', icon: BookOpen, section: 'Tập Luyện' },
  { path: '/user/lesson-library', label: 'Thư viện giáo án', icon: NotebookText, section: 'Tập Luyện' },

  { path: '/user/membership-card', label: 'Thẻ hội viên', icon: IdCard, section: 'Hội Viên' },
  { path: '/user/body-metrics', label: 'Chỉ số cơ thể', icon: Activity, section: 'Hội Viên' },
  { path: '/user/nutrition', label: 'Tra cứu dinh dưỡng', icon: Apple, section: 'Hội Viên' },

  { path: '/user/coaches', label: 'Huấn luyện viên', icon: Users, section: 'HLV' },
  { path: '/user/coach-packages', label: 'Đăng ký gói HLV', icon: UserPlus, section: 'HLV' },
];

const sections = ['Tổng Quát', 'Tập Luyện', 'Hội Viên', 'HLV'];

export default function UserLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Trạng thái đóng/mở của từng nhóm menu (node cha), mặc định mở hết
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(sections.map((section) => [section, true]))
  );
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null>(null);

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

  // Hàm xác định xem Link có đang được active hay không
  const isActive = (path: string) => location.pathname === path;

  // Đóng/mở một nhóm menu (node cha)
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-brand selection:text-black">
      {/* 1. SIDEBAR (Dành cho Desktop màn hình lớn) */}
      <aside
        className={`hidden lg:flex flex-col fixed h-full border-r border-white/5 bg-zinc-950 z-50 box-border transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className={`flex items-center border-b border-white/5 ${isCollapsed ? 'justify-center py-4 px-2' : 'justify-between p-4'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 bg-brand rounded flex items-center justify-center text-black shrink-0">
                <Dumbbell size={16} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[-0.02em] text-white transition-colors duration-200 whitespace-nowrap hover:text-brand">KINETIC</span>
                <span className="text-[8px] text-zinc-500 font-medium tracking-wider uppercase whitespace-nowrap">Thành viên Elite</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-zinc-500 bg-transparent border-none cursor-pointer flex items-center justify-center transition-colors duration-200 hover:text-white hover:bg-white/5"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-xs">
          {sections.map(section => {
            const items = menuItems.filter(item => item.section === section);
            // Khi sidebar đã thu gọn thành icon-rail thì luôn hiện đủ icon, bỏ qua trạng thái đóng/mở
            const isOpen = isCollapsed ? true : openSections[section];
            return (
              <div key={section} className="flex flex-col gap-1">
                {!isCollapsed ? (
                  <button
                    type="button"
                    className="text-[10px] px-3 mb-2 font-bold text-zinc-500 tracking-widest uppercase flex items-center justify-between w-full bg-transparent border-none cursor-pointer font-sans transition-colors duration-200 hover:text-zinc-400"
                    onClick={() => toggleSection(section)}
                    aria-expanded={isOpen}
                  >
                    <span>{section}</span>
                    <ChevronDown size={14} className={`section-chevron ${isOpen ? '' : 'is-closed'}`} />
                  </button>
                ) : (
                  <div className="h-px bg-white/5 my-2" />
                )}
                <div className={`nav-section-items ${isOpen ? '' : 'is-closed'}`}>
                  <div className="nav-section-items-inner">
                    {items.map(item => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center rounded-md no-underline transition-all duration-200 gap-3 border-none bg-transparent text-left cursor-pointer w-full box-border ${isCollapsed ? 'justify-center p-2.5' : 'py-2.5 px-3'} ${isActive(item.path) ? 'bg-brand/8 text-brand border-l-2 border-brand' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon size={18} className="shrink-0" />
                          {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH */}
      <div className={`flex-1 min-h-screen flex flex-col box-border transition-[margin-left] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <Header userProfile={userProfile ? { ...userProfile, role: 'USER' } : null} />

        {/* Nội dung trang con */}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION (Hiện trên màn hình nhỏ) */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] bg-zinc-950 border-t border-white/5 flex justify-around items-center px-4 z-50 box-border lg:hidden">
        <Link to="/user" className={`bg-transparent border-none flex flex-col items-center gap-1 no-underline cursor-pointer ${isActive('/user') ? 'text-brand' : 'text-zinc-500'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Tổng Quan</span>
        </Link>
        <Link to="/user/workouts" className="bg-transparent border-none flex flex-col items-center gap-1 text-zinc-500 no-underline cursor-pointer">
          <Dumbbell size={20} />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Bài Tập</span>
        </Link>
        <button className="bg-transparent border-none flex flex-col items-center gap-1 text-zinc-500 no-underline cursor-pointer relative">
          <div className="w-11 h-11 bg-brand text-black rounded-full flex items-center justify-center -mt-9 border-4 border-zinc-950 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.5)]">
            <QrCode size={20} />
          </div>
          <span className="text-[9px] font-semibold uppercase tracking-wider">Check-in</span>
        </button>
        <Link to="/user/schedule" className="bg-transparent border-none flex flex-col items-center gap-1 text-zinc-500 no-underline cursor-pointer">
          <Calendar size={20} />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Lịch</span>
        </Link>
        <Link to="/user/profile" className="bg-transparent border-none flex flex-col items-center gap-1 text-zinc-500 no-underline cursor-pointer">
          <User size={20} />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Hồ Sơ</span>
        </Link>
      </nav>
    </div>
  );
}
