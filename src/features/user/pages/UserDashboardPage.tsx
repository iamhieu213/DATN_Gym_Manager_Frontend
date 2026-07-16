import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PaymentAlert from '../components/PaymentAlert';
import MembershipCard from '../components/MembershipCard';
import PtSessionCard from '../components/PtSessionCard';
import CheckInChart from '../components/CheckInChart';
import BodyMetricsChart from '../components/BodyMetricsChart';
import QuickActions from '../components/QuickActions';
import './UserDashboardPage.css';
import { getMyProfile } from '../../auth/services/authApi';
import { getBodyMetricsHistory, getCheckInHistory, getPaymentHistory } from '../services/userApi';
import { getActiveMembership } from '../services/membershipApi';
import { getMyActiveCoach } from '../services/ptBookingApi';


export default function UserDashboardPage() {
  const [userName, setUserName] = useState<string>('');
  const [membership, setMembership] = useState<any>(null);
  const [ptSession, setPtSession] = useState<any>(null);

  // Nhận kết quả thanh toán từ VNPAY redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      Swal.fire({
        title: 'Thanh toán thành công!',
        text: 'Gói dịch vụ của bạn đã được kích hoạt trực tuyến thành công.',
        icon: 'success',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#c3f400',
        customClass: { confirmButton: 'text-black font-bold' }
      });
      // Xóa query param để khi reload trang không hiện lại alert
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Gọi các API đồng thời khi component mount
  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      getMyProfile(),
      getActiveMembership(),
      getMyActiveCoach(),
      getCheckInHistory({ page: 1, limit: 7 }), // Lấy 7 lượt gần nhất cho biểu đồ
      getBodyMetricsHistory(),
      getPaymentHistory()
    ]).then((results) => {
      // 1. Thông tin cá nhân
      if (results[0].status === 'fulfilled' && results[0].value.success) {
        setUserName(results[0].value.data?.name || '');
      }
      // 2. Gói thành viên hoạt động
      if (results[1].status === 'fulfilled' && results[1].value.success) {
        setMembership(results[1].value.data);
      }
      // 3. PT hoạt động
      if (results[2].status === 'fulfilled' && results[2].value.success) {
        setPtSession(results[2].value.data);
      }
      // 4. Lịch sử check-in
      if (results[3].status === 'fulfilled' && results[3].value.success) {
        setCheckIns(results[3].value.data || []);
      }
      // 5. Chỉ số sức khỏe cơ thể
      if (results[4].status === 'fulfilled' && results[4].value.success) {
        setMetrics(results[4].value.data || []);
      }
      // 6. Lịch sử hóa đơn
      if (results[5].status === 'fulfilled' && results[5].value.success) {
        setPayments(results[5].value.data || []);
      }
    }).catch((err) => {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const getGreeting = () => {
    const name = userName || 'bạn';
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
    const month = now.getMonth() + 1;
    return `${dayName}, ${date} THÁNG ${month}`;
  };

  if (loading) {
    return (
      <div className="dashboard-loading-spinner" style={{ padding: '40px', textAlign: 'center', color: '#fff' }}>
        Đang tải thông tin Dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-content-wrapper">
      {/* Cảnh báo nợ phí */}
      <PaymentAlert payments={payments} />

      {/* Chào hỏi */}
      <div className="dashboard-greeting-row">
        <div className="greeting-text">
          <h1 className="welcome-text">{getGreeting()}</h1>
          <p className="welcome-date">{getFormattedDate()}</p>
        </div>
      </div>

      {/* Lưới Thông tin chính */}
      <div className="dashboard-grid-primary">
        <MembershipCard membership={membership} />
        <PtSessionCard ptSession={ptSession} />
      </div>

      {/* Lưới Biểu đồ */}
      <div className="dashboard-grid-charts">
        <CheckInChart checkIns={checkIns} />
        <BodyMetricsChart metrics={metrics} />
      </div>

      {/* Các thao tác nhanh */}
      <QuickActions />
    </div>
  );
}


