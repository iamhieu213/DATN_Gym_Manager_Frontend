import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PaymentAlert from '../components/PaymentAlert';
import PhysicalMembershipCard from '../components/PhysicalMembershipCard';
import WeatherWidget from '../components/WeatherWidget';
import StatsSummaryWidget from '../components/StatsSummaryWidget';
import PtPackagesTableWidget from '../components/PtPackagesTableWidget';
import UpcomingScheduleWidget from '../components/UpcomingScheduleWidget';
import BodyMetricsGraphWidget from '../components/BodyMetricsGraphWidget';
import CheckInHeatmapWidget from '../components/CheckInHeatmapWidget';

import { getMyProfile } from '../../auth/services/authApi';
import { getBodyMetricsHistory, getCheckInHistory, getPaymentHistory } from '../services/userApi';
import { getActiveMembership } from '../services/membershipApi';
import { getMyActiveCoach, getMyBookings } from '../services/ptBookingApi';

export default function UserDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [ptBookings, setPtBookings] = useState<any[]>([]);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'success') {
      Swal.fire({
        title: 'Thanh toán thành công!',
        text: 'Gói dịch vụ của bạn đã được kích hoạt trực tuyến thành công.',
        icon: 'success',
        background: '#18181b',
        color: '#ffffff',
        confirmButtonColor: '#c3f400',
        customClass: { confirmButton: 'text-black font-bold' }
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      getMyProfile(),
      getActiveMembership(),
      getMyBookings(),
      getCheckInHistory({ page: 1, limit: 500 }),
      getBodyMetricsHistory(),
      getPaymentHistory()
    ])
      .then((results) => {
        if (results[0].status === 'fulfilled' && results[0].value?.success) {
          setProfile(results[0].value.data);
        }
        if (results[1].status === 'fulfilled' && results[1].value?.success) {
          setMembership(results[1].value.data);
        }
        if (results[2].status === 'fulfilled' && results[2].value?.success) {
          const bData = results[2].value.data;
          setPtBookings(Array.isArray(bData) ? bData : bData ? [bData] : []);
        } else {
          getMyActiveCoach().then((res) => {
            if (res?.success && res.data) {
              setPtBookings([res.data]);
            }
          });
        }
        if (results[3].status === 'fulfilled' && results[3].value?.success) {
          setCheckIns(results[3].value.data || []);
        }
        if (results[4].status === 'fulfilled' && results[4].value?.success) {
          setMetrics(results[4].value.data || []);
        }
        if (results[5].status === 'fulfilled' && results[5].value?.success) {
          setPayments(results[5].value.data || []);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 min-h-[400px] text-zinc-400 text-sm">
        <div className="w-8 h-8 border-3 border-zinc-700 border-t-[#c3f400] rounded-full animate-spin" />
        <span>Đang tải thông tin Tổng quan Hội viên...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-8 w-full box-border text-white">
      {/* Payment Alert if unpaid invoices exist */}
      {payments.length > 0 && <PaymentAlert payments={payments} />}

      {/* Row 1: Thẻ tập của bạn (35%) & Dự báo thời tiết (65%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 items-stretch min-w-0 w-full overflow-hidden">
        <div className="h-full min-w-0">
          <PhysicalMembershipCard
            userName={profile?.name}
            userId={profile?.id}
            membership={membership}
          />
        </div>
        <div className="h-full min-w-0 overflow-hidden">
          <WeatherWidget />
        </div>
      </div>

      {/* Row 2: Stats & Gói PT (Left 50%) | Lịch tập sắp tới (Right 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="flex flex-col gap-5">
          <StatsSummaryWidget membership={membership} checkIns={checkIns} />
          <PtPackagesTableWidget bookings={ptBookings} />
        </div>

        <div className="h-full">
          <UpcomingScheduleWidget />
        </div>
      </div>

      {/* Row 3: Chỉ số cơ thể của bạn (Line Chart) */}
      <div className="flex flex-col w-full">
        <BodyMetricsGraphWidget metrics={metrics} />
      </div>

      {/* Row 4: Lịch check-in (Contribution Heatmap) */}
      <div className="flex flex-col w-full">
        <CheckInHeatmapWidget checkIns={checkIns} />
      </div>
    </div>
  );
}
