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
import { getDashboardStats } from '../services/dashboardApi';
import { decodeJwt } from '../../../routes/ProtectedRoute';
import { Link } from 'react-router-dom';

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
      <div className="flex h-screen w-full items-center justify-center text-white bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-t-brand border-r-2 border-r-transparent"></div>
        <span className="ml-3 text-sm font-medium">Đang tải dữ liệu báo cáo...</span>
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
    <div className="p-8 w-full flex flex-col gap-8 flex-1 box-border">
      {/* Dashboard Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">Tổng Quan Hệ Thống</h1>
          <p className="text-zinc-500 text-sm mt-1 mb-0">Báo cáo phân tích hiệu suất hoạt động thời gian thực của Kinetic Noir.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-white/5">
            <Calendar size={14} /> 30 ngày qua
          </button>
          <button className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-lg text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-white/5">
            <Download size={14} /> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* 4. METRIC GRID (Ẩn các ô tài chính nếu người đăng nhập là STAFF) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Ô 1: Luôn hiện số Hội viên */}
        <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.1em]">Hội viên hoạt động</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-white tracking-[-0.05em]">{metrics.activeMembers.toLocaleString('vi-VN')}</span>
            <span className="text-xs font-bold text-brand">
              {metrics.activeMembersGrowth >= 0 ? `+${metrics.activeMembersGrowth}%` : `${metrics.activeMembersGrowth}%`}
            </span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-brand h-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Ô 2: Chỉ hiện Doanh Thu nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.1em]">Doanh thu tháng</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-white tracking-[-0.05em]">{(metrics.monthlyRevenue / 1000000).toFixed(1)}M</span>
              <span className="text-xs font-bold text-brand">
                {metrics.monthlyRevenueGrowth >= 0 ? `+${metrics.monthlyRevenueGrowth}%` : `${metrics.monthlyRevenueGrowth}%`}
              </span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-brand h-full" style={{ width: '62%' }}></div>
            </div>
          </div>
        )}

        {/* Ô 3: Chỉ hiện Tỉ lệ giữ chân nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.1em]">Tỉ lệ giữ chân</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-white tracking-[-0.05em]">{metrics.retentionRate}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-brand h-full" style={{ width: '94.8%' }}></div>
            </div>
          </div>
        )}

        {/* Ô 4: Chỉ hiện Tỉ lệ hủy nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.1em]">Tỉ lệ hủy gói</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-white tracking-[-0.05em]">{metrics.churnRate}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-brand h-full" style={{ width: '12%' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* 5. BIỂU ĐỒ VÀ PHÂN TÍCH (Ẩn hoàn toàn đối với STAFF) */}
      {userRole === 'ADMIN' && revenueChart && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="bg-white/[0.015] border border-white/5 rounded-xl p-6 flex flex-col gap-8 lg:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white m-0">Tăng trưởng doanh thu</h3>
                <p className="text-xs text-zinc-500 mt-0.5 mb-0">Hiệu suất doanh thu của phòng tập dựa trên bộ lọc</p>
              </div>
              <div className="flex gap-1 p-1 bg-white/5 rounded-md">
                <button
                  type="button"
                  onClick={() => setTimeRange('W')}
                  className={`bg-transparent border-none px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-all duration-200 ${timeRange === 'W' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Tuần
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('M')}
                  className={`bg-transparent border-none px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-all duration-200 ${timeRange === 'M' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('Y')}
                  className={`bg-transparent border-none px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-all duration-200 ${timeRange === 'Y' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
                >
                  Năm
                </button>
              </div>
            </div>

            {/* Render Biểu đồ cột động */}
            <div className="flex flex-col gap-2">
              <div className="h-64 w-full relative flex items-end gap-2 border-b border-white/5 pb-2 box-border">
                {revenueChart.map((item: any, index: number) => {
                  const maxValue = Math.max(...revenueChart.map((d: any) => d.value), 1);
                  const percentHeight = Math.max(8, (item.value / maxValue) * 90);
                  const isLatest = index === revenueChart.length - 1;

                  return (
                    <div
                      key={index}
                      style={{ height: `${percentHeight}%` }}
                      className={`group flex-1 rounded-t-sm cursor-pointer relative transition-all duration-200 ${isLatest ? 'bg-brand/40 hover:bg-brand' : 'bg-white/5 hover:bg-brand/20'}`}
                    >
                      {/* Tooltip hiển thị tiền thật khi di chuột */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/95 border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-white opacity-0 pointer-events-none z-10 transition-opacity duration-200 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] whitespace-nowrap group-hover:opacity-100">
                        {item.value.toLocaleString('vi-VN')}đ
                      </div>

                      {isLatest && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-brand animate-pulse pointer-events-none">
                          LIVE
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dòng nhãn ngày/tháng/năm dưới chân biểu đồ */}
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1 px-1">
                {revenueChart.map((item: any, index: number) => (
                  <span key={index} className="flex-1 text-center overflow-hidden text-ellipsis whitespace-nowrap px-0.5">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Các chỉ số phụ MRR, ARPU, LTV */}
            <div className="grid grid-cols-3 gap-8 pt-4">
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] mb-1">MRR (Doanh thu trung bình tháng)</div>
                <div className="text-xl font-bold text-white">{(metrics.mrr / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] mb-1">ARPU (Doanh thu / Hội viên)</div>
                <div className="text-xl font-bold text-white">{(metrics.arpu / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] mb-1">LTV (Giá trị vòng đời)</div>
                <div className="text-xl font-bold text-white">{(metrics.ltv / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </div>

          {/* Nhật ký hoạt động */}
          <div className="bg-white/[0.015] border border-white/5 rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mt-0 mb-6">Nhật ký hệ thống</h3>
            <div className="flex flex-col gap-6 flex-1">
              {logs.map((log: any) => (
                <div key={log.id} className="flex gap-4">
                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${log.type === 'alert' ? 'bg-red-500/10 text-red-500' : 'bg-brand/10 text-brand'}`}>
                    <LogIcon type={log.type} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${log.type === 'alert' ? 'text-red-500' : 'text-white'}`}>
                      {log.title}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{log.subtitle}</div>
                    <div className="text-[10px] text-zinc-500/60 font-mono mt-1 uppercase">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="bg-transparent border-none mt-8 text-center text-xs font-bold text-zinc-500 cursor-pointer transition-colors duration-200 hover:text-brand"
            >
              Xem toàn bộ báo cáo hoạt động
            </button>
          </div>
        </div>
      )}

      {/* 6. BẢNG GIAO DỊCH VÀ DANH SÁCH HLV (Hiển thị cho cả ADMIN & STAFF) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Bảng Giao dịch gần đây */}
        <div className="bg-white/[0.015] border border-white/5 rounded-xl overflow-hidden lg:col-span-8">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white m-0">Giao dịch gần đây</h3>
            <Link to="/admin/payments" className="text-xs font-bold text-brand no-underline hover:underline">Xem tất cả</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4">Mã Giao Dịch</th>
                  <th className="px-6 py-4">Hội Viên</th>
                  {userRole === 'ADMIN' && <th className="px-6 py-4">Số Tiền</th>}
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4">Ngày Thực Hiện</th>
                  <th className="px-6 py-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t: any) => (
                  <tr key={t.id} className="border-b border-white/5 last:border-b-0 transition-colors duration-200 hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-mono text-xs text-brand">{t.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{t.member}</td>
                    {userRole === 'ADMIN' && <td className="px-6 py-4 text-white">{t.amount}</td>}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-[0.05em] ${
                        t.status === 'paid' ? 'bg-brand/20 text-brand' :
                        t.status === 'pending' ? 'bg-white/10 text-zinc-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {t.status === 'paid' && 'Đã thanh toán'}
                        {t.status === 'pending' && 'Đang xử lý'}
                        {t.status === 'failed' && 'Thất bại'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {new Date(t.date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 cursor-pointer transition-colors duration-200 hover:text-white">
                      <div className="flex justify-end">
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
        <div className="bg-white/[0.015] border border-white/5 rounded-xl flex flex-col lg:col-span-4">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white m-0">Hiệu suất Huấn luyện viên</h3>
          </div>
          <div className="p-6 flex flex-col gap-6 flex-1">
            {trainers.map((trainer: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                {trainer.image && (
                  <img
                    alt={trainer.name}
                    className="w-10 h-10 rounded-lg object-cover grayscale border border-white/10 shrink-0"
                    src={trainer.image}
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">{trainer.name}</span>
                    <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-[0.05em]">{trainer.role}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-zinc-500">{trainer.activeSlots}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient Glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-brand/[0.03] rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
}

export default DashboardPage;
