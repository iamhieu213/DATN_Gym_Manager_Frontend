import { ShieldCheck } from 'lucide-react';

interface MembershipCardProps {
  membership?: any;
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  if (!membership) {
    return (
      <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 hover:border-brand/20 p-6 rounded-xl flex flex-col justify-between min-h-[200px] box-border transition-[transform,border-color] duration-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.1em] m-0 mb-1">Gói thành viên hiện tại</p>
            <h3 className="font-sans text-xl font-extrabold text-brand m-0">Chưa đăng ký gói tập</h3>
          </div>
          <ShieldCheck className="text-brand" style={{ opacity: 0.5 }} size={32} />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex justify-between items-end gap-3">
            <span className="text-white text-2xl font-black">Không hoạt động</span>
            <span className="text-zinc-500 text-[13px]">Vui lòng đăng ký gói thành viên để bắt đầu</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-brand h-full shadow-[0_0_10px_rgba(195,244,0,0.4)]" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const { plan, end_date } = membership;
  const expiredDate = new Date(end_date);
  
  // Tính số ngày còn lại động
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = expiredDate.getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const formattedExpiredDate = expiredDate.toLocaleDateString('vi-VN');
  
  // Giả sử thời hạn tối đa của gói hiển thị tiến trình là 30 ngày (hoặc lấy từ plan.duration_days nếu có)
  const totalDays = plan?.duration_days || 30;
  const progressPercent = Math.min(100, Math.max(0, (daysLeft / totalDays) * 100));

  return (
    <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 hover:border-brand/20 p-6 rounded-xl flex flex-col justify-between min-h-[200px] box-border transition-[transform,border-color] duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.1em] m-0 mb-1">Gói thành viên hiện tại</p>
          <h3 className="font-sans text-xl font-extrabold text-brand m-0">{plan?.name || 'KINETIC PRO ELITE'}</h3>
        </div>
        <ShieldCheck className="text-brand" size={32} />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between items-end gap-3">
          <span className="text-white text-2xl font-black">{daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn'}</span>
          <span className="text-zinc-500 text-[13px]">Hết hạn: {formattedExpiredDate}</span>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
          <div className="bg-brand h-full shadow-[0_0_10px_rgba(195,244,0,0.4)]" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
}

