import { Link } from 'react-router-dom';
import { Users, CalendarClock, UserCircle } from 'lucide-react';

const shortcuts = [
  { to: '/coach/students', label: 'Học viên của tôi', desc: 'Danh sách hội viên đang tập cùng bạn.', icon: Users },
  { to: '/coach/availability', label: 'Lịch rảnh', desc: 'Thiết lập khung giờ nhận học viên hằng tuần.', icon: CalendarClock },
  { to: '/coach/profile', label: 'Hồ sơ HLV', desc: 'Chuyên môn và giới thiệu hiển thị cho hội viên.', icon: UserCircle },
];

export default function CoachDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="m-0 mb-2 text-3xl font-black tracking-tight text-white">Khu vực Huấn luyện viên</h1>
        <p className="m-0 text-sm text-zinc-400">
          Các chức năng dành cho HLV đang được xây dựng. Bạn có thể xem trước các mục bên dưới.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {shortcuts.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-zinc-900/90 p-6 no-underline transition-colors hover:border-brand/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <Icon size={20} />
            </div>
            <div>
              <p className="m-0 text-base font-bold text-white">{label}</p>
              <p className="m-0 mt-1 text-xs leading-relaxed text-zinc-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
