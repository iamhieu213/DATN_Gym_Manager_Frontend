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
import { Link } from 'react-router-dom'

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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#c3f400]"></div>
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
    <div className="p-8 w-full space-y-8 flex-1">
      {/* Dashboard Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Tổng Quan Hệ Thống</h1>
          <p className="text-[#71717a] text-sm mt-1">Báo cáo phân tích hiệu suất hoạt động thời gian thực của Kinetic Noir.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/3 border border-white/5 rounded-lg text-xs font-bold text-white flex items-center gap-2 hover:bg-white/5 cursor-pointer">
            <Calendar size={14} /> 30 ngày qua
          </button>
          <button className="px-4 py-2 bg-white/3 border border-white/5 rounded-lg text-xs font-bold text-white flex items-center gap-2 hover:bg-white/5 cursor-pointer">
            <Download size={14} /> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* 4. METRIC GRID (Ẩn các ô tài chính nếu người đăng nhập là STAFF) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ô 1: Luôn hiện số Hội viên */}
        <div className="bg-white/1.5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Hội viên hoạt động</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-white tracking-tighter">{metrics.activeMembers.toLocaleString('vi-VN')}</span>
            <span className="text-xs font-bold text-[#c3f400]">
              {metrics.activeMembersGrowth >= 0 ? `+${metrics.activeMembersGrowth}%` : `${metrics.activeMembersGrowth}%`}
            </span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#c3f400] h-full w-[75%]"></div>
          </div>
        </div>

        {/* Ô 2: Chỉ hiện Doanh Thu nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="bg-white/1.5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Doanh thu tháng</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-white tracking-tighter">{(metrics.monthlyRevenue / 1000000).toFixed(1)}M</span>
              <span className="text-xs font-bold text-[#c3f400]">
                {metrics.monthlyRevenueGrowth >= 0 ? `+${metrics.monthlyRevenueGrowth}%` : `${metrics.monthlyRevenueGrowth}%`}
              </span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#c3f400] h-full w-[62%]"></div>
            </div>
          </div>
        )}

        {/* Ô 3: Chỉ hiện Tỉ lệ giữ chân nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="bg-white/1.5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Tỉ lệ giữ chân</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-white tracking-tighter">{metrics.retentionRate}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#c3f400] h-full w-[94.8%]"></div>
            </div>
          </div>
        )}

        {/* Ô 4: Chỉ hiện Tỉ lệ hủy nếu là ADMIN */}
        {userRole === 'ADMIN' && (
          <div className="bg-white/1.5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Tỉ lệ hủy gói</span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-bold text-white">{metrics.churnRate}%</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
              <div className="bg-white/20 h-full w-[12%]"></div>
            </div>
          </div>
        )}
      </div>

      {/* 5. BIỂU ĐỒ VÀ PHÂN TÍCH (Ẩn hoàn toàn đối với STAFF) */}
      {userRole === 'ADMIN' && revenueChart && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/1.5 border border-white/5 rounded-xl p-6 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">Tăng trưởng doanh thu</h3>
                <p className="text-xs text-[#71717a]">Hiệu suất doanh thu của phòng tập dựa trên bộ lọc</p>
              </div>
              <div className="flex gap-1 p-1 bg-white/5 rounded-md">
                <button
                  type="button"
                  onClick={() => setTimeRange('W')}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${timeRange === 'W' ? 'bg-white/10 text-white' : 'text-[#71717a] hover:text-white'}`}
                >
                  Tuần
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('M')}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${timeRange === 'M' ? 'bg-white/10 text-white' : 'text-[#71717a] hover:text-white'}`}
                >
                  Tháng
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('Y')}
                  className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${timeRange === 'Y' ? 'bg-white/10 text-white' : 'text-[#71717a] hover:text-white'}`}
                >
                  Năm
                </button>
              </div>
            </div>

            {/* Render Biểu đồ cột động */}
            <div className="space-y-2">
              <div className="h-64 w-full relative flex items-end gap-2 overflow-visible border-b border-white/5 pb-2">
                {revenueChart.map((item: any, index: number) => {
                  const maxValue = Math.max(...revenueChart.map((d: any) => d.value), 1);
                  const percentHeight = Math.max(8, (item.value / maxValue) * 90);
                  const isLatest = index === revenueChart.length - 1;

                  return (
                    <div
                      key={index}
                      style={{ height: `${percentHeight}%` }}
                      className={`flex-1 rounded-t-sm transition-all cursor-pointer group relative ${
                        isLatest 
                          ? 'bg-[#c3f400]/40 hover:bg-[#c3f400]' 
                          : 'bg-white/5 hover:bg-[#c3f400]/20'
                      }`}
                    >
                      {/* Tooltip hiển thị tiền thật khi di chuột */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/95 border border-white/10 px-2 py-1 rounded text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                        {item.value.toLocaleString('vi-VN')}đ
                      </div>

                      {isLatest && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#c3f400] animate-pulse">
                          LIVE
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dòng nhãn ngày/tháng/năm dưới chân biểu đồ */}
              <div className="flex justify-between text-[10px] font-mono text-[#71717a] pt-1 px-1">
                {revenueChart.map((item: any, index: number) => (
                  <span key={index} className="flex-1 text-center truncate px-0.5">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Các chỉ số phụ MRR, ARPU, LTV */}
            <div className="grid grid-cols-3 gap-8 pt-4">
              <div>
                <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mb-1">MRR (Doanh thu trung bình tháng)</div>
                <div className="text-xl font-bold text-white">{(metrics.mrr / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mb-1">ARPU (Doanh thu / Hội viên)</div>
                <div className="text-xl font-bold text-white">{(metrics.arpu / 1000).toFixed(0)}k</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mb-1">LTV (Giá trị vòng đời)</div>
                <div className="text-xl font-bold text-white">{(metrics.ltv / 1000000).toFixed(1)}M</div>
              </div>
            </div>
          </div>

          {/* Nhật ký hoạt động */}
          <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6">Nhật ký hệ thống</h3>
            <div className="space-y-6 flex-1">
              {logs.map((log: any) => (
                <div key={log.id} className="flex gap-4">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    log.type === 'alert' ? 'bg-red-500/10 text-red-500' : 'bg-[#c3f400]/10 text-[#c3f400]'
                  }`}>
                    <LogIcon type={log.type} />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${log.type === 'alert' ? 'text-red-500' : 'text-white'}`}>
                      {log.title}
                    </div>
                    <div className="text-xs text-[#71717a] mt-0.5">{log.subtitle}</div>
                    <div className="text-[10px] text-[#71717a]/60 font-mono mt-1 uppercase">{log.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-8 text-center text-xs font-bold text-[#71717a] hover:text-[#c3f400] transition-colors"
            >
              Xem toàn bộ báo cáo hoạt động
            </button>
          </div>
        </div>
      )}

      {/* 6. BẢNG GIAO DỊCH VÀ DANH SÁCH HLV (Hiển thị cho cả ADMIN & STAFF) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bảng Giao dịch gần đây */}
        <div className="lg:col-span-8 bg-white/1.5 border border-white/5 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Giao dịch gần đây</h3>
            <Link to='/dashboard/payments' className="text-xs font-bold text-[#c3f400] hover:underline"  >Xem tất cả</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest border-b border-white/5 bg-white/2">
                  <th className="px-6 py-4">Mã Giao Dịch</th>
                  <th className="px-6 py-4">Hội Viên</th>
                  {userRole === 'ADMIN' && <th className="px-6 py-4">Số Tiền</th>}
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4">Ngày Thực Hiện</th>
                  <th className="px-6 py-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {recentTransactions.map((t: any) => (
                  <tr key={t.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[#c3f400]">{t.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{t.member}</td>
                    {userRole === 'ADMIN' && <td className="px-6 py-4 text-white">{t.amount}</td>}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        t.status === 'paid' ? 'bg-[#c3f400]/20 text-[#c3f400]' :
                        t.status === 'pending' ? 'bg-white/10 text-[#71717a]' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {t.status === 'paid' && 'Đã thanh toán'}
                        {t.status === 'pending' && 'Đang xử lý'}
                        {t.status === 'failed' && 'Thất bại'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#71717a] text-xs">
                      {new Date(t.date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-[#71717a] hover:text-white cursor-pointer">
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
        <div className="lg:col-span-4 bg-white/1.5 border border-white/5 rounded-xl flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Hiệu suất Huấn luyện viên</h3>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {trainers.map((trainer: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                {trainer.image && (
                  <img
                    alt={trainer.name}
                    className="w-10 h-10 rounded-lg object-cover grayscale border border-white/10"
                    src={trainer.image}
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">{trainer.name}</span>
                    <span className="text-[9px] font-mono font-bold text-[#c3f400] uppercase tracking-widest">{trainer.role}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-[#71717a]">{trainer.activeSlots}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient Glows */}
      <div className="fixed top-0 right-0 w-150 h-150 bg-[#c3f400]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-64 w-100 h-100 bg-[#c3f400]/3 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </div>
  );
}

export default DashboardPage;