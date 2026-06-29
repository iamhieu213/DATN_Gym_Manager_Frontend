import { useState } from 'react';
import './CheckInChart.css';

interface CheckInChartProps {
  data?: number[];
}

export default function CheckInChart({ data = [60, 40, 85, 0, 65, 90, 20] }: CheckInChartProps) {
  const [tab, setTab] = useState<'week' | 'month'>('week');
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const times = ['45m', '30m', '75m', '0m', '50m', '80m', '15m'];

  return (
    <div className="chart-card-attendance">
      <div className="chart-header-row">
        <div className="chart-title-box">
          <h3>Tần Suất Check-in</h3>
          <p>Lượt tập luyện trong tuần này</p>
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
          >
            Tháng
          </button>
        </div>
      </div>
      <div className="bar-chart-plot">
        {days.map((day, index) => {
          const heightPct = data[index] !== undefined ? data[index] : 0;
          const isT4 = day === 'T4'; // highlighting Wednesday as in design
          return (
            <div key={day} className="bar-column">
              <div
                className={`bar-pill ${isT4 ? 'filled' : ''}`}
                style={{ height: heightPct > 0 ? `${heightPct}%` : '4px' }}
              >
                {heightPct > 0 && (
                  <div className="bar-pill-hover-tooltip">{times[index]}</div>
                )}
              </div>
              <span className={`bar-label ${isT4 ? 'active' : ''}`}>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
