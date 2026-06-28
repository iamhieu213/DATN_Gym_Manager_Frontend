import { Calendar as CalendarIcon } from 'lucide-react';
import type { MaintenanceTask } from '../types';
import './MaintenanceCalendar.css';

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
    <div className="calendar-wrapper">
      <div className="calendar-card">
        <div className="calendar-header">
          <h3 className="calendar-title">
            <CalendarIcon />
            Lịch trình bảo dưỡng
          </h3>
          <span className="calendar-subtitle">
            Tháng {currentMonth}/{currentYear}
          </span>
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
            <span key={day} className="grid-weekday">
              {day}
            </span>
          ))}

          {/* Previous month's trailing days */}
          {prevMonthDays.map((dayNum, idx) => (
            <div key={`prev-${idx}`} className="grid-day-prev">
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
                className={`grid-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              >
                {day}
                {hasTaskOnDay(day) && (
                  <span
                    className={`grid-day-dot ${isSelected ? 'selected' : 'active'}`}
                  ></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Maintenance Tasks List */}
        <div className="task-list-container">
          <div className="task-list-header">
            <h4 className="task-list-title">
              {selectedDay
                ? `Nhiệm vụ ngày ${selectedDay.toString().padStart(2, '0')}`
                : 'Nhiệm vụ sắp tới'}
            </h4>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="btn-clear-view"
              >
                Xem tất cả
              </button>
            )}
          </div>

          {displayedTasks.length > 0 ? (
            displayedTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-date-box">
                  <span className="task-date-day">
                    {task.day}
                  </span>
                  <span className="task-date-month">{task.month}</span>
                </div>

                <div className="task-details-card">
                  <div className="task-title">
                    {task.title}
                  </div>
                  <div className="task-desc">{task.description}</div>

                  <div className="task-action-row">
                    {task.priority === 'CRITICAL' && (
                      <span className="badge-priority critical">
                        Khẩn cấp
                      </span>
                    )}
                    {task.priority === 'ROUTINE' && (
                      <span className="badge-priority routine">
                        Định kỳ
                      </span>
                    )}
                    {task.priority === 'NORMAL' && (
                      <span className="badge-priority normal">
                        Bình thường
                      </span>
                    )}

                    {task.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => onCompleteTask(task.id)}
                        className="btn-complete-task"
                      >
                        Hoàn thành
                      </button>
                    ) : (
                      <span className="text-task-done">
                        Đã xong
                      </span>
                    )}
                  </div>

                  {task.assignedTeam && (
                    <div className="task-assigned-team">
                      <span>Chịu trách nhiệm: {task.assignedTeam}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-[#71717a]" style={{ textAlign: 'center', padding: '32px 0', fontSize: '0.75rem', color: '#71717a' }}>
              Không có lịch bảo trì nào{' '}
              {selectedDay ? `trong ngày ${selectedDay}` : 'trong tháng này'}.
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn-open-calendar"
        >
          Mở lịch biểu chi tiết
        </button>
      </div>
    </div>
  );
}
