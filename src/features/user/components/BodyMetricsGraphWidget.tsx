import { useState } from 'react';
import { Activity, ChevronDown } from 'lucide-react';

interface BodyMetricsGraphWidgetProps {
  metrics?: any[];
}

export default function BodyMetricsGraphWidget({ metrics = [] }: BodyMetricsGraphWidgetProps) {
  const [metricType, setMetricType] = useState<'weight' | 'fat'>('weight');

  const sortedMetrics = [...metrics].reverse();

  const displayMetrics =
    sortedMetrics.length > 0
      ? sortedMetrics
      : [
          { recorded_at: '2026-05-11', weight_kg: 75.8, body_fat_pct: 22 },
          { recorded_at: '2026-05-12', weight_kg: 75.2, body_fat_pct: 21.8 },
          { recorded_at: '2026-05-20', weight_kg: 74.9, body_fat_pct: 21.5 },
          { recorded_at: '2026-06-05', weight_kg: 74.5, body_fat_pct: 21.2 },
          { recorded_at: '2026-06-20', weight_kg: 74.1, body_fat_pct: 20.8 },
          { recorded_at: '2026-07-05', weight_kg: 73.8, body_fat_pct: 20.5 },
          { recorded_at: '2026-07-20', weight_kg: 73.2, body_fat_pct: 20.1 },
          { recorded_at: '2026-08-05', weight_kg: 72.8, body_fat_pct: 19.8 },
          { recorded_at: '2026-08-20', weight_kg: 72.3, body_fat_pct: 19.5 },
          { recorded_at: '2026-09-05', weight_kg: 71.9, body_fat_pct: 19.1 },
          { recorded_at: '2026-09-20', weight_kg: 71.5, body_fat_pct: 18.8 }
        ];

  const values = displayMetrics.map((m) => {
    if (metricType === 'fat') return m.body_fat_pct || 20;
    return m.weight_kg || 70;
  });

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.2 || 5;

  const yMin = Math.max(0, Math.floor((minVal - padding) * 10) / 10);
  const yMax = Math.ceil((maxVal + padding) * 10) / 10;
  const yRange = yMax - yMin || 1;

  const yTicks = [
    yMax,
    Math.round((yMin + (yRange * 3) / 4) * 10) / 10,
    Math.round((yMin + (yRange * 2) / 4) * 10) / 10,
    Math.round((yMin + (yRange * 1) / 4) * 10) / 10,
    yMin
  ];

  const svgWidth = 1000;
  const svgHeight = 240;
  const chartPaddingTop = 20;
  const chartPaddingBottom = 30;
  const usableHeight = svgHeight - chartPaddingTop - chartPaddingBottom;

  const points = displayMetrics.map((m, index) => {
    const val = values[index];
    const x = (index / Math.max(1, displayMetrics.length - 1)) * svgWidth;
    const y = chartPaddingTop + (1 - (val - yMin) / yRange) * usableHeight;
    return { x, y, val, date: m.recorded_at };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-5 box-border backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-[#c3f400]" />
          <h3 className="text-base font-bold text-white tracking-tight">Chỉ số cơ thể của bạn</h3>
        </div>

        <div className="relative flex items-center">
          <select
            value={metricType}
            onChange={(e) => setMetricType(e.target.value as any)}
            className="bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-zinc-200 text-xs font-medium px-3 py-1.5 pr-8 rounded-lg outline-none cursor-pointer transition-all appearance-none"
          >
            <option value="weight">Cân nặng theo thời gian</option>
            <option value="fat">% Mỡ cơ thể theo thời gian</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 pointer-events-none text-zinc-400" />
        </div>
      </div>

      <div className="flex gap-4 relative w-full">
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between text-xs text-zinc-400 font-medium pb-6 min-w-[36px] text-right">
          {yTicks.map((tick, idx) => (
            <span key={idx}>{tick}</span>
          ))}
        </div>

        {/* SVG Chart Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-[200px] overflow-visible" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            {yTicks.map((_, idx) => {
              const lineY = chartPaddingTop + (idx / 4) * usableHeight;
              return (
                <line
                  key={idx}
                  x1="0"
                  y1={lineY}
                  x2={svgWidth}
                  y2={lineY}
                  stroke="#27272a"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Line Path */}
            <path d={pathD} fill="none" stroke="#c3f400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Dots on line */}
            {points.map((pt, idx) => (
              <g key={idx} className="cursor-pointer group">
                <circle cx={pt.x} cy={pt.y} r="4" fill="#18181b" stroke="#c3f400" strokeWidth="2.5" className="group-hover:r-6 transition-all" />
                <title>{`${pt.val} ${metricType === 'weight' ? 'kg' : '%'} (${pt.date})`}</title>
              </g>
            ))}
          </svg>

          {/* X Axis Dates Timeline */}
          <div className="flex justify-between pt-2.5 border-t border-zinc-800 text-xs text-zinc-400 font-medium">
            {displayMetrics.map((m, idx) => {
              const d = new Date(m.recorded_at);
              const dateLabel = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}`;
              return <span key={idx}>{dateLabel}</span>;
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <span className="text-xs text-zinc-500">Hiển thị {displayMetrics.length} mốc gần nhất</span>
      </div>
    </div>
  );
}
