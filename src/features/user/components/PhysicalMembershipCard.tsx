interface PhysicalMembershipCardProps {
  userName?: string;
  userId?: number | string;
  membership?: any;
}

export default function PhysicalMembershipCard({ userName, userId, membership }: PhysicalMembershipCardProps) {
  const plan = membership?.plan;
  const isExpired = !membership || membership.status === 'EXPIRED';

  const memberName = userName || membership?.user?.name || 'Hội viên Kinetic';
  const memberCode = `HV${String(userId || membership?.user_id || 1).padStart(5, '0')}`;

  const durationDays = plan?.duration_days || 365;
  const durationMonths = Math.max(1, Math.round(durationDays / 30));

  let formattedEndDate = 'Chưa đăng ký';
  if (membership?.end_date) {
    const d = new Date(membership.end_date);
    formattedEndDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  const planName = plan?.name || 'Gói Thành Viên';
  const planCodeTag = plan?.code ? plan.code.toUpperCase() : `YEARLY-${durationMonths}M`;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-4 h-full box-border backdrop-blur-sm">
      <h3 className="text-base font-bold text-white tracking-tight">Thẻ tập của bạn</h3>

      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[200px] border border-slate-700/50 flex-1">
        {/* Glow effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-radial from-lime-500/10 to-transparent pointer-events-none rounded-full blur-2xl" />

        {/* Top Header Row */}
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-black tracking-tight text-white font-sans">Kinetic</span>
            <span className="text-[8px] font-extrabold tracking-[0.25em] text-zinc-400 uppercase mt-0.5">
              FITNESS CLUB
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase ${
                isExpired
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isExpired ? 'EXPIRED' : 'ACTIVE'}
            </span>
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider">
              {planCodeTag}
            </span>
          </div>
        </div>

        {/* Card Title */}
        <div className="my-4 z-10">
          <h2 className="text-xl font-black tracking-[0.12em] text-white font-sans drop-shadow-md">
            MEMBERSHIP CARD
          </h2>
        </div>

        {/* Card Bottom Details */}
        <div className="flex flex-col gap-2 z-10 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white font-sans">{memberName}</span>
            <span className="bg-white/10 backdrop-blur-md text-white font-mono text-xs font-bold px-2 py-0.5 rounded border border-white/20">
              {memberCode}
            </span>
          </div>

          <div className="text-xs text-zinc-300 flex items-center gap-1.5 flex-wrap">
            <span>Thẻ {durationMonths} tháng — {planName}</span>
            <span className="text-amber-400 text-[10px]">★</span>
            <span>Hết hạn: {formattedEndDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
