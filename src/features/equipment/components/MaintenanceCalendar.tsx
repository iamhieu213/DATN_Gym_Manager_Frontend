import { Calendar as CalendarIcon } from 'lucide-react';
import type { MaintenanceTask } from '../types';

interface MaintenanceCalendarProps {
  maintenanceTasks: MaintenanceTask[];
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
  currentMonth: number;
  currentYear: number;
  onCompleteTask: (taskId: number) => void;
}

export default function MaintenanceCalendar({
  maintenanceTasks,
  selectedDay,
  setSelectedDay,
  currentMonth,
  currentYear,
  onCompleteTask
}: MaintenanceCalendarProps) {
  const now = new Date();

  // Calendar calculations
  const getDaysInMonth = (m: number, y: number) => new Date(y, m, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) => {
    const day = new Date(y, m - 1, 1).getDay();
    return day === 0 ? 6 : day - 1; // 0: Mon, ..., 6: Sun
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);
  const prevMonthDays = Array.from(
    { length: firstDayIndex },
    (_, idx) => daysInPrevMonth - firstDayIndex + idx + 1
  );

  const monthDays = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);

  const hasTaskOnDay = (dayNum: number) => {
    return maintenanceTasks.some(task => parseInt(task.day, 10) === dayNum);
  };

  const displayedTasks = selectedDay
    ? maintenanceTasks.filter(task => parseInt(task.day, 10) === selectedDay)
    : maintenanceTasks;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/[1.5%] border border-white/5 rounded-xl p-6 flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 m-0">
            <CalendarIcon className="text-brand w-4 h-4" />
            Lịch trình bảo dưỡng
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">
            Tháng {currentMonth}/{currentYear}
          </span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-6 text-xs border-b border-white/5 pb-4">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
            <span key={day} className="text-[9px] font-bold text-zinc-500 uppercase">
              {day}
            </span>
          ))}

          {/* Previous month's trailing days */}
          {prevMonthDays.map((dayNum, idx) => (
            <div key={`prev-${idx}`} className="p-1.5 text-center text-[11px] text-zinc-500/30">
              {dayNum}
            </div>
          ))}

          {/* Current month days */}
          {monthDays.map(day => {
            const isSelected = selectedDay === day;
            const isToday = day === now.getDate() && currentMonth === now.getMonth() + 1 && currentYear === now.getFullYear();
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={`p-1.5 relative text-[11px] cursor-pointer rounded transition-all duration-200 select-none hover:bg-white/5 ${
                  isToday
                    ? 'bg-white/10 text-white font-bold border border-white/10'
                    : isSelected
                      ? 'bg-brand text-black font-bold'
                      : 'text-white'
                } ${isSelected ? 'shadow-[0_0_8px_rgba(195,244,0,0.45)]' : ''}`}
              >
                {day}
                {hasTaskOnDay(day) && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-black' : 'bg-brand shadow-[0_0_5px_#c3f400]'
                    }`}
                  ></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Maintenance Tasks List */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest m-0">
              {selectedDay
                ? `Nhiệm vụ ngày ${selectedDay.toString().padStart(2, '0')}`
                : 'Nhiệm vụ sắp tới'}
            </h4>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="bg-transparent border-none text-[9px] text-brand font-bold cursor-pointer hover:underline"
              >
                Xem tất cả
              </button>
            )}
          </div>

          {displayedTasks.length > 0 ? (
            displayedTasks.map(task => (
              <div key={task.id} className="group flex gap-4 items-start">
                <div className="flex flex-col items-center justify-center bg-white/5 border border-white/5 rounded-lg p-2 min-w-12 text-center shrink-0">
                  <span className="font-extrabold text-white text-base tracking-tighter leading-[1.2]">
                    {task.day}
                  </span>
                  <span className="text-[9px] text-zinc-500 uppercase font-mono">{task.month}</span>
                </div>

                <div className="flex-1 bg-white/[2%] rounded-xl p-4 border border-white/5 transition-all duration-300 group-hover:border-brand/20">
                  <div className="font-bold text-xs text-white transition-colors duration-200 group-hover:text-brand">
                    {task.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 mb-2 leading-[1.4]">{task.description}</div>

                  <div className="flex items-center justify-between">
                    {task.priority === 'CRITICAL' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-red-500/10 text-red-500">
                        Khẩn cấp
                      </span>
                    )}
                    {task.priority === 'ROUTINE' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-brand/10 text-brand">
                        Định kỳ
                      </span>
                    )}
                    {task.priority === 'NORMAL' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-blue-500/10 text-blue-500">
                        Bình thường
                      </span>
                    )}

                    {task.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => onCompleteTask(task.id)}
                        className="px-2 py-1 bg-brand text-black font-extrabold text-[8px] uppercase tracking-wider rounded border-none cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-95"
                      >
                        Hoàn thành
                      </button>
                    ) : (
                      <span className="text-emerald-500 text-[8px] font-bold uppercase tracking-widest">
                        Đã xong
                      </span>
                    )}
                  </div>

                  {task.assignedTeam && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[2%] text-[9px] text-zinc-500">
                      <span>Chịu trách nhiệm: {task.assignedTeam}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-zinc-500">
              Không có lịch bảo trì nào{' '}
              {selectedDay ? `trong ngày ${selectedDay}` : 'trong tháng này'}.
            </div>
          )}
        </div>

        <button
          type="button"
          className="mt-6 w-full border border-white/10 py-2.5 rounded-lg font-bold text-xs text-white bg-transparent cursor-pointer transition-all duration-200 hover:bg-white/5 active:scale-95"
        >
          Mở lịch biểu chi tiết
        </button>
      </div>
    </div>
  );
}
