import { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  UserPlus,
  DollarSign,
  CalendarDays,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';
import { getDashboardStats } from '../../features/dashboard/services/dashboardApi';
import { decodeJwt } from '../../routes/ProtectedRoute';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css';

function DashboardPage() {
  const [timeRange, setTimeRange] = useState('M'); // W, M, Y
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('STAFF'); // Mặc định STAFF để bảo mật

  // 1. Đọc vai trò người dùng từ JWT Token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const payload = decodeJwt(token);
      if (payload && payload.role) {
        setUserRole(payload.role);
      }
    }
  }, []);

  // 2. Gọi API bất cứ khi nào timeRange thay đổi
  useEffect(() => {
    setLoading(true);
    getDashboardStats(timeRange)
      .then((res: any) => {
        if (res.success) {
          setDashboardData(res.data);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Lỗi khi tải dữ liệu dashboard:", err);
        setLoading(false);
      });
  }, [timeRange]);

  // 3. Nếu đang tải dữ liệu, hiển thị màn hình Loading / Skeleton
  if (loading || !dashboardData) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff', backgroundColor: '#000' }}>
        <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '32px', width: '32px', borderTop: '2px solid #c3f400', borderRight: '2px solid transparent' }}></div>
        <span style={{ marginLeft: '12px', fontSize: '0.875rem', fontWeight: 500 }}>Đang tải dữ liệu báo cáo...</span>
      </div>
    );
  }

  // Phân rã dữ liệu từ API để đưa vào giao diện
  const { metrics, revenueChart, logs, recentTransactions, trainers } = dashboardData;

  const LogIcon = ({ type }: { type: 'signup' | 'payment' | 'booking' | 'alert' }) => {
    switch (type) {
      case 'signup':
        return <UserPlus size={16} />;
      case 'payment':
        return <DollarSign size={16} />;
      case 'booking':
        return <CalendarDays size={16} />;
      case 'alert':
        return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tổng Quan Hệ Thống</h1>
          <p className="dashboard-subtitle">Báo cáo phân tích hiệu suất hoạt động thời gian thực của Kinetic Noir.</p>
        </div>
        <div className="header-buttons">
          <button className="btn-header">
            <Calendar size={14} /> 30 ngày qua
          </button>
          <button className="btn-header">
            <Download size={14} /> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* 4. METRIC GRID (Ẩn các ô tài chính nếu người đăng nhập là STAFF) */}
      <div className="metric-grid">
        {/* Ô 1: Luôn hiện số Hội viên */}
        <div className="metric-card">
          <span className="metric-label">Hội viên hoạt động</span>
          <div className="metric-val-row">
            <span className="metric-val">{metrics.activeMembers.toLocaleString('vi-VN')}</span>
            <span className="metric-growth">
              {metrics.activeMembersGrowth >= 0 ? `+${metrics.activeMembersGrowth}%` : `${metrics.activeMembersGrowth}%`}
            </span>
          </div>
          <div className="metric-progress-bar">
            <div className="metric-progress" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Ô 2: Chỉ hiện Doanh Thu nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="metric-card">
            <span className="metric-label">Doanh thu tháng</span>
            <div className="metric-val-row">
              <span className="metric-val">{(metrics.monthlyRevenue / 1000000).toFixed(1)}M</span>
              <span className="metric-growth">
                {metrics.monthlyRevenueGrowth >= 0 ? `+${metrics.monthlyRevenueGrowth}%` : `${metrics.monthlyRevenueGrowth}%`}
              </span>
            </div>
            <div className="metric-progress-bar">
              <div className="metric-progress" style={{ width: '62%' }}></div>
            </div>
          </div>
        )}

        {/* Ô 3: Chỉ hiện Tỉ lệ giữ chân nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="metric-card">
            <span className="metric-label">Tỉ lệ giữ chân</span>
            <div className="metric-val-row">
              <span className="metric-val">{metrics.retentionRate}%</span>
            </div>
            <div className="metric-progress-bar">
              <div className="metric-progress" style={{ width: '94.8%' }}></div>
            </div>
          </div>
        )}

        {/* Ô 4: Chỉ hiện Tỉ lệ hủy nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="metric-card">
            <span className="metric-label">Tỉ lệ hủy gói</span>
            <div className="metric-val-row">
              <span className="metric-val">{metrics.churnRate}%</span>
            </div>
            <div className="metric-progress-bar">
              <div className="metric-progress" style={{ width: '12%' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* 5. BIỂU ĐỒ VÀ PHÂN TÍCH (Ẩn hoàn toàn đối với STAFF) */}
      {userRole === 'ADMIN' && revenueChart && (
        <div className="dashboard-grid">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Tăng trưởng doanh thu</h3>
                <p className="chart-subtitle">Hiệu suất doanh thu của phòng tập dựa trên bộ lọc</p>
              </div>
              <div className="time-selector">
                <button
                  type="button"
                  onClick={() => setTimeRange('W')}
                  className={`btn-time ${timeRange === 'W' ? 'active' : ''}`}
                >
                  Tuần
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('M')}
                  className={`btn-time ${timeRange === 'M' ? 'active' : ''}`}
                >
                  Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('Y')}
                  className={`btn-time ${timeRange === 'Y' ? 'active' : ''}`}
                >
                  Năm
                </button>
              </div>
            </div>

            {/* Render Biểu đồ cột động */}
            <div className="chart-area">
              <div className="chart-bars-container">
                {revenueChart.map((item: any, index: number) => {
                  const maxValue = Math.max(...revenueChart.map((d: any) => d.value), 1);
                  const percentHeight = Math.max(8, (item.value / maxValue) * 90);
                  const isLatest = index === revenueChart.length - 1;

                  return (
                    <div
                      key={index}
                      style={{ height: `${percentHeight}%` }}
                      className={`chart-bar ${isLatest ? 'latest' : ''}`}
                    >
                      {/* Tooltip hiển thị tiền thật khi di chuột */}
                      <div className="chart-tooltip">
                        {item.value.toLocaleString('vi-VN')}đ
                      </div>

                      {isLatest && (
                        <div className="chart-live">
                          LIVE
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dòng nhãn ngày/tháng/năm dưới chân biểu đồ */}
              <div className="chart-x-labels">
                {revenueChart.map((item: any, index: number) => (
                  <span key={index} className="chart-x-label">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Các chỉ số phụ MRR, ARPU, LTV */}
            <div className="chart-stats">
              <div>
                <div className="stat-item-label">MRR (Doanh thu trung bình tháng)</div>
                <div className="stat-item-val">{(metrics.mrr / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="stat-item-label">ARPU (Doanh thu / Hội viên)</div>
                <div className="stat-item-val">{(metrics.arpu / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="stat-item-label">LTV (Giá trị vòng đời)</div>
                <div className="stat-item-val">{(metrics.ltv / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </div>

          {/* Nhật ký hoạt động */}
          <div className="logs-card">
            <h3 className="logs-title">Nhật ký hệ thống</h3>
            <div className="logs-list">
              {logs.map((log: any) => (
                <div key={log.id} className="log-item">
                  <div className={`log-icon-box ${log.type === 'alert' ? 'type-alert' : 'type-normal'}`}>
                    <LogIcon type={log.type} />
                  </div>
                  <div>
                    <div className={`log-item-title ${log.type === 'alert' ? 'alert' : ''}`}>
                      {log.title}
                    </div>
                    <div className="log-item-subtitle">{log.subtitle}</div>
                    <div className="log-item-time">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn-view-logs"
            >
              Xem toàn bộ báo cáo hoạt động
            </button>
          </div>
        </div>
      )}

      {/* 6. BẢNG GIAO DỊCH VÀ DANH SÁCH HLV (Hiển thị cho cả ADMIN & STAFF) */}
      <div className="bottom-grid">
        {/* Bảng Giao dịch gần đây */}
        <div className="transactions-card">
          <div className="card-header-flex">
            <h3 className="card-title">Giao dịch gần đây</h3>
            <Link to="/dashboard/payments" className="card-header-link">Xem tất cả</Link>
          </div>
          <div className="table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-cell">Mã Giao Dịch</th>
                  <th className="table-cell">Hội Viên</th>
                  {userRole === 'ADMIN' && <th className="table-cell">Số Tiền</th>}
                  <th className="table-cell">Trạng Thái</th>
                  <th className="table-cell">Ngày Thực Hiện</th>
                  <th className="table-cell" style={{ textAlign: 'right' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {recentTransactions.map((t: any) => (
                  <tr key={t.id} className="table-row">
                    <td className="table-cell font-mono id-color">{t.id}</td>
                    <td className="table-cell font-medium white-text">{t.member}</td>
                    {userRole === 'ADMIN' && <td className="table-cell white-text">{t.amount}</td>}
                    <td className="table-cell">
                      <span className={`status-badge ${
                        t.status === 'paid' ? 'status-paid' :
                        t.status === 'pending' ? 'status-pending' :
                        'status-failed'
                      }`}>
                        {t.status === 'paid' && 'Đã thanh toán'}
                        {t.status === 'pending' && 'Đang xử lý'}
                        {t.status === 'failed' && 'Thất bại'}
                      </span>
                    </td>
                    <td className="table-cell date-text">
                      {new Date(t.date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="table-cell action-trigger">
                      <div className="flex-justify-end">
                        <MoreHorizontal size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hiệu suất HLV (Không có đánh giá sao) */}
        <div className="trainers-performance-card">
          <div className="card-header">
            <h3 className="card-title">Hiệu suất Huấn luyện viên</h3>
          </div>
          <div className="trainers-list">
            {trainers.map((trainer: any, index: number) => (
              <div key={index} className="trainer-item">
                {trainer.image && (
                  <img
                    alt={trainer.name}
                    className="trainer-avatar"
                    src={trainer.image}
                  />
                )}
                <div className="trainer-info">
                  <div className="trainer-info-header">
                    <span className="trainer-name">{trainer.name}</span>
                    <span className="trainer-role">{trainer.role}</span>
                  </div>
                  <div className="trainer-slots-row">
                    <div className="trainer-slots">{trainer.activeSlots}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient Glows */}
      <div className="glow-top"></div>
      <div className="glow-bottom"></div>
    </div>
  );
}

export default DashboardPage;