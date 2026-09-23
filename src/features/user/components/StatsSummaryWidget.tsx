import { Calendar, Flame, CheckSquare } from 'lucide-react';

interface StatsSummaryWidgetProps {
  membership?: any;
  checkIns?: any[];
}

export default function StatsSummaryWidget({ membership, checkIns = [] }: StatsSummaryWidgetProps) {
  // 1. Days Left
  let daysLeft = 0;
  if (membership?.end_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(membership.end_date);
    const diff = end.getTime() - today.getTime();
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // 2. Check-in Streak
  let streak = 0;
  if (checkIns.length > 0) {
    const dates = Array.from(
      new Set(
        checkIns.map((c) => {
          const d = new Date(c.checkInAt);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
      )
    ).sort().reverse();

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dates.includes(todayStr) || dates.includes(yesterdayStr)) {
      let checkDate = dates.includes(todayStr) ? new Date() : yesterday;
      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (dates.includes(dStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  // 3. Month Check-in Count
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthCheckInsCount = checkIns.filter((c) => {
    const d = new Date(c.checkInAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row justify-around items-center gap-4 box-border backdrop-blur-sm">
      <div className="flex items-center gap-4 flex-1 justify-center w-full">
        <div className="w-11 h-11 rounded-xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center flex-shrink-0 text-purple-400">
          <Calendar size={20} />
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-extrabold text-white font-sans leading-none">{daysLeft}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Ngày còn lại</div>
        </div>
      </div>

      <div className="hidden sm:block w-[1px] h-10 bg-zinc-800/80" />

      <div className="flex items-center gap-4 flex-1 justify-center w-full">
        <div className="w-11 h-11 rounded-xl bg-orange-950/60 border border-orange-800/50 flex items-center justify-center flex-shrink-0 text-orange-400">
          <Flame size={20} />
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-extrabold text-white font-sans leading-none">{streak}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Chuỗi check-in</div>
        </div>
      </div>

      <div className="hidden sm:block w-[1px] h-10 bg-zinc-800/80" />

      <div className="flex items-center gap-4 flex-1 justify-center w-full">
        <div className="w-11 h-11 rounded-xl bg-sky-950/60 border border-sky-800/50 flex items-center justify-center flex-shrink-0 text-sky-400">
          <CheckSquare size={20} />
        </div>
        <div className="flex flex-col">
          <div className="text-2xl font-extrabold text-white font-sans leading-none">{monthCheckInsCount}</div>
          <div className="text-xs text-zinc-400 font-medium mt-1">Check-In tháng này</div>
        </div>
      </div>
    </div>
  );
}
