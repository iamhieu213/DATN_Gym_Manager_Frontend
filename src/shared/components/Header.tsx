import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Settings, LogOut, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';
import { useLogout } from '../../features/auth/hooks/useLogout';
import { useTheme } from '../context/ThemeContext';

export interface UserProfileHeader {
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface HeaderProps {
  userProfile?: UserProfileHeader | null;
  extraActions?: React.ReactNode;
}

export interface LanguageOption {
  code: 'vi' | 'en' | 'ja';
  label: string;
  countryCode: string; // Mã quốc gia chuẩn ISO (vn, gb, jp) cho flag-icons
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'vi', label: 'Tiếng Việt', countryCode: 'vn' },
  { code: 'en', label: 'English', countryCode: 'gb' },
  { code: 'ja', label: '日本語', countryCode: 'jp' },
];

export default function Header({ userProfile, extraActions }: HeaderProps) {
  const handleLogout = useLogout();
  const { theme, toggleTheme } = useTheme();

  // Ngôn ngữ hiện tại
  const [currentLang, setCurrentLang] = useState<LanguageOption>(() => {
    const saved = localStorage.getItem('app_lang');
    return LANGUAGES.find((l) => l.code === saved) || LANGUAGES[0];
  });

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLang = (lang: LanguageOption) => {
    setCurrentLang(lang);
    localStorage.setItem('app_lang', lang.code);
    setIsLangOpen(false);
  };

  // Hiển thị tên Vai trò tương ứng cho cả 4 role
  const getRoleLabel = (role?: string) => {
    if (!role) return 'Hội viên';
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'STAFF':
        return 'Nhân viên vận hành';
      case 'COACH':
        return 'Huấn luyện viên';
      case 'USER':
      case 'MEMBER':
        return 'Thành viên Pro';
      default:
        return role;
    }
  };

  const rolePath = (() => {
    const r = userProfile?.role?.toUpperCase();
    if (r === 'ADMIN' || r === 'STAFF') return '/admin';
    if (r === 'COACH') return '/coach';
    return '/user';
  })();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/5 bg-zinc-950/80 px-4 md:px-8 backdrop-blur-md box-border">
      {/* Bên trái: Brand Logo (Hiển thị khi mobile) */}
      <div className="flex items-center gap-4">
        <h2 className="m-0 font-sans text-xl font-black uppercase tracking-tighter text-brand lg:hidden">
          Kinetic
        </h2>
      </div>

      {/* Bên phải: Extra Actions, Language Selector, Notification Bell, User Profile */}
      <div className="ml-auto flex items-center gap-3 md:gap-5">
        {extraActions && <div className="hidden sm:flex items-center gap-3">{extraActions}</div>}

        {/* Ô CHỌN NGÔN NGỮ (LANGUAGE SELECTOR WITH FLAG-ICONS) */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
            title="Đổi ngôn ngữ / Select Language"
          >
            <span className={`fi fi-${currentLang.countryCode} fis rounded-sm text-sm`} />
            <span className="hidden sm:inline-block font-semibold">{currentLang.label}</span>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown danh sách ngôn ngữ */}
          {isLangOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded-lg border border-white/10 bg-zinc-900 py-1.5 shadow-2xl backdrop-blur-xl">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Ngôn ngữ / Language
              </div>
              <div className="my-1 h-px bg-white/5" />
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLang(lang)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer border-none ${
                    currentLang.code === lang.code
                      ? 'bg-brand/10 text-brand font-bold'
                      : 'bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`fi fi-${lang.countryCode} fis rounded-sm text-sm shrink-0`} />
                    <span>{lang.label}</span>
                  </span>
                  {currentLang.code === lang.code && <Check size={14} className="text-brand shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NÚT CHUYỂN ĐỔI GIAO DIỆN SÁNG / TỐI (THEME TOGGLE) */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
          title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-amber-400 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon size={17} className="text-amber-500 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* ICON THÔNG BÁO (NOTIFICATION BELL) */}
        <button
          className="relative flex items-center justify-center rounded-lg border-none bg-transparent p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
          title="Thông báo"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand border-2 border-zinc-950" />
        </button>

        {/* THANH NGẮN CÁCH */}
        <div className="h-6 w-px bg-white/10" />

        {/* KHU VỰC THÔNG TIN NGƯỜI DÙNG (USER PROFILE) */}
        <div ref={profileRef} className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="hidden text-right sm:block">
              <p className="m-0 text-xs font-bold text-white transition-colors group-hover:text-brand whitespace-nowrap">
                {userProfile?.name || 'Người dùng'}
              </p>
              <p className="m-0 text-[10px] text-zinc-400 whitespace-nowrap">
                {getRoleLabel(userProfile?.role)}
              </p>
            </div>
            <img
              src={
                userProfile?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
              }
              alt={userProfile?.name || 'User Avatar'}
              className="h-8 w-8 rounded-full border border-white/10 object-cover shrink-0 transition-transform group-hover:scale-105"
            />
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 rounded-lg border border-white/10 bg-zinc-900 py-2 shadow-2xl backdrop-blur-xl">
              <div className="px-4 py-2">
                <p className="m-0 text-sm font-bold text-white truncate">{userProfile?.name || 'Người dùng'}</p>
                {userProfile?.email && <p className="m-0 text-xs text-zinc-400 truncate">{userProfile.email}</p>}
                <span className="mt-1 inline-block rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                  {getRoleLabel(userProfile?.role)}
                </span>
              </div>
              <div className="my-1.5 h-px bg-white/10" />
              <Link
                to={`${rolePath}/profile`}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-300 no-underline transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setIsProfileOpen(false)}
              >
                <User size={15} className="shrink-0 text-zinc-400" />
                <span>Thông tin cá nhân</span>
              </Link>
              <Link
                to={`${rolePath}/settings`}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-300 no-underline transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings size={15} className="shrink-0 text-zinc-400" />
                <span>Cài đặt tài khoản</span>
              </Link>
              <div className="my-1.5 h-px bg-white/10" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-red-400 border-none bg-transparent transition-colors hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut size={15} className="shrink-0 text-red-400" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
