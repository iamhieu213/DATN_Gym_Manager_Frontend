import { ShoppingCart, Edit3, RefreshCw } from 'lucide-react';
import './QuickActions.css';

export default function QuickActions() {
  return (
    <div className="quick-actions-section">
      <h3 className="quick-actions-title">Thao tác nhanh</h3>
      <div className="quick-actions-grid">
        <button className="btn-quick-action primary">
          <ShoppingCart size={18} />
          Gia hạn/Mua gói tập
        </button>
        <button className="btn-quick-action secondary">
          <Edit3 size={18} />
          Cập nhật chỉ số cơ thể
        </button>
        <button className="btn-quick-action secondary">
          <RefreshCw size={18} />
          Đổi huấn luyện viên
        </button>
      </div>
    </div>
  );
}
