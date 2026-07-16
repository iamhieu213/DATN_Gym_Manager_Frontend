import './BodyMetricsChart.css';

interface BodyMetricsChartProps {
  metrics?: any[];
}

export default function BodyMetricsChart({ metrics = [] }: BodyMetricsChartProps) {
  // Sắp xếp các chỉ số theo thứ tự thời gian tăng dần để vẽ biểu đồ từ trái sang phải
  const sortedMetrics = [...metrics].reverse();

  // Lấy dữ liệu hiện tại (lần đo gần nhất là phần tử đầu tiên của mảng metrics gốc)
  const currentMetric = metrics[0];
  const currentWeight = currentMetric?.weight_kg || 0;
  const currentFat = currentMetric?.body_fat_pct || 0;

  // Lấy tối đa 6 mốc đo gần nhất để vẽ biểu đồ
  const chartData = sortedMetrics.slice(-6);

  // Tạo các mốc thời gian hiển thị nhãn trục X
  const timeLabels = chartData.map((m) => {
    const d = new Date(m.recorded_at);
    return `Th${d.getMonth() + 1}`;
  });

  // Tính toán đường vẽ cân nặng trên SVG (tọa độ Y chạy từ 0 đến 50)
  // Giả định cân nặng khoảng từ 40kg đến 120kg. Ta mapping Y = 50 - (weight_kg - 40) * 0.5
  const getWeightY = (w: number) => {
    return 50 - Math.min(45, Math.max(5, (w - 40) * 0.5));
  };

  // Tính toán đường vẽ tỉ lệ mỡ trên SVG (tỉ lệ mỡ khoảng 5% đến 40%)
  // Ta mapping Y = 50 - (body_fat_pct - 5) * 1.2
  const getFatY = (f: number) => {
    return 50 - Math.min(45, Math.max(5, (f - 5) * 1.2));
  };

  // Tạo đường path SVG
  const weightPath = chartData.reduce((path, m, i) => {
    const x = (i / Math.max(1, chartData.length - 1)) * 100;
    const y = getWeightY(m.weight_kg);
    return path + (i === 0 ? `M${x},${y}` : ` L${x},${y}`);
  }, '');

  const fatPath = chartData.reduce((path, m, i) => {
    const x = (i / Math.max(1, chartData.length - 1)) * 100;
    const y = getFatY(m.body_fat_pct || 15);
    return path + (i === 0 ? `M${x},${y}` : ` L${x},${y}`);
  }, '');

  return (
    <div className="chart-card-metrics">
      <h3 className="chart-title-header">Chỉ Số Cơ Thể</h3>
      <p className="chart-subtitle-desc">Biến động Cân nặng &amp; % Mỡ</p>
      
      <div className="chart-svg-box">
        {chartData.length > 0 ? (
          <svg className="svg-element" viewBox="0 0 100 50" preserveAspectRatio="none">
            {/* Đường cân nặng (Màu xanh Lime) */}
            {weightPath && <path d={weightPath} fill="none" stroke="#caf300" strokeWidth="2"></path>}
            {/* Đường phần trăm mỡ (Màu Trắng, nét đứt) */}
            {fatPath && <path d={fatPath} fill="none" stroke="#ffffff" strokeDasharray="2" strokeWidth="1.5"></path>}
          </svg>
        ) : (
          <div className="no-chart-data" style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, fontSize: '12px' }}>
            Chưa có lịch sử đo chỉ số
          </div>
        )}
        
        <div className="svg-label-timeline">
          {timeLabels.length > 0 ? (
            timeLabels.map((lbl, idx) => <span key={idx}>{lbl}</span>)
          ) : (
            <>
              <span>Th8</span>
              <span>Th9</span>
              <span>Th10</span>
              <span>Hiện tại</span>
            </>
          )}
        </div>
      </div>

      <div className="chart-metrics-info-grid">
        <div>
          <div className="metric-legend-item">
            <div className="legend-dot-lime"></div>
            <span className="metric-legend-text">Cân nặng</span>
          </div>
          <p className="metric-number">
            {currentWeight > 0 ? `${currentWeight} ` : '-- '}
            <span className="metric-unit">kg</span>
          </p>
        </div>
        <div>
          <div className="metric-legend-item">
            <div className="legend-dot-white"></div>
            <span className="metric-legend-text">% Mỡ</span>
          </div>
          <p className="metric-number">
            {currentFat > 0 ? `${currentFat} ` : '-- '}
            <span className="metric-unit">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}

