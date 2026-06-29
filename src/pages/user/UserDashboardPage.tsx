import { useState, useEffect } from 'react';
import PaymentAlert from '../../features/user/components/PaymentAlert';
import MembershipCard from '../../features/user/components/MembershipCard';
import PtSessionCard from '../../features/user/components/PtSessionCard';
import CheckInChart from '../../features/user/components/CheckInChart';
import BodyMetricsChart from '../../features/user/components/BodyMetricsChart';
import QuickActions from '../../features/user/components/QuickActions';
import './UserDashboardPage.css';

export default function UserDashboardPage() {
  const [greeting, setGreeting] = useState('Chào Alex, hôm nay bạn tập gì?');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Chào buổi sáng Alex, tập luyện thôi?');
    } else if (hour > 18) {
      setGreeting('Chào buổi tối Alex, kết thúc ngày thật mạnh nhé!');
    }
  }, []);

  return (
    <div className="dashboard-content-wrapper">
      {/* Cảnh báo nợ phí */}
      <PaymentAlert />

      {/* Chào hỏi */}
      <div className="dashboard-greeting-row">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxO4OlAjvwl5qEztoohbhVpG-tUQ-GjTMUUHxcmQ_wfYdM1f0vVhJrK38vDfnkhvPFXW_qzibllVHSWalEimchiYwyf2P1rCXuGsJXIgrNMieZJ_Vz_e0O50zreKchj5mP9rH3IgBnb789T1MkzF3XTFH0ZN-t2bY-NE6VCGekU7g1YB2MpAhf_osuxkO6TsmA6c3GI1KOfeNDQn8bSD2YKOPeOs46R4gUQyVPalAZSsnTVLOTsTOWoUFjw3o_5XyyQt3uC8ibOnk"
          alt="Alex Rivera"
          className="greeting-avatar"
        />
        <div className="greeting-text">
          <h1 className="welcome-text">{greeting}</h1>
          <p className="welcome-date">THỨ HAI, 23 THÁNG 10</p>
        </div>
      </div>

      {/* Lưới Thông tin chính */}
      <div className="dashboard-grid-primary">
        <MembershipCard />
        <PtSessionCard />
      </div>

      {/* Lưới Biểu đồ */}
      <div className="dashboard-grid-charts">
        <CheckInChart />
        <BodyMetricsChart />
      </div>

      {/* Các thao tác nhanh */}
      <QuickActions />
    </div>
  );
}

