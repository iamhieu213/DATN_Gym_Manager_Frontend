import { UserCheck } from 'lucide-react';

interface PtSessionCardProps {
  ptSession?: any;
}

export default function PtSessionCard({ ptSession }: PtSessionCardProps) {
  if (!ptSession) {
    return (
      <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 hover:border-brand/20 p-6 rounded-xl flex flex-col justify-between min-h-[200px] box-border transition-[transform,border-color] duration-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.1em] m-0 mb-1">Huấn luyện viên cá nhân</p>
            <div className="flex items-center gap-3 mt-1">
              <h3 className="font-sans text-xl font-extrabold text-white m-0 ml-0 opacity-60">Chưa đăng ký HLV</h3>
            </div>
          </div>
          <UserCheck className="text-brand" style={{ opacity: 0.5 }} size={32} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-lg flex justify-between items-center">
            <span className="text-[13px] text-zinc-500 font-semibold">Buổi tập còn lại:</span>
            <span className="text-2xl font-black text-brand">0/0</span>
          </div>
          <p className="text-[10px] text-zinc-500 text-right m-0">Đăng ký dịch vụ PT để được thiết lập lịch tập cá nhân.</p>
        </div>
      </div>
    );
  }

  const coach = ptSession.coach;
  const coachName = coach?.user?.name || 'Huấn luyện viên';
  const coachAvatar = coach?.user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100';
  const totalSessions = ptSession.totalSessions || 0;
  const sessionsTrained = ptSession.sessionsTrained || 0;
  const sessionsLeftCount = totalSessions - sessionsTrained;
  const sessionsLeft = `${sessionsLeftCount}/${totalSessions}`;

  // Định dạng ngày hết hạn hợp đồng PT
  const expiryDate = ptSession.endDate ? new Date(ptSession.endDate).toLocaleDateString('vi-VN') : 'Không xác định';

  return (
    <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 hover:border-brand/20 p-6 rounded-xl flex flex-col justify-between min-h-[200px] box-border transition-[transform,border-color] duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.1em] m-0 mb-1">Huấn luyện viên cá nhân</p>
          <div className="flex items-center gap-3 mt-1">
            <img src={coachAvatar} alt={coachName} className="w-10 h-10 rounded-full border border-brand object-cover" />
            <h3 className="font-sans text-xl font-extrabold text-white m-0">{coachName}</h3>
          </div>
        </div>
        <UserCheck className="text-brand" size={32} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-white/[0.03] border border-white/5 p-3 rounded-lg flex justify-between items-center">
          <span className="text-[13px] text-zinc-500 font-semibold">Buổi tập còn lại:</span>
          <span className="text-2xl font-black text-brand">{sessionsLeft}</span>
        </div>
        <p className="text-[10px] text-zinc-500 text-right m-0">Hạn hợp đồng PT: {expiryDate}</p>
      </div>
    </div>
  );
}

