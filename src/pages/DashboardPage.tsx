import { useState } from 'react';
import {
  Calendar,
  Download,
  UserPlus,
  DollarSign,
  CalendarDays,
  AlertTriangle,
  Star,
  MoreHorizontal
} from 'lucide-react';

type Transaction = {
  id: string;
  member: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
};

type SystemLog = {
  id: string;
  type: 'signup' | 'payment' | 'booking' | 'alert';
  title: string;
  subtitle: string;
  time: string;
};

type Trainer = {
  name: string;
  role: string;
  activeSlots: string;
  rating: number;
  image: string;
};

function DashboardPage() {
  const [timeRange, setTimeRange] = useState('M'); // W, M, Y

  const transactions: Transaction[] = [
    { id: 'KN-82914', member: 'David Chen', amount: '420.000đ', status: 'paid', date: '24 Th10, 2026' },
    { id: 'KN-82915', member: 'Lisa Sterling', amount: '1.250.000đ', status: 'pending', date: '24 Th10, 2026' },
    { id: 'KN-82916', member: 'James Wilson', amount: '350.000đ', status: 'paid', date: '23 Th10, 2026' },
    { id: 'KN-82917', member: 'Marcus Reed', amount: '95.000đ', status: 'failed', date: '23 Th10, 2026' },
  ];

  const logs: SystemLog[] = [
    { id: '1', type: 'signup', title: 'Hội viên đăng ký mới', subtitle: 'Sarah Jenkins — Gói Bạch Kim', time: '2 phút trước' },
    { id: '2', type: 'payment', title: 'Đã nhận thanh toán', subtitle: 'Mã giao dịch #4829 — 4.200.000đ', time: '14 phút trước' },
    { id: '3', type: 'booking', title: 'Lịch hẹn được đặt', subtitle: 'Chuyên gia HIIT — HLV Elena Voss', time: '42 phút trước' },
    { id: '4', type: 'alert', title: 'Cảnh báo hệ thống', subtitle: 'Máy chạy bộ số #04 — Lỗi trượt băng tải', time: '1 giờ trước' },
  ];

  const trainers: Trainer[] = [
    { name: 'Alex Rivera', role: 'HLV Trưởng (MASTER)', activeSlots: '3/4 Lớp hoạt động', rating: 4, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBicJHCpHQa5ucE2_XO0p3xE4X6CpcRyx7RbLZu8LVZCdhGkywOP02qGL03HGOMstn4WNxmPciTmVQzyXFMSfZGabBQxco0CvCVenakiM20O9cvSWsErp4ICPnmNsXn154URmZoJakpds4P9nzWJ27Hcl0NddQ6HKvIYzuid-W0m4Du0tIWy69SUKUu9v8H-1rC0TZqg2z4o8jbC-S6zfrqxsoo6jIpRrCqruZOHPUPMPpExushvk6QyQqJp1N2CrMBUUn5m-J59pI' },
    { name: 'Elena Voss', role: 'HLV HIIT', activeSlots: '5/6 Lớp hoạt động', rating: 5, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwyaj9FTdE6qJmILiNo693pqS4dpLzywz-wkq7qfsYJvTKbbuSiejUcR_pVBL0duSbeyUJiI14258QewPs0FOINmN88-oyE5YQMZ9G6DTbC0x7zveXU692heiakHRRtvHEqYZWhcmv6Bv6KwIyuBfOEM44ULJzVhbi3TQ23uZSVWPxtsc5raOAg1fm9RHYYtnDuiiVgFFLzi96oqLVPr-sz2pzIEjv2Yr-MieSOFSULlgPl5t-nzWdDfEX-O_BKzr6ODRl_2omYpM' },
    { name: 'Jaxson Pierce', role: 'HLV Thể lực (STRENGTH)', activeSlots: '4/4 Lớp hoạt động', rating: 4, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0UlIp7obUPQ0lHaM9GFwRkDHWRiBWo6JBO1XjRHrD8lpAdCtdjs63_St3zsEu3X3LdXWSuJmaHdxZTtVtbByAZBAnvtA366-3XHn583ICurigW07GLXps-Cg2uWkgJJsLpOgYWUwHPDA3QAAINxp8VJkyQYaXWXNNaYukBfd8MgU_h5CkEhJ0RkTGwa3ofxCBZWl4hrlKxfpJsZ8ahi9UxKX3pBmcdPN2pAgafJSrp6l9DKzLpDjZhGAfdqVJ9HKMJRgROz8uuNw' },
  ];

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

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/1.5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Hội viên hoạt động</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-white tracking-tighter">2.842</span>
            <span className="text-xs font-bold text-[#c3f400]">+12.4%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#c3f400] h-full w-[75%]"></div>
          </div>
        </div>

        <div className="bg-white/1.5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Doanh thu tháng</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-white tracking-tighter">142,5M</span>
            <span className="text-xs font-bold text-[#c3f400]">+8.2%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#c3f400] h-full w-[62%]"></div>
          </div>
        </div>

        <div className="bg-white/1.5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Tỉ lệ giữ chân</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-white tracking-tighter">94.8%</span>
            <span className="text-xs font-bold text-[#c3f400]">+2.1%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#c3f400] h-full w-[94.8%]"></div>
          </div>
        </div>

        <div className="bg-white/1.5 backdrop-blur-md border border-white/5 rounded-xl p-6 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[#71717a] uppercase tracking-widest">Tỉ lệ hủy gói</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold text-white tracking-tighter">1.2%</span>
            <span className="text-xs font-bold text-[#71717a]">-0.4%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-white/20 h-full w-[12%]"></div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/1.5 border border-white/5 rounded-xl p-6 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">Tăng trưởng doanh thu</h3>
              <p className="text-xs text-[#71717a]">Hiệu suất dự kiến so với dữ liệu thực tế lịch sử</p>
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

          <div className="h-64 w-full relative flex items-end gap-2 overflow-hidden border-b border-white/5 pb-2">
            <div className="flex-1 bg-white/5 rounded-t-sm h-[40%] hover:bg-[#c3f400]/20 transition-all cursor-pointer"></div>
            <div className="flex-1 bg-white/5 rounded-t-sm h-[45%] hover:bg-[#c3f400]/20 transition-all cursor-pointer"></div>
            <div className="flex-1 bg-white/5 rounded-t-sm h-[42%] hover:bg-[#c3f400]/20 transition-all cursor-pointer"></div>
            <div className="flex-1 bg-white/5 rounded-t-sm h-[58%] hover:bg-[#c3f400]/20 transition-all cursor-pointer"></div>
            <div className="flex-1 bg-white/5 rounded-t-sm h-[65%] hover:bg-[#c3f400]/20 transition-all cursor-pointer"></div>
            <div className="flex-1 bg-white/5 rounded-t-sm h-[72%] hover:bg-[#c3f400]/20 transition-all cursor-pointer"></div>
            <div className="flex-1 bg-[#c3f400]/40 rounded-t-sm h-[85%] hover:bg-[#c3f400] transition-all cursor-pointer relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#c3f400]">LIVE</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[92%] hover:bg-[#c3f400]/20 transition-all cursor-pointer border-t border-[#c3f400] border-dashed"></div>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-4">
            <div>
              <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mb-1">Doanh thu trung bình tháng (MRR)</div>
              <div className="text-xl font-bold text-white">128,4M</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mb-1">Doanh thu trên mỗi hội viên (ARPU)</div>
              <div className="text-xl font-bold text-white">450k</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest mb-1">Giá trị vòng đời hội viên</div>
              <div className="text-xl font-bold text-white">5,2M</div>
            </div>
          </div>
        </div>

        <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Nhật ký hệ thống</h3>
          <div className="space-y-6 flex-1">
            {logs.map((log) => (
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

      {/* Management Tables & Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white/1.5 border border-white/5 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Giao dịch gần đây</h3>
            <button type="button" className="text-xs font-bold text-[#c3f400] hover:underline cursor-pointer">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest border-b border-white/5 bg-white/2">
                  <th className="px-6 py-4">Mã Giao Dịch</th>
                  <th className="px-6 py-4">Hội Viên</th>
                  <th className="px-6 py-4">Số Tiền</th>
                  <th className="px-6 py-4">Trạng Thế</th>
                  <th className="px-6 py-4">Ngày Thực Hiện</th>
                  <th className="px-6 py-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/5">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[#c3f400]">{t.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{t.member}</td>
                    <td className="px-6 py-4 text-white">{t.amount}</td>
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
                    <td className="px-6 py-4 text-[#71717a] text-xs">{t.date}</td>
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

        <div className="lg:col-span-4 bg-white/1.5 border border-white/5 rounded-xl flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h3 className="text-lg font-bold text-white">Hiệu suất Huấn luyện viên</h3>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {trainers.map((trainer, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  alt={trainer.name}
                  className="w-10 h-10 rounded-lg object-cover grayscale border border-white/10"
                  src={trainer.image}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">{trainer.name}</span>
                    <span className="text-[9px] font-mono font-bold text-[#c3f400] uppercase tracking-widest">{trainer.role}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-[#71717a]">{trainer.activeSlots}</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          size={10}
                          className={starIndex < trainer.rating ? 'text-[#c3f400] fill-[#c3f400]' : 'text-[#71717a]'}
                        />
                      ))}
                    </div>
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
