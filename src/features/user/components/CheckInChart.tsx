import { useState } from 'react';

interface CheckInChartProps {
  checkIns?: any[];
}

export default function CheckInChart({ checkIns = [] }: CheckInChartProps) {
  const [tab, setTab] = useState<'week' | 'month'>('week');
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Map ngày check-in thực tế sang các thứ trong tuần
  // Trả về chiều cao biểu đồ 100% nếu ngày đó có check-in đi tập
  const hasVisited = days.map((_, index) => {
    // index 0 -> T2 (getDay = 1), ..., index 5 -> T7 (getDay = 6), index 6 -> CN (getDay = 0)
    const targetDayIndex = index === 6 ? 0 : index + 1;

    // Lọc xem trong danh sách checkIns có lần nào trùng thứ tương ứng hay không
    const matched = checkIns.some((record) => {
      const date = new Date(record.checkInAt);
      return date.getDay() === targetDayIndex;
    });

    return matched ? 100 : 0;
  });

  return (
    <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 p-6 rounded-xl h-[585px] flex flex-col box-border">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-sans text-xl font-extrabold m-0 text-white">Tần Suất Check-in</h3>
          <p className="text-[13px] text-zinc-500 mt-0.5 mb-0">Lịch sử đi tập tuần này</p>
        </div>
        <div className="flex gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setTab('week')}
            className={`px-3 py-1 text-[11px] font-bold border-none rounded transition-all cursor-pointer ${
              tab === 'week' ? 'bg-brand text-black' : 'bg-transparent text-zinc-500'
            }`}
          >
            Tuần
          </button>
          <button
            onClick={() => setTab('month')}
            className={`px-3 py-1 text-[11px] font-bold border-none rounded transition-all cursor-pointer ${
              tab === 'month' ? 'bg-brand text-black' : 'bg-transparent text-zinc-500'
            }`}
            disabled
          >
            Tháng
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-end justify-between gap-2 px-2">
        {days.map((day, index) => {
          const heightPct = hasVisited[index];
          const isToday = new Date().getDay() === (index === 6 ? 0 : index + 1);
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
              <div
                className={`group w-full rounded-t relative cursor-pointer transition-all min-h-1 ${
                  isToday
                    ? 'bg-brand shadow-[0_0_12px_rgba(195,244,0,0.2)] hover:brightness-110'
                    : 'bg-brand/[0.15] hover:bg-brand/30'
                }`}
                style={{ height: heightPct > 0 ? `${heightPct}%` : '4px' }}
              >
                {heightPct > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/5">
                    Đã tập
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-semibold uppercase ${isToday ? 'text-brand font-bold' : 'text-zinc-500'}`}>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

