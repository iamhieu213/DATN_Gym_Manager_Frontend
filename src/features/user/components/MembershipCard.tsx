import { ShieldCheck } from 'lucide-react';
import './MembershipCard.css';

interface MembershipCardProps {
  daysLeft?: number;
  expiredDate?: string;
  packageName?: string;
}

export default function MembershipCard({
  daysLeft = 15,
  expiredDate = '07/11/2023',
  packageName = 'KINETIC PRO ELITE'
}: MembershipCardProps) {
  return (
    <div className="membership-card">
      <div className="widget-header">
        <div>
          <p className="widget-tagline">Gói thành viên hiện tại</p>
          <h3 className="widget-title">{packageName}</h3>
        </div>
        <ShieldCheck className="widget-icon-lime" size={32} />
      </div>
      <div className="progress-box">
        <div className="progress-info">
          <span className="progress-value">Còn {daysLeft} ngày</span>
          <span className="progress-sub">Hết hạn: {expiredDate}</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar-fill" style={{ width: `${(daysLeft / 30) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}
