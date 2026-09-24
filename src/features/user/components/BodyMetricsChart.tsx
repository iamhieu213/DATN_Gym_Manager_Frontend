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
    <div className="bg-white/[0.015] backdrop-blur-md border border-white/5 p-6 rounded-xl h-[585px] flex flex-col box-border">
      <h3 className="font-sans text-xl font-extrabold m-0 text-white">Chỉ Số Cơ Thể</h3>
      <p className="text-[13px] text-zinc-500 mt-0.5 mb-6">Biến động Cân nặng &amp; % Mỡ</p>

      <div className="flex-1 relative flex items-center justify-center border-l border-b border-white/5 ml-4 mb-7">
        {chartData.length > 0 ? (
          <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
            {/* Đường cân nặng (Màu xanh Lime) */}
            {weightPath && <path d={weightPath} fill="none" stroke="#c3f400" strokeWidth="2"></path>}
            {/* Đường phần trăm mỡ (Màu Trắng, nét đứt) */}
            {fatPath && <path d={fatPath} fill="none" stroke="#ffffff" strokeDasharray="2" strokeWidth="1.5"></path>}
          </svg>
        ) : (
          <div className="h-[50px] flex items-center justify-center opacity-50 text-xs">
            Chưa có lịch sử đo chỉ số
          </div>
        )}

        <div className="absolute -bottom-5 left-0 right-0 flex justify-between text-[10px] text-zinc-500">
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

      <div className="grid grid-cols-2 gap-4 mt-0 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-brand rounded-full"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Cân nặng</span>
          </div>
          <p className="text-xl font-black m-0 text-white">
            {currentWeight > 0 ? `${currentWeight} ` : '-- '}
            <span className="text-xs font-normal text-zinc-500">kg</span>
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase">% Mỡ</span>
          </div>
          <p className="text-xl font-black m-0 text-white">
            {currentFat > 0 ? `${currentFat} ` : '-- '}
            <span className="text-xs font-normal text-zinc-500">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}

