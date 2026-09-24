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

  const cardClass =
    'bg-white/[1.5%] border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 transition-[transform,border-color] duration-300 hover:-translate-y-1';

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className={cardClass}>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tổng thiết bị</span>
        <div className="flex items-end gap-2 mt-4">
          <h3 className="text-3xl font-black text-white m-0 leading-none">{total}</h3>
          <span className="text-xs font-bold text-brand">Khả dụng</span>
        </div>
      </div>

      <div className={`${cardClass} border-l-2 border-l-brand`}>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Đang hoạt động tốt</span>
        <div className="flex items-end gap-2 mt-4">
          <h3 className="text-3xl font-black text-brand m-0 leading-none">{operational}</h3>
          <span className="text-xs font-semibold text-zinc-500">Tải công suất {loadPercentage}%</span>
        </div>
      </div>

      <div className={cardClass}>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Đang bảo trì định kỳ</span>
        <div className="flex items-end gap-2 mt-4">
          <h3 className="text-3xl font-black text-amber-400 m-0 leading-none">{underMaintenance}</h3>
          <span className="text-xs font-semibold text-amber-400">Không phục vụ tập</span>
        </div>
      </div>

      <div className={cardClass}>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hỏng hóc / Ngừng hoạt động</span>
        <div className="flex items-end gap-2 mt-4">
          <h3 className="text-3xl font-black text-red-500 m-0 leading-none">{outOfService}</h3>
          <span className="text-xs font-bold text-red-500">Dừng hoạt động</span>
        </div>
      </div>
    </div>
  );
}
