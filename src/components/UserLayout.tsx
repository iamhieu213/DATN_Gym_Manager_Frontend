import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UserLayout.css';
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  Users,
  Settings,
  ClipboardList,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  QrCode,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Hàm xác định xem Link có đang được active hay không
  const isActive = (path: string) => location.pathname === path;

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
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        Swal.fire({
          title: 'Đã đăng xuất!',
          text: 'Bạn đã đăng xuất thành công.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#09090b',
          color: '#fafafa',
        }).then(() => {
          navigate('/login');
        });
      }
    });
  };

  return (
    <div className="user-layout-container">
      {/* 1. SIDEBAR (Dành cho Desktop màn hình lớn) */}
      <aside className={`user-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="brand-logo">
              <div className="brand-icon">
                <Dumbbell size={16} fill="currentColor" />
              </div>
              <div className="brand-info">
                <span className="brand-title">KINETIC</span>
                <span className="brand-subtitle">Thành viên Elite</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="toggle-btn"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {!isCollapsed ? (
              <div className="nav-section-title">Hội viên</div>
            ) : (
              <div className="nav-divider" />
            )}
            <Link
              to="/user"
              className={`nav-link ${isActive('/user') ? 'active' : ''}`}
              title={isCollapsed ? "Bảng Điều Khiển" : undefined}
            >
              <LayoutDashboard size={18} className="shrink-0" />
              {!isCollapsed && <span className="nav-label">Bảng Điều Khiển</span>}
            </Link>
            <Link
              to="/user/workouts"
              className={`nav-link ${isActive('/user/workouts') ? 'active' : ''}`}
              title={isCollapsed ? "Bài Tập Của Tôi" : undefined}
            >
              <Dumbbell size={18} className="shrink-0" />
              {!isCollapsed && <span className="nav-label">Bài Tập Của Tôi</span>}
            </Link>
            <Link
              to="/user/schedule"
              className={`nav-link ${isActive('/user/schedule') ? 'active' : ''}`}
              title={isCollapsed ? "Lịch Học" : undefined}
            >
              <Calendar size={18} className="shrink-0" />
              {!isCollapsed && <span className="nav-label">Lịch Học</span>}
            </Link>
            <Link
              to="/user/coaches"
              className={`nav-link ${isActive('/user/coaches') ? 'active' : ''}`}
              title={isCollapsed ? "Huấn Luyện Viên" : undefined}
            >
              <Users size={18} className="shrink-0" />
              {!isCollapsed && <span className="nav-label">Huấn Luyện Viên</span>}
            </Link>
            <Link
              to="/user/metrics"
              className={`nav-link ${isActive('/user/metrics') ? 'active' : ''}`}
              title={isCollapsed ? "Thiết Bị" : undefined}
            >
              <Settings size={18} className="shrink-0" />
              {!isCollapsed && <span className="nav-label">Thiết Bị</span>}
            </Link>
            <Link
              to="/user/plans"
              className={`nav-link ${isActive('/user/plans') ? 'active' : ''}`}
              title={isCollapsed ? "Kế Hoạch" : undefined}
            >
              <ClipboardList size={18} className="shrink-0" />
              {!isCollapsed && <span className="nav-label">Kế Hoạch</span>}
            </Link>
          </div>
        </nav>

        <div className="user-profile-section">
          <Link
            to="/user/help"
            className="nav-link"
            title={isCollapsed ? "Hỗ Trợ" : undefined}
          >
            <HelpCircle size={18} className="shrink-0" />
            {!isCollapsed && <span className="nav-label">Hỗ Trợ</span>}
          </Link>
          <button
            className="nav-link logout-btn"
            onClick={handleLogout}
            title={isCollapsed ? "Đăng Xuất" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="nav-label">Đăng Xuất</span>}
          </button>
        </div>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH */}
      <div className={`main-area ${isCollapsed ? 'expanded' : ''}`}>
        {/* Top App Bar */}
        <header className="top-header">
          <div className="header-left">
            <h2 className="mobile-brand-title">Kinetic</h2>
            <nav className="header-tabs">
              <Link to="/user" className="tab-item active">Tổng Quan</Link>
              <Link to="/user/history" className="tab-item">Lịch Sử Tập</Link>
            </nav>
          </div>

          <div className="header-tools">
            {/* Thanh tìm kiếm */}
            <div className="search-bar">
              <Search className="search-icon" size={16} />
              <input
                className="search-input"
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="icon-group">
              <button className="icon-btn">
                <Bell size={18} />
              </button>
            </div>
            
            <div className="divider-vertical"></div>

            {/* Avatar & Profile */}
            <div className="header-profile">
              <div className="profile-info">
                <p className="profile-name">Alex Rivera</p>
                <p className="profile-role">Thành Viên Pro</p>
              </div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxO4OlAjvwl5qEztoohbhVpG-tUQ-GjTMUUHxcmQ_wfYdM1f0vVhJrK38vDfnkhvPFXW_qzibllVHSWalEimchiYwyf2P1rCXuGsJXIgrNMieZJ_Vz_e0O50zreKchj5mP9rH3IgBnb789T1MkzF3XTFH0ZN-t2bY-NE6VCGekU7g1YB2MpAhf_osuxkO6TsmA6c3GI1KOfeNDQn8bSD2YKOPeOs46R4gUQyVPalAZSsnTVLOTsTOWoUFjw3o_5XyyQt3uC8ibOnk"
                alt="Alex Rivera"
                className="profile-avatar"
              />
            </div>
          </div>
        </header>

        {/* Nội dung trang con */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION (Hiện trên màn hình nhỏ) */}
      <nav className="mobile-bottom-nav">
        <Link to="/user" className={`mobile-nav-btn ${isActive('/user') ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span className="mobile-btn-text">Tổng Quan</span>
        </Link>
        <Link to="/user/workouts" className="mobile-nav-btn">
          <Dumbbell size={20} />
          <span className="mobile-btn-text">Bài Tập</span>
        </Link>
        <button className="mobile-nav-btn btn-qr-checkin">
          <div className="qr-scanner-circle">
            <QrCode size={20} />
          </div>
          <span className="mobile-btn-text">Check-in</span>
        </button>
        <Link to="/user/schedule" className="mobile-nav-btn">
          <Calendar size={20} />
          <span className="mobile-btn-text">Lịch</span>
        </Link>
        <Link to="/user/profile" className="mobile-nav-btn">
          <User size={20} />
          <span className="mobile-btn-text">Hồ Sơ</span>
        </Link>
      </nav>
    </div>
  );
}