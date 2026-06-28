import './EquipmentStats.css';

interface EquipmentStatsProps {
  total: number;
  operational: number;
  underMaintenance: number;
  outOfService: number;
}

export default function EquipmentStats({
  total,
  operational,
  underMaintenance,
  outOfService
}: EquipmentStatsProps) {
  const loadPercentage = total > 0 ? Math.round((operational / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stats-card">
        <span className="stats-label">Tổng thiết bị</span>
        <div className="stats-value-row">
          <h3 className="stats-val">{total}</h3>
          <span className="status-text color-active">Khả dụng</span>
        </div>
      </div>
      
      <div className="stats-card border-l-active">
        <span className="stats-label">Đang hoạt động tốt</span>
        <div className="stats-value-row">
          <h3 className="stats-val color-active">{operational}</h3>
          <span className="status-text color-gray">Tải công suất {loadPercentage}%</span>
        </div>
      </div>

      <div className="stats-card">
        <span className="stats-label">Đang bảo trì định kỳ</span>
        <div className="stats-value-row">
          <h3 className="stats-val color-warning">{underMaintenance}</h3>
          <span className="status-text color-warning">Không phục vụ tập</span>
        </div>
      </div>

      <div className="stats-card">
        <span className="stats-label">Hỏng hóc / Ngừng hoạt động</span>
        <div className="stats-value-row">
          <h3 className="stats-val color-danger">{outOfService}</h3>
          <span className="status-text color-danger">Dừng hoạt động</span>
        </div>
      </div>
    </div>
  );
}
