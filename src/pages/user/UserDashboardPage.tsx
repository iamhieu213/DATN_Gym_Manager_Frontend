import { useState, useEffect } from 'react';
import PaymentAlert from '../../features/user/components/PaymentAlert';
import MembershipCard from '../../features/user/components/MembershipCard';
import PtSessionCard from '../../features/user/components/PtSessionCard';
import CheckInChart from '../../features/user/components/CheckInChart';
import BodyMetricsChart from '../../features/user/components/BodyMetricsChart';
import QuickActions from '../../features/user/components/QuickActions';
import './UserDashboardPage.css';
import { getMyProfile } from '../../features/auth/services/authApi';

export default function UserDashboardPage() {
  const [userName, setUserName] = useState<string>('');

  // 1. Gọi API lấy thông tin người dùng đăng nhập khi component mount
  useEffect(() => {
    getMyProfile()
      .then((res: any) => {
        if (res.success && res.data?.name) {
          setUserName(res.data.name);
        }
      })
      .catch((err: any) => {
        console.error("Lỗi khi tải thông tin cá nhân:", err);
      });
  }, []);

  const getGreeting = () => {
    const name = userName || 'bạn'; // Fallback nếu chưa tải xong tên hoặc không có tên
    const hour = new Date().getHours();
    if (hour < 12) {
      return `Chào buổi sáng ${name}, tập luyện thôi?`;
    } else if (hour > 18) {
      return `Chào buổi tối ${name}, kết thúc ngày thật mạnh nhé!`;
    }
    return `Chào ${name}, hôm nay bạn tập gì?`;
  };

  const getFormattedDate = () => {
    const days = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];
    const now = new Date();
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = now.getMonth() + 1; // getMonth() bắt đầu từ 0
    return `${dayName}, ${date} THÁNG ${month}`;
  };



  return (
    <div className="dashboard-content-wrapper">
      {/* Cảnh báo nợ phí */}
      <PaymentAlert />

      {/* Chào hỏi */}
      <div className="dashboard-greeting-row">
        <div className="greeting-text">
          <h1 className="welcome-text">{getGreeting()}</h1>
          <p className="welcome-date">{getFormattedDate()}</p>
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

