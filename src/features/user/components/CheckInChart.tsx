import { useState } from 'react';
import './CheckInChart.css';

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
    <div className="chart-card-attendance">
      <div className="chart-header-row">
        <div className="chart-title-box">
          <h3>Tần Suất Check-in</h3>
          <p>Lịch sử đi tập tuần này</p>
        </div>
        <div className="chart-tabs-btn">
          <button
            onClick={() => setTab('week')}
            className={`tab-btn ${tab === 'week' ? 'active' : ''}`}
          >
            Tuần
          </button>
          <button
            onClick={() => setTab('month')}
            className={`tab-btn ${tab === 'month' ? 'active' : ''}`}
            disabled
          >
            Tháng
          </button>
        </div>
      </div>
      <div className="bar-chart-plot">
        {days.map((day, index) => {
          const heightPct = hasVisited[index];
          const isToday = new Date().getDay() === (index === 6 ? 0 : index + 1);
          return (
            <div key={day} className="bar-column">
              <div
                className={`bar-pill ${isToday ? 'filled' : ''}`}
                style={{ height: heightPct > 0 ? `${heightPct}%` : '4px' }}
              >
                {heightPct > 0 && (
                  <div className="bar-pill-hover-tooltip">Đã tập</div>
                )}
              </div>
              <span className={`bar-label ${isToday ? 'active' : ''}`}>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

