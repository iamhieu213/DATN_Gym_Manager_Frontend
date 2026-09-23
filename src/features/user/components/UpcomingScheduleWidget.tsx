import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UpcomingScheduleWidgetProps {
  sessions?: any[];
}

export default function UpcomingScheduleWidget({ sessions = [] }: UpcomingScheduleWidgetProps) {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-4 h-full box-border backdrop-blur-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Lịch tập sắp tới</h3>
          <p className="text-xs text-zinc-400 mt-1">3 buổi gần nhất</p>
        </div>
        <Link to="/user/plans" className="text-xs font-semibold text-zinc-400 hover:text-[#c3f400] transition-colors flex items-center gap-1">
          <span>Xem lịch tập</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex-1 flex flex-col">
        {sessions.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {sessions.slice(0, 3).map((item, index) => {
              const d = new Date(item.scheduledAt || Date.now());
              const dateStr = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
              const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

              return (
                <div key={item.id || index} className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-3 flex items-center gap-4 hover:bg-zinc-800 transition-colors">
                  <div className="flex flex-col items-center bg-zinc-900 border border-zinc-700/60 rounded-lg px-2.5 py-1.5 min-w-[70px]">
                    <span className="text-[11px] text-zinc-400 font-semibold">{dateStr}</span>
                    <span className="text-xs text-white font-extrabold">{timeStr}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{item.note || 'Buổi tập 1-1 cùng HLV'}</span>
                    <span className="text-[11px] text-zinc-400 mt-0.5">HLV: {item.coach?.user?.name || 'HLV Cá nhân'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 min-h-[180px] flex items-center justify-center text-zinc-500 text-xs bg-zinc-950/40 rounded-xl border border-dashed border-zinc-800">
            <span>Bạn chưa có buổi tập nào sắp tới.</span>
          </div>
        )}
      </div>
    </div>
  );
}
