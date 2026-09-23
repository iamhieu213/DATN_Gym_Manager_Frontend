interface PtPackagesTableWidgetProps {
  bookings?: any[];
}

export default function PtPackagesTableWidget({ bookings = [] }: PtPackagesTableWidgetProps) {
  const activeBookings = bookings.filter((b) => b.status === 'ACTIVE' || b.status === 'PENDING');

  return (
    <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col gap-4 box-border backdrop-blur-sm">
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">Gói huấn luyện viên</h3>
        <p className="text-xs text-zinc-400 mt-1">Các gói PT đang hiệu lực</p>
      </div>

      <div className="w-full overflow-x-auto">
        {activeBookings.length > 0 ? (
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800">
                <th className="text-left p-3 font-semibold">Gói tập</th>
                <th className="text-left p-3 font-semibold">Huấn luyện viên</th>
                <th className="text-center p-3 font-semibold">Tổng buổi</th>
                <th className="text-center p-3 font-semibold">Còn lại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {activeBookings.map((item, index) => {
                const packageName = item.ptPackage?.name || item.speciality || 'Gói PT Tập Luyện 1-1';
                const coachName = item.coach?.user?.name || item.coachName || 'Huấn luyện viên';
                const total = item.totalSessions || 12;
                const remaining = item.remainingSessions ?? total;

                return (
                  <tr key={item.id || index} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3 font-semibold text-zinc-200">{packageName}</td>
                    <td className="p-3 text-zinc-400">{coachName}</td>
                    <td className="p-3 text-center text-zinc-300 font-medium">{total}</td>
                    <td className="p-3 text-center text-[#c3f400] font-bold text-sm">{remaining}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-8 px-4 text-center text-zinc-500 text-xs bg-zinc-950/40 rounded-xl border border-dashed border-zinc-800">
            Bạn chưa có gói PT nào đang hiệu lực.
          </div>
        )}
      </div>
    </div>
  );
}
