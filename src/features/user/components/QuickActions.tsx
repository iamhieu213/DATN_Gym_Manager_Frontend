import { ShoppingCart, Edit3, RefreshCw } from 'lucide-react';

const baseButtonClass =
  'group px-5 py-4 rounded-xl border-none font-bold text-sm flex items-center justify-center gap-3 cursor-pointer transition-all font-sans';
const iconClass = 'transition-transform group-hover:scale-110 group-hover:rotate-[8deg]';

export default function QuickActions() {
  return (
    <div className="mt-4 mb-6">
      <h3 className="font-sans text-[11px] font-bold text-zinc-500 uppercase tracking-[0.1em] mb-6">Thao tác nhanh</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <button className={`${baseButtonClass} bg-brand text-black shadow-[0_4px_20px_rgba(195,244,0,0.2)] hover:scale-[1.02] hover:brightness-110`}>
          <ShoppingCart size={18} className={iconClass} />
          Gia hạn/Mua gói tập
        </button>
        <button className={`${baseButtonClass} bg-white/[0.015] backdrop-blur-md text-white border border-white/5 hover:bg-white/5 hover:border-white/10`}>
          <Edit3 size={18} className={iconClass} />
          Cập nhật chỉ số cơ thể
        </button>
        <button className={`${baseButtonClass} bg-white/[0.015] backdrop-blur-md text-white border border-white/5 hover:bg-white/5 hover:border-white/10`}>
          <RefreshCw size={18} className={iconClass} />
          Đổi huấn luyện viên
        </button>
      </div>
    </div>
  );
}
