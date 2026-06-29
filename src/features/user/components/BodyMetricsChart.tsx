import './BodyMetricsChart.css';

interface BodyMetricsChartProps {
  currentWeight?: number;
  currentFat?: number;
}

export default function BodyMetricsChart({
  currentWeight = 74.5,
  currentFat = 16.2
}: BodyMetricsChartProps) {
  return (
    <div className="chart-card-metrics">
      <h3 className="chart-title-header">Chỉ Số Cơ Thể</h3>
      <p className="chart-subtitle-desc">Biến động Cân nặng &amp; % Mỡ</p>
      
      <div className="chart-svg-box">
        <svg className="svg-element" viewBox="0 0 100 50" preserveAspectRatio="none">
          {/* Weight Line (Lime) */}
          <path d="M0,45 L20,42 L40,38 L60,40 L80,35 L100,32" fill="none" stroke="#caf300" strokeWidth="2"></path>
          {/* Body Fat Line (White) */}
          <path d="M0,25 L20,28 L40,24 L60,20 L80,22 L100,18" fill="none" stroke="#ffffff" strokeDasharray="2" strokeWidth="1.5"></path>
        </svg>
        <div className="svg-label-timeline">
          <span>Th8</span>
          <span>Th9</span>
          <span>Th10</span>
          <span>Hiện tại</span>
        </div>
      </div>

      <div className="chart-metrics-info-grid">
        <div>
          <div className="metric-legend-item">
            <div className="legend-dot-lime"></div>
            <span className="metric-legend-text">Cân nặng</span>
          </div>
          <p className="metric-number">
            {currentWeight} <span className="metric-unit">kg</span>
          </p>
        </div>
        <div>
          <div className="metric-legend-item">
            <div className="legend-dot-white"></div>
            <span className="metric-legend-text">% Mỡ</span>
          </div>
          <p className="metric-number">
            {currentFat} <span className="metric-unit">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
