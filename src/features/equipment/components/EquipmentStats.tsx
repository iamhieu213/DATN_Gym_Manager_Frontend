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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 hover:-translate-y-1 transition-all duration-300">
        <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Tổng thiết bị</span>
        <div className="flex items-baseline gap-2 mt-4">
          <h3 className="text-3xl font-black text-white">{total}</h3>
          <span className="text-[#c3f400] text-xs font-bold">Khả dụng</span>
        </div>
      </div>
      
      <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 border-l-2 border-l-[#c3f400] hover:-translate-y-1 transition-all duration-300">
        <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Đang hoạt động tốt</span>
        <div className="flex items-baseline gap-2 mt-4">
          <h3 className="text-3xl font-black text-[#c3f400]">{operational}</h3>
          <span className="text-[#71717a] text-xs font-semibold">Tải công suất {loadPercentage}%</span>
        </div>
      </div>

      <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 hover:-translate-y-1 transition-all duration-300">
        <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Đang bảo trì định kỳ</span>
        <div className="flex items-baseline gap-2 mt-4">
          <h3 className="text-3xl font-black text-amber-400">{underMaintenance}</h3>
          <span className="text-amber-400 text-xs font-semibold">Không phục vụ tập</span>
        </div>
      </div>

      <div className="bg-white/1.5 border border-white/5 rounded-xl p-6 flex flex-col justify-between min-h-35 hover:-translate-y-1 transition-all duration-300">
        <span className="text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Hỏng hóc / Ngừng hoạt động</span>
        <div className="flex items-baseline gap-2 mt-4">
          <h3 className="text-3xl font-black text-red-500">{outOfService}</h3>
          <span className="text-red-500 text-xs font-bold">Dừng hoạt động</span>
        </div>
      </div>
    </div>
  );
}
