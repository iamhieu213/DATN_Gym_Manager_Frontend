import { ShieldCheck } from 'lucide-react';
import './MembershipCard.css';

interface MembershipCardProps {
  membership?: any;
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  if (!membership) {
    return (
      <div className="membership-card">
        <div className="widget-header">
          <div>
            <p className="widget-tagline">Gói thành viên hiện tại</p>
            <h3 className="widget-title">Chưa đăng ký gói tập</h3>
          </div>
          <ShieldCheck className="widget-icon-lime" style={{ opacity: 0.5 }} size={32} />
        </div>
        <div className="progress-box">
          <div className="progress-info">
            <span className="progress-value">Không hoạt động</span>
            <span className="progress-sub">Vui lòng đăng ký gói thành viên để bắt đầu</span>
          </div>
          <div className="progress-track">
            <div className="progress-bar-fill" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const { plan, end_date } = membership;
  const expiredDate = new Date(end_date);
  
  // Tính số ngày còn lại động
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = expiredDate.getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const formattedExpiredDate = expiredDate.toLocaleDateString('vi-VN');
  
  // Giả sử thời hạn tối đa của gói hiển thị tiến trình là 30 ngày (hoặc lấy từ plan.duration_days nếu có)
  const totalDays = plan?.duration_days || 30;
  const progressPercent = Math.min(100, Math.max(0, (daysLeft / totalDays) * 100));

  return (
    <div className="membership-card">
      <div className="widget-header">
        <div>
          <p className="widget-tagline">Gói thành viên hiện tại</p>
          <h3 className="widget-title">{plan?.name || 'KINETIC PRO ELITE'}</h3>
        </div>
        <ShieldCheck className="widget-icon-lime" size={32} />
      </div>
      <div className="progress-box">
        <div className="progress-info">
          <span className="progress-value">{daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn'}</span>
          <span className="progress-sub">Hết hạn: {formattedExpiredDate}</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  );
}

