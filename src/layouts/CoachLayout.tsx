import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarClock, UserCircle, LogOut, Dumbbell } from 'lucide-react';
import { getMyProfile } from '../features/auth/services/authApi';
import { useLogout } from '../features/auth/hooks/useLogout';
import Header from '../shared/components/Header';

const menuItems = [
  { path: '/coach', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/coach/students', label: 'Học viên của tôi', icon: Users },
  { path: '/coach/availability', label: 'Lịch rảnh', icon: CalendarClock },
  { path: '/coach/profile', label: 'Hồ sơ HLV', icon: UserCircle },
];

export default function CoachLayout() {
  const location = useLocation();
  const handleLogout = useLogout();
  const [profile, setProfile] = useState<{ name: string; avatarUrl: string | null } | null>(null);

  useEffect(() => {
    getMyProfile()
      .then((res: any) => {
        if (res.success) setProfile(res.data);
      })
      .catch((err: any) => {
        console.error('Lỗi khi tải thông tin cá nhân:', err);
      });
  }, []);

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium no-underline transition-all duration-200 ${
      active ? 'border-l-2 border-brand bg-brand/8 text-brand' : 'text-zinc-500 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-zinc-950 font-sans text-white antialiased selection:bg-brand selection:text-black">
      {/* Sidebar (màn hình lớn) */}
      <aside className="fixed z-50 hidden h-full w-64 flex-col border-r border-white/5 bg-zinc-950 lg:flex">
        <div className="flex items-center gap-2 border-b border-white/5 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-brand text-black">
            <Dumbbell size={16} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">KINETIC</span>
            <span className="text-[8px] font-medium uppercase tracking-wider text-zinc-500">Huấn luyện viên</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} className={linkClass(location.pathname === path)}>
              <Icon size={18} className="shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/5 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md border-none bg-transparent px-3 py-2.5 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Khu vực nội dung */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        <Header userProfile={profile ? { ...profile, role: 'COACH' } : null} />

        {/* Thanh điều hướng ngang cho màn hình nhỏ */}
        <nav className="flex gap-2 overflow-x-auto border-b border-white/5 p-2 lg:hidden">
          {menuItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold no-underline ${
                location.pathname === path ? 'bg-brand/10 text-brand' : 'text-zinc-400'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="cursor-pointer whitespace-nowrap rounded-md border-none bg-transparent px-3 py-1.5 text-xs font-semibold text-red-400"
          >
            Đăng xuất
          </button>
        </nav>

        <main className="flex flex-1 flex-col p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
