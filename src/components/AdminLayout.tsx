import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getMyProfile, logoutUser } from '../features/auth/services/authApi';
import './AdminLayout.css';
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
    <div className="admin-layout-container">
      {/* SIDEBAR (THANH ĐIỀU HƯỚNG TRÁI) */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Brand Logo Header */}
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="brand-icon">
              <Zap size={16} fill="currentColor" />
            </div>
            {!isCollapsed && (
              <div className="brand-info">
                <Link to="/" className="brand-title">
                  Kinetic Noir
                </Link>
                <span className="brand-subtitle">Command Center</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="toggle-btn"
            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          {sections.map(section => (
            <div key={section} className="nav-section">
              {!isCollapsed ? (
                <div className="nav-section-title">
                  {section}
                </div>
              ) : (
                <div className="nav-divider" />
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
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* User Card Profile */}
        <div className="user-profile-section">
          <div className="user-profile-card">
            <img
              alt={userProfile?.name || "User Avatar"}
              className="user-avatar"
              src={userProfile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100"}
            />
            {!isCollapsed && (
              <div className="user-info">
                <div className="user-name">
                  {userProfile?.name || "Đang tải..."}
                </div>
                <div className="user-role">
                  {userProfile ? getRoleLabel(userProfile.role) : "---"}
                </div>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="logout-btn"
                title="Đăng xuất"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              onClick={handleLogout}
              className="logout-btn-collapsed"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={`main-area ${isCollapsed ? 'expanded' : ''}`}>
        {/* Top Header Bar */}
        <header className="top-header">
          {/* Thanh tìm kiếm */}
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              className="search-input"
              placeholder="Tìm kiếm vận hành, hội viên hoặc giao dịch..."
              type="text"
            />
          </div>

          {/* Công cụ góc phải */}
          <div className="header-tools">
            <div className="system-badge">
              <div className="system-pulse"></div>
              <span className="system-text">Hệ thống tối ưu</span>
            </div>
            <div className="icon-group">
              <button className="icon-btn">
                <Bell className="search-icon" />
                <span className="notification-dot"></span>
              </button>
              <button className="icon-btn">
                <Settings className="search-icon" />
              </button>
            </div>
            <div className="divider-vertical"></div>
            <button className="btn-create">
              Tạo Bản Ghi
            </button>
          </div>
        </header>

        {/* Nội dung trang con sẽ được render ở đây */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fab-btn">
        <Plus size={24} />
      </button>
    </div>
  );
}

export default AdminLayout;
