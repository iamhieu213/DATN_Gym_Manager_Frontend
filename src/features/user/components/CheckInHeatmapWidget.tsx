interface CheckInHeatmapWidgetProps {
  checkIns?: any[];
}

export default function CheckInHeatmapWidget({ checkIns = [] }: CheckInHeatmapWidgetProps) {
  const checkInDatesSet = new Set<string>();
  checkIns.forEach((c) => {
    if (c.checkInAt) {
      const d = new Date(c.checkInAt);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      checkInDatesSet.add(str);
    }
  });

  const totalCheckInsInYear = checkInDatesSet.size;

  const today = new Date();
  const weeks: { date: Date; dateStr: string; isCheckedIn: boolean; monthName: string }[][] = [];

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (52 * 7 + today.getDay()));

  let currentPointer = new Date(startDate);
  const monthLabels: { name: string; weekIndex: number }[] = [];
  let lastMonth = -1;

  for (let w = 0; w < 53; w++) {
    const weekDays = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = `${currentPointer.getFullYear()}-${String(currentPointer.getMonth() + 1).padStart(2, '0')}-${String(currentPointer.getDate()).padStart(2, '0')}`;
      const isCheckedIn = checkInDatesSet.has(dateStr);
      const mNum = currentPointer.getMonth();

      if (mNum !== lastMonth && d === 0) {
        monthLabels.push({
          name: `Tháng ${mNum + 1}`,
          weekIndex: w
        });
        lastMonth = mNum;
      }

      weekDays.push({
        date: new Date(currentPointer),
        dateStr,
        isCheckedIn,
        monthName: `Tháng ${mNum + 1}`
      });

      currentPointer.setDate(currentPointer.getDate() + 1);
    }
    weeks.push(weekDays);
  }

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-4 box-border backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white tracking-tight">Lịch check-in</h3>
        <div className="bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs font-semibold px-3 py-1 rounded-full">
          <span>Đã check-in {totalCheckInsInYear} ngày trong 1 năm</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[780px] flex flex-col gap-2">
          {/* Months Header Line */}
          <div className="flex items-center">
            <div className="w-7 flex-shrink-0" />
            <div className="relative flex-1 h-5">
              {monthLabels.map((m, idx) => (
                <span
                  key={idx}
                  className="absolute text-xs text-zinc-400 font-medium whitespace-nowrap"
                  style={{ left: `${(m.weekIndex / 53) * 100}%` }}
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>

          {/* Grid Rows */}
          <div className="flex items-center gap-2">
            {/* Day Labels Y-Axis */}
            <div className="w-5 flex flex-col justify-between h-[90px] text-[10px] text-zinc-400 font-medium">
              <span>T2</span>
              <span>T4</span>
              <span>T6</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-1 flex-1 justify-between">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((dayItem, dIdx) => (
                    <div
                      key={dIdx}
                      className={`w-2.5 h-2.5 rounded-[2px] transition-transform hover:scale-125 hover:z-10 ${
                        dayItem.isCheckedIn
                          ? 'bg-[#ff6b00] shadow-[0_0_6px_rgba(255,107,0,0.5)]'
                          : 'bg-zinc-800'
                      }`}
                      title={`${dayItem.dateStr}: ${dayItem.isCheckedIn ? 'Đã check-in' : 'Chưa check-in'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex justify-end items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-zinc-800" />
          <span>Chưa check-in</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#ff6b00]" />
          <span>Đã check-in</span>
        </div>
      </div>
    </div>
  );
}
