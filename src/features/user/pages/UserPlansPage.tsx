import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  CreditCard,
  Users,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowUpRight,
  ArrowLeft,
  Calendar,
  Clock,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import './UserPlansPage.animations.css';

// Import các API từ các file phân tách
import { getPlansList, buyMembership } from '../services/membershipApi';
import { getCoachesList, getCoachDetail, hirePT } from '../services/ptBookingApi';
import apiClient from '../../auth/services/apiClient';

interface CoachItem {
  id: number;
  speciality: string | null;
  bio: string | null;
  user: {
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  } | null;
}

// ---- Class tiện ích dùng cho thẻ lựa chọn phương thức thanh toán (SweetAlert2) ----
// Vì SweetAlert2 render HTML bằng chuỗi (không phải JSX) nên các class Tailwind
// được khai báo dạng literal string ở đây để build-time scanner của Tailwind
// vẫn nhận diện và sinh CSS tương ứng. Trạng thái "đang chọn" được điều khiển
// hoàn toàn bằng vanilla JS (classList / className) trong didOpen/preConfirm.
const PAYMENT_CARD_BASE =
  'flex items-center gap-4 rounded-[10px] border p-4 cursor-pointer transition-all duration-[250ms] ease-in-out select-none';
const PAYMENT_CARD_SELECTED = `payment-option-card selected ${PAYMENT_CARD_BASE} bg-brand/6 border-brand shadow-[0_0_15px_rgba(195,244,0,0.05)]`;
const PAYMENT_CARD_UNSELECTED = `payment-option-card ${PAYMENT_CARD_BASE} bg-white/2 border-white/6 hover:bg-white/4 hover:border-white/12`;

const PAYMENT_CIRCLE_BASE =
  'w-5 h-5 rounded-full border-2 relative shrink-0 transition-all duration-200 flex items-center justify-center';
const PAYMENT_CIRCLE_SELECTED = `payment-option-circle ${PAYMENT_CIRCLE_BASE} border-brand`;
const PAYMENT_CIRCLE_UNSELECTED = `payment-option-circle ${PAYMENT_CIRCLE_BASE} border-white/20`;

export default function UserPlansPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'coaches'>('plans');

  // States bộ lọc PT
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<number | ''>('');
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');

  // States phân trang
  const [plansPage, setPlansPage] = useState<number>(1);
  const [plansTotalPages, setPlansTotalPages] = useState<number>(1);

  const [coachPage, setCoachPage] = useState<number>(1);
  const [coachTotalPages, setCoachTotalPages] = useState<number>(1);

  // States dữ liệu danh sách từ API
  const [plans, setPlans] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<CoachItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States quản lý View chi tiết PT
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const [coachDetail, setCoachDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // States quản lý Modal và thanh toán
  const [coachPackages, setCoachPackages] = useState<any[]>([]);

  // Danh sách các khung giờ lựa chọn cho bộ lọc
  const timeOptions = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00'
  ];

  // Thứ trong tuần map
  const daysOfWeekMap = [
    { value: 1, label: 'Thứ Hai' },
    { value: 2, label: 'Thứ Ba' },
    { value: 3, label: 'Thứ Tư' },
    { value: 4, label: 'Thứ Năm' },
    { value: 5, label: 'Thứ Sáu' },
    { value: 6, label: 'Thứ Bảy' },
    { value: 0, label: 'Chủ Nhật' }
  ];

  // Reset trang HLV về 1 khi người dùng thay đổi bất kỳ bộ lọc nào
  useEffect(() => {
    setCoachPage(1);
  }, [selectedGoal, selectedDay, selectedStartTime, selectedEndTime]);

  // Nhận kết quả thanh toán thất bại/lỗi từ VNPAY redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    if (paymentStatus === 'failed' || paymentStatus === 'error') {
      Swal.fire({
        title: 'Thanh toán thất bại',
        text: 'Giao dịch trực tuyến của bạn đã bị hủy hoặc gặp sự cố.',
        icon: 'error',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
      // Xóa query param để khi reload trang không hiện lại alert
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 1. Tải danh sách Gói tập khi vào trang hoặc chuyển trang gói tập
  useEffect(() => {
    setLoading(true);
    getPlansList({ page: plansPage, limit: 3 })
      .then((res) => {
        if (res.success) {
          setPlans(res.data || []);
          setPlansTotalPages(res.meta?.totalPages || 1);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải gói tập:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [plansPage]);

  // 1b. Tải danh sách HLV khi tab coaches hoạt động hoặc khi thay đổi bất kỳ bộ lọc/trang nào
  useEffect(() => {
    if (activeTab === 'coaches' && selectedCoachId === null) {
      const params: any = {};
      if (selectedGoal) params.goal = selectedGoal;
      if (selectedDay !== '') params.dayOfWeek = Number(selectedDay);
      if (selectedStartTime) params.startTime = selectedStartTime;
      if (selectedEndTime) params.endTime = selectedEndTime;
      params.page = coachPage;
      params.limit = 8; // 8 PT mỗi trang hiển thị rất cân đối

      getCoachesList(params)
        .then((res) => {
          if (res.success) {
            setCoaches(res.data || []);
            setCoachTotalPages(res.meta?.totalPages || 1);
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải danh sách HLV:", err);
        });
    }
  }, [activeTab, selectedGoal, selectedDay, selectedStartTime, selectedEndTime, coachPage, selectedCoachId]);

  // 1c. Tải chi tiết HLV khi nhấn chọn xem chi tiết
  useEffect(() => {
    if (selectedCoachId !== null) {
      setDetailLoading(true);
      getCoachDetail(selectedCoachId)
        .then((res) => {
          if (res.success) {
            setCoachDetail(res.data);
            setCoachPackages(res.data.packages || []);
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải chi tiết HLV:", err);
        })
        .finally(() => {
          setDetailLoading(false);
        });
    } else {
      setCoachDetail(null);
      setCoachPackages([]);
    }
  }, [selectedCoachId]);

  // Hàm hiển thị hộp thoại chọn phương thức thanh toán dạng Card
  const showPaymentSelector = async (title: string, confirmText: string) => {
    return Swal.fire({
      title,
      html: `
        <div class="flex flex-col gap-3 pt-4 pb-2 px-0 text-left">
          <div id="pay-vnpay" class="${PAYMENT_CARD_SELECTED}" data-value="VNPAY">
            <div class="${PAYMENT_CIRCLE_SELECTED}">
              <div class="payment-option-dot w-3 h-3 rounded-full bg-brand"></div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-[750] text-sm text-white">Cổng thanh toán trực tuyến VNPAY</span>
              <span class="payment-option-sub text-[11px] leading-[1.4] text-zinc-400">Thanh toán an toàn qua Thẻ ATM, QR Code, Mobile Banking</span>
            </div>
          </div>
          <div id="pay-cash" class="${PAYMENT_CARD_UNSELECTED}" data-value="CASH">
            <div class="${PAYMENT_CIRCLE_UNSELECTED}">
              <div class="payment-option-dot w-3 h-3 rounded-full bg-brand hidden"></div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="font-[750] text-sm text-white">Thanh toán tiền mặt</span>
              <span class="payment-option-sub text-[11px] leading-[1.4] text-zinc-500">Đóng phí trực tiếp tại quầy lễ tân của chi nhánh</span>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'Hủy',
      background: '#18181b',
      color: '#fff',
      customClass: {
        confirmButton: '!bg-gradient-to-br !from-brand !to-[#a2cb00] !text-black !text-sm !font-extrabold !tracking-wider !py-3.5 !px-7 !rounded-md !shadow-[0_4px_15px_rgba(195,244,0,0.2)] !transition-all hover:!shadow-[0_8px_20px_rgba(195,244,0,0.4)] hover:!scale-[1.02] !mt-2.5',
        cancelButton: '!bg-zinc-800 !text-white !text-sm !font-bold !py-3.5 !px-7 !rounded-md !transition-all hover:!bg-zinc-700 !mt-2.5',
        popup: '!bg-gradient-to-br !from-zinc-900 !to-[#0e0e10] !border !border-white/8 !rounded-2xl !shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_0_40px_rgba(195,244,0,0.04)] !py-8 !px-6',
        title: '!text-white !text-xl !font-extrabold !tracking-[-0.02em] !mb-2'
      },
      didOpen: () => {
        const vnpayBtn = document.getElementById('pay-vnpay');
        const cashBtn = document.getElementById('pay-cash');

        const applySelectedState = (target: HTMLElement, other: HTMLElement) => {
          target.className = PAYMENT_CARD_SELECTED;
          other.className = PAYMENT_CARD_UNSELECTED;

          const targetCircle = target.querySelector('.payment-option-circle');
          const otherCircle = other.querySelector('.payment-option-circle');
          if (targetCircle) targetCircle.className = PAYMENT_CIRCLE_SELECTED;
          if (otherCircle) otherCircle.className = PAYMENT_CIRCLE_UNSELECTED;

          const targetDot = target.querySelector('.payment-option-dot');
          const otherDot = other.querySelector('.payment-option-dot');
          targetDot?.classList.remove('hidden');
          otherDot?.classList.add('hidden');

          const targetSub = target.querySelector('.payment-option-sub');
          const otherSub = other.querySelector('.payment-option-sub');
          targetSub?.classList.remove('text-zinc-500');
          targetSub?.classList.add('text-zinc-400');
          otherSub?.classList.remove('text-zinc-400');
          otherSub?.classList.add('text-zinc-500');
        };

        if (vnpayBtn && cashBtn) {
          vnpayBtn.addEventListener('click', () => applySelectedState(vnpayBtn, cashBtn));
          cashBtn.addEventListener('click', () => applySelectedState(cashBtn, vnpayBtn));
        }
      },
      preConfirm: () => {
        const vnpayBtn = document.getElementById('pay-vnpay');
        const cashBtn = document.getElementById('pay-cash');
        const activeBtn = vnpayBtn?.classList.contains('selected')
          ? vnpayBtn
          : (cashBtn?.classList.contains('selected') ? cashBtn : null);
        if (!activeBtn) {
          Swal.showValidationMessage('Vui lòng chọn phương thức thanh toán!');
          return false;
        }
        return activeBtn.getAttribute('data-value');
      }
    });
  };

  // Xử lý logic Mua gói tập thành viên
  const handleSelectPlan = async (plan: any) => {
    const { value: paymentMethod } = await showPaymentSelector('Chọn phương thức thanh toán', 'Xác nhận mua');

    if (!paymentMethod) return;

    try {
      Swal.showLoading();
      const res = await buyMembership({ planId: plan.id, paymentMethod });

      if (res.success) {
        const { paymentId } = res.data;

        if (paymentMethod === 'VNPAY') {
          const payRes = await apiClient.post(`/payments/${paymentId}/pay`);
          if (payRes.data?.success && payRes.data?.data?.paymentUrl) {
            window.location.href = payRes.data.data.paymentUrl;
          } else {
            throw new Error("Không thể khởi tạo link thanh toán VNPAY.");
          }
        } else {
          Swal.fire({
            title: 'Đăng ký thành công!',
            text: 'Hệ thống đã ghi nhận yêu cầu. Vui lòng đến quầy lễ tân đóng phí để kích hoạt gói tập.',
            icon: 'success',
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#c3f400',
            customClass: { confirmButton: 'text-black font-bold' }
          });
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: 'Thất bại',
        text: err.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký.',
        icon: 'error',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#c3f400',
        customClass: { confirmButton: 'text-black font-bold' }
      });
    }
  };

  // Xử lý mở Modal Thuê PT trực tiếp
  const handleOpenHireModal = async (coach: CoachItem) => {
    setSelectedCoachId(coach.id); // Chuyển sang View Chi Tiết HLV
  };

  // Xử lý gửi yêu cầu đăng ký thuê PT (Dùng ở cả Modal và Trang Chi Tiết)
  const handleConfirmHirePT = async (coachId: number, ptPackageId: number) => {
    const { value: paymentMethod } = await showPaymentSelector('Chọn phương thức thanh toán', 'Đăng ký thuê HLV');

    if (!paymentMethod) return;

    try {
      Swal.showLoading();
      const res = await hirePT({
        coachId,
        ptPackageId,
        paymentMethod
      });

      if (res.success) {
        const { paymentId } = res.data;

        if (paymentMethod === 'VNPAY') {
          const payRes = await apiClient.post(`/payments/${paymentId}/pay`);
          if (payRes.data?.success && payRes.data?.data?.paymentUrl) {
            window.location.href = payRes.data.data.paymentUrl;
          } else {
            throw new Error("Không thể khởi tạo link thanh toán VNPAY.");
          }
        } else {
          Swal.fire({
            title: 'Hợp đồng đã khởi tạo!',
            text: 'Yêu cầu thuê HLV đã hoàn tất. Vui lòng đóng phí tại quầy lễ tân chi nhánh để kích hoạt hợp đồng tập luyện.',
            icon: 'success',
            background: '#18181b',
            color: '#fff',
            confirmButtonColor: '#c3f400',
            customClass: { confirmButton: 'text-black font-bold' }
          });
        }
      }
    } catch (err: any) {
      Swal.fire({
        title: 'Thất bại',
        text: err.response?.data?.message || 'Không thể đăng ký thuê PT lúc này.',
        icon: 'error',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#c3f400',
        customClass: { confirmButton: 'text-black font-bold' }
      });
    }
  };

  if (loading) {
    return (
      <div className="py-20 uppercase text-center text-white tracking-[0.1em]">
        Đang tải thông tin dịch vụ...
      </div>
    );
  }

  // Helper chuyển đổi thứ số sang nhãn chữ
  const getDayOfWeekLabel = (day: number) => {
    if (day === 0) return 'Chủ Nhật';
    return `Thứ ${day + 1}`;
  };

  return (
    <div className="flex flex-col gap-9 box-border">
      {/* ----------------- VIEW 1: TRANG CHI TIẾT PT ----------------- */}
      {selectedCoachId !== null ? (
        <div className="flex flex-col gap-7">
          {/* Nút quay lại */}
          <button
            onClick={() => setSelectedCoachId(null)}
            className="self-start bg-white/2 border border-white/6 text-zinc-400 py-2.5 px-5 rounded-full text-[11px] font-extrabold tracking-[0.08em] cursor-pointer flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/8 hover:border-white/20 hover:text-white hover:-translate-x-1"
          >
            <ArrowLeft size={16} />
            <span>QUAY LẠI DANH SÁCH</span>
          </button>

          {detailLoading || !coachDetail ? (
            <div className="text-center py-15 text-zinc-400">
              Đang tải chi tiết hồ sơ PT...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 min-[992px]:grid-cols-[320px_1fr]">
              {/* Cột trái: Avatar & Thông tin chung */}
              <div className="group relative flex flex-col gap-6 self-start overflow-hidden rounded-2xl border border-white/6 py-8 px-6 backdrop-blur-xl bg-gradient-to-br from-[rgba(28,27,27,0.75)] to-[rgba(18,18,18,0.95)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:p-px before:pointer-events-none before:bg-gradient-to-br before:from-white/10 before:to-white/0 before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/8">
                  <img
                    src={coachDetail.user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                    alt={coachDetail.user?.name}
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 z-2 bg-brand/15 border border-brand/40 text-brand text-[9px] font-extrabold py-1 px-2.5 rounded tracking-[0.05em] uppercase">{coachDetail.speciality || 'FITNESS'}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-black text-white m-0 tracking-[-0.02em]">{coachDetail.user?.name}</h2>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-brand">
                    <Star size={16} fill="currentColor" className="text-brand" />
                    <span>4.9 / 5.0 (Đánh giá học viên)</span>
                  </div>
                  <div className="border-t border-white/6 pt-4 mt-1 flex flex-col gap-2.5">
                    <p className="m-0 text-[13px] text-zinc-400 break-all"><strong className="text-zinc-200 font-semibold">Email:</strong> {coachDetail.user?.email}</p>
                    {coachDetail.user?.phone && <p className="m-0 text-[13px] text-zinc-400 break-all"><strong className="text-zinc-200 font-semibold">Điện thoại:</strong> {coachDetail.user?.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Cột phải: Bio, Lịch biểu & Các gói tập */}
              <div className="flex flex-col gap-7">
                {/* Khối 1: Tiểu sử */}
                <div className="relative flex flex-col gap-5 rounded-2xl border border-white/5 p-8 backdrop-blur-xl bg-gradient-to-br from-[rgba(28,27,27,0.6)] to-[rgba(18,18,18,0.8)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:p-px before:pointer-events-none before:bg-gradient-to-br before:from-white/8 before:to-white/0 before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]">
                  <h3 className="text-base font-extrabold text-white m-0 tracking-[0.02em] flex items-center gap-2.5">
                    <Briefcase size={18} className="text-brand" />
                    TIỂU SỬ & KINH NGHIỆM
                  </h3>
                  <p className="text-sm leading-[1.7] text-zinc-400 m-0 whitespace-pre-line">{coachDetail.bio || 'Chưa có thông tin giới thiệu chi tiết từ HLV.'}</p>
                </div>

                {/* Khối 2: Lịch rảnh hàng tuần */}
                <div className="relative flex flex-col gap-5 rounded-2xl border border-white/5 p-8 backdrop-blur-xl bg-gradient-to-br from-[rgba(28,27,27,0.6)] to-[rgba(18,18,18,0.8)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:p-px before:pointer-events-none before:bg-gradient-to-br before:from-white/8 before:to-white/0 before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]">
                  <h3 className="text-base font-extrabold text-white m-0 tracking-[0.02em] flex items-center gap-2.5">
                    <Calendar size={18} className="text-brand" />
                    LỊCH LÀM VIỆC RẢNH HÀNG TUẦN
                  </h3>
                  {coachDetail.availabilities && coachDetail.availabilities.length > 0 ? (
                    <div className="grid grid-cols-1 min-[576px]:grid-cols-2 md:grid-cols-3 gap-3">
                      {coachDetail.availabilities.map((slot: any, idx: number) => (
                        <div key={idx} className="bg-white/2 border border-white/6 rounded-lg py-3.5 px-[18px] flex flex-col gap-1.5">
                          <span className="text-[13px] font-extrabold text-white">{getDayOfWeekLabel(slot.dayOfWeek)}</span>
                          <span className="flex items-center gap-1.5 text-xs text-brand font-semibold">
                            <Clock size={12} />
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-[13px] m-0">
                      Huấn luyện viên chưa đăng ký lịch biểu rảnh cố định.
                    </p>
                  )}
                </div>

                {/* Khối 3: Bảng giá dịch vụ PT 1-1 */}
                <div className="relative flex flex-col gap-5 rounded-2xl border border-white/5 p-8 backdrop-blur-xl bg-gradient-to-br from-[rgba(28,27,27,0.6)] to-[rgba(18,18,18,0.8)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:p-px before:pointer-events-none before:bg-gradient-to-br before:from-white/8 before:to-white/0 before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]">
                  <h3 className="text-base font-extrabold text-white m-0 tracking-[0.02em] flex items-center gap-2.5">
                    <CreditCard size={18} className="text-brand" />
                    BẢNG GIÁ & ĐĂNG KÝ GÓI COMBO
                  </h3>

                  {coachPackages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {coachPackages.map((item) => (
                        <div key={item.ptPackageId} className="group relative flex flex-col gap-4 rounded-xl border border-white/6 bg-white/2 p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-brand/2 hover:border-brand/30 hover:-translate-y-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-[15px] font-extrabold text-white m-0 leading-[1.3]">Gói {item.ptPackage?.name || `Combo ${item.ptPackage?.numberOfSessions} buổi`}</h4>
                            <span className="bg-brand/10 border border-brand/20 text-brand text-[10px] font-extrabold py-0.5 px-2 rounded uppercase shrink-0">{item.ptPackage?.numberOfSessions} Buổi</span>
                          </div>
                          <p className="text-xs text-zinc-500 m-0">Thời hạn: {item.ptPackage?.durationDays} ngày tập luyện</p>
                          <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/4">
                            <span className="text-lg font-black text-brand [text-shadow:0_0_10px_rgba(195,244,0,0.1)]">{Number(item.price).toLocaleString('vi-VN')}đ</span>
                            <button
                              onClick={() => handleConfirmHirePT(coachDetail.id, item.ptPackageId)}
                              className="bg-white text-black border-none text-[11px] font-extrabold py-2 px-4 rounded cursor-pointer tracking-wider transition-all duration-300 ease-[ease] group-hover:bg-brand group-hover:shadow-[0_0_12px_rgba(195,244,0,0.3)] hover:scale-105"
                            >
                              ĐĂNG KÝ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-[30px] text-red-500 text-[13px] font-medium border border-dashed border-red-500/20 rounded-lg bg-red-500/2">
                      Huấn luyện viên hiện chưa thiết lập bảng giá cho các combo tập luyện!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // ----------------- VIEW 2: TRANG DANH SÁCH GÓI & PT CHUNG -----------------
        <>
          {/* Hero Section */}
          <section className="flex flex-col gap-4 max-w-[850px] relative">
            <div className="self-start bg-brand/8 border border-brand/30 text-brand text-[11px] font-extrabold py-1.5 px-3.5 rounded-full tracking-[0.12em] uppercase flex items-center gap-1.5 animate-[pulseNeon_2s_infinite_ease-in-out]">
              <Sparkles size={12} className="fill-current" />
              <span>DỊCH VỤ KINETIC ELITE</span>
            </div>
            <h3 className="text-4xl md:text-[54px] font-black tracking-[-0.04em] uppercase text-white m-0 leading-[1.1]">
              Thiết Lập Lộ Trình <span className="bg-gradient-to-br from-brand to-brand bg-clip-text text-transparent">Hiệu Suất</span>
            </h3>
            <p className="text-base leading-[1.7] text-zinc-400 m-0">
              Bứt phá giới hạn thể hình của bạn. Lựa chọn một gói thành viên phù hợp để vào tập luyện tự do hoặc thuê riêng một Huấn luyện viên cá nhân (PT) bậc thầy để dẫn dắt lộ trình tập luyện 1-1 tối ưu nhất.
            </p>
          </section>

          {/* Header Tabs & Filter Row */}
          <div className="flex justify-between items-center gap-5 flex-wrap">
            <div className="flex bg-[rgba(30,30,30,0.5)] border border-zinc-800 rounded-full p-1.5 self-start gap-2">
              <button
                onClick={() => setActiveTab('plans')}
                className={`bg-transparent border-none text-zinc-500 text-sm font-bold py-2.5 px-6 rounded-full cursor-pointer flex items-center gap-2 transition-all duration-300 ease-in-out hover:text-white ${activeTab === 'plans' ? 'bg-brand text-black shadow-[0_4px_15px_rgba(195,244,0,0.3)]' : ''}`}
              >
                <CreditCard size={16} />
                Gói Thành Viên
              </button>
              <button
                onClick={() => setActiveTab('coaches')}
                className={`bg-transparent border-none text-zinc-500 text-sm font-bold py-2.5 px-6 rounded-full cursor-pointer flex items-center gap-2 transition-all duration-300 ease-in-out hover:text-white ${activeTab === 'coaches' ? 'bg-brand text-black shadow-[0_4px_15px_rgba(195,244,0,0.3)]' : ''}`}
              >
                <Users size={16} />
                Huấn Luyện Viên (PT)
              </button>
            </div>

            {/* Bộ lọc kép chỉ hiển thị khi ở tab PT */}
            {activeTab === 'coaches' && (
              <div className="flex items-center gap-3 self-end bg-transparent p-0 border-none">
                {/* 1. Lọc mục tiêu */}
                <div className="relative group">
                  <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="appearance-none bg-white/2 border border-white/8 text-white text-xs font-bold py-2.5 pl-4 pr-[38px] rounded-md cursor-pointer outline-none transition-all duration-300 ease-in-out tracking-[0.04em] hover:border-brand focus:border-brand hover:shadow-[0_0_12px_rgba(195,244,0,0.15)] focus:shadow-[0_0_12px_rgba(195,244,0,0.15)]"
                  >
                    <option className="bg-zinc-900 text-white" value="">TẤT CẢ MỤC TIÊU</option>
                    <option className="bg-zinc-900 text-white" value="WEIGHT_LOSS">GIẢM CÂN / GIẢM MỠ</option>
                    <option className="bg-zinc-900 text-white" value="MUSCLE_GAIN">TĂNG CƠ / THỂ HÌNH</option>
                    <option className="bg-zinc-900 text-white" value="COMPETITION_PREP">THI ĐẤU CHUYÊN NGHIỆP</option>
                    <option className="bg-zinc-900 text-white" value="REHABILITATION">PHỤC HỒI CHẤN THƯƠNG</option>
                    <option className="bg-zinc-900 text-white" value="GENERAL_FITNESS">SỨC KHỎE TỔNG QUÁT</option>
                  </select>
                  <ChevronDown size={14} strokeWidth={2.5} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors duration-300 group-hover:text-brand group-focus-within:text-brand" />
                </div>

                {/* 2. Lọc Thứ trong tuần */}
                <div className="relative group">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value === '' ? '' : Number(e.target.value))}
                    className="appearance-none bg-white/2 border border-white/8 text-white text-xs font-bold py-2.5 pl-4 pr-[38px] rounded-md cursor-pointer outline-none transition-all duration-300 ease-in-out tracking-[0.04em] hover:border-brand focus:border-brand hover:shadow-[0_0_12px_rgba(195,244,0,0.15)] focus:shadow-[0_0_12px_rgba(195,244,0,0.15)]"
                  >
                    <option className="bg-zinc-900 text-white" value="">TẤT CẢ CÁC NGÀY</option>
                    {daysOfWeekMap.map(day => (
                      <option className="bg-zinc-900 text-white" key={day.value} value={day.value}>{day.label.toUpperCase()}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} strokeWidth={2.5} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors duration-300 group-hover:text-brand group-focus-within:text-brand" />
                </div>

                {/* 3. Lọc Giờ bắt đầu */}
                <div className="relative group">
                  <select
                    value={selectedStartTime}
                    onChange={(e) => setSelectedStartTime(e.target.value)}
                    className="appearance-none bg-white/2 border border-white/8 text-white text-xs font-bold py-2.5 pl-4 pr-[38px] rounded-md cursor-pointer outline-none transition-all duration-300 ease-in-out tracking-[0.04em] hover:border-brand focus:border-brand hover:shadow-[0_0_12px_rgba(195,244,0,0.15)] focus:shadow-[0_0_12px_rgba(195,244,0,0.15)]"
                  >
                    <option className="bg-zinc-900 text-white" value="">GIỜ BẮT ĐẦU</option>
                    {timeOptions.map(t => (
                      <option className="bg-zinc-900 text-white" key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} strokeWidth={2.5} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors duration-300 group-hover:text-brand group-focus-within:text-brand" />
                </div>

                {/* 4. Lọc Giờ kết thúc */}
                <div className="relative group">
                  <select
                    value={selectedEndTime}
                    onChange={(e) => setSelectedEndTime(e.target.value)}
                    className="appearance-none bg-white/2 border border-white/8 text-white text-xs font-bold py-2.5 pl-4 pr-[38px] rounded-md cursor-pointer outline-none transition-all duration-300 ease-in-out tracking-[0.04em] hover:border-brand focus:border-brand hover:shadow-[0_0_12px_rgba(195,244,0,0.15)] focus:shadow-[0_0_12px_rgba(195,244,0,0.15)]"
                  >
                    <option className="bg-zinc-900 text-white" value="">GIỜ KẾT THÚC</option>
                    {timeOptions.map(t => (
                      <option className="bg-zinc-900 text-white" key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} strokeWidth={2.5} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors duration-300 group-hover:text-brand group-focus-within:text-brand" />
                </div>
              </div>
            )}
          </div>

          {/* Tab 1: Membership Plans */}
          {activeTab === 'plans' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pt-2.5">
                {plans.map((plan) => {
                  const featuresList = Array.isArray(plan.features)
                    ? plan.features
                    : (typeof plan.features === 'string' ? JSON.parse(plan.features) : []);
                  const isPro = plan.code.includes('PRO');

                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col py-10 px-8 rounded-xl border backdrop-blur-xl bg-gradient-to-br from-[rgba(28,27,27,0.7)] to-[rgba(18,18,18,0.9)] transition-all duration-[400ms] ease-in-out hover:-translate-y-2 before:content-[''] before:absolute before:inset-0 before:rounded-xl before:p-px before:pointer-events-none before:bg-gradient-to-br before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] ${
                        isPro
                          ? "border-brand/60 shadow-[0_15px_35px_rgba(195,244,0,0.1),inset_0_0_20px_rgba(195,244,0,0.02)] hover:shadow-[0_20px_50px_rgba(195,244,0,0.2),inset_0_0_20px_rgba(195,244,0,0.05)] before:from-brand/60 before:to-brand/10"
                          : "border-white/5 hover:border-brand/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_0_12px_rgba(255,255,255,0.02)] before:from-white/10 before:to-white/0"
                      }`}
                    >
                      {isPro && <div className="absolute top-4 -right-8 bg-gradient-to-br from-brand to-[#a2cb00] text-black text-[8px] font-black py-1.5 px-9 rotate-45 tracking-[0.15em] shadow-[0_2px_10px_rgba(0,0,0,0.3)]">ĐỀ XUẤT</div>}
                      <span className={`text-[13px] font-extrabold tracking-[0.15em] uppercase mb-2 ${isPro ? 'text-brand [text-shadow:0_0_10px_rgba(195,244,0,0.3)]' : 'text-zinc-400'}`}>{plan.name}</span>
                      <p className="text-[13px] text-zinc-500 m-0 mb-6">{plan.description}</p>

                      <div className="flex items-baseline gap-1.5 mb-8 border-b border-white/5 pb-6">
                        <span className={`text-[42px] font-black tracking-[-0.03em] ${isPro ? 'bg-gradient-to-br from-white to-brand bg-clip-text text-transparent' : 'text-white'}`}>{Number(plan.price).toLocaleString('vi-VN')}đ</span>
                        <span className="text-zinc-500 text-sm font-semibold">/ {plan.duration_days} ngày</span>
                      </div>

                      <ul className="list-none p-0 m-0 mb-10 flex flex-col gap-[18px] grow">
                        {featuresList.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-sm leading-[1.4] text-zinc-200">
                            <CheckCircle2 size={16} className="text-brand shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className={`text-sm font-extrabold py-4 rounded-md cursor-pointer transition-all duration-300 ease-[ease] tracking-wider flex items-center justify-center gap-2 ${
                          isPro
                            ? "bg-gradient-to-br from-brand to-[#a2cb00] text-black border-none shadow-[0_5px_15px_rgba(195,244,0,0.2)] hover:from-[#d8ff0e] hover:to-[#b4e100] hover:shadow-[0_10px_25px_rgba(195,244,0,0.4)] hover:scale-[1.02]"
                            : "bg-white/3 border border-white/10 text-white hover:bg-white hover:text-black hover:border-white hover:shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
                        }`}
                      >
                        <span>CHỌN GÓI DỊCH VỤ</span>
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Phân trang gói thành viên */}
              {plansTotalPages > 1 && (
                <div className="flex justify-center items-center gap-5 mt-10 pt-6 pb-3 border-t border-white/5 w-full">
                  <button
                    disabled={plansPage === 1}
                    onClick={() => setPlansPage(p => Math.max(1, p - 1))}
                    className="bg-white/2 border border-white/6 text-zinc-400 text-[11px] font-extrabold py-2.5 px-5 rounded-md cursor-pointer tracking-[0.08em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none enabled:hover:bg-white/8 enabled:hover:border-white/15 enabled:hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    ← TRANG TRƯỚC
                  </button>
                  <span className="text-xs font-bold text-zinc-500 tracking-[0.05em]">TRANG {plansPage} / {plansTotalPages}</span>
                  <button
                    disabled={plansPage === plansTotalPages}
                    onClick={() => setPlansPage(p => Math.min(plansTotalPages, p + 1))}
                    className="bg-white/2 border border-white/6 text-zinc-400 text-[11px] font-extrabold py-2.5 px-5 rounded-md cursor-pointer tracking-[0.08em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none enabled:hover:bg-white/8 enabled:hover:border-white/15 enabled:hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
                  >
                    TRANG SAU →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Tab 2: Hire Coaches */}
          {activeTab === 'coaches' && (
            <div className="flex flex-col gap-6">
              {coaches.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 min-[1200px]:grid-cols-4 gap-7 pt-2.5">
                    {coaches.map((coach) => {
                      const name = coach.user?.name || 'Huấn luyện viên';
                      const avatarUrl = coach.user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';

                      return (
                        <div key={coach.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 backdrop-blur-xl bg-gradient-to-br from-[rgba(28,27,27,0.7)] to-[rgba(18,18,18,0.9)] transition-all duration-[400ms] ease-in-out hover:border-brand/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] before:content-[''] before:absolute before:inset-0 before:rounded-xl before:p-px before:pointer-events-none before:bg-gradient-to-br before:from-white/8 before:to-white/0 before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]">
                          <div className="relative h-[280px] overflow-hidden after:content-[''] after:absolute after:inset-0 after:z-1 after:bg-gradient-to-t after:from-[rgba(19,19,19,1)] after:from-0% after:to-[rgba(19,19,19,0)] after:to-50%">
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover transition-transform duration-[600ms] ease-in-out group-hover:scale-[1.08] group-hover:rotate-1" />
                            <div className="absolute bottom-4 left-5 z-2">
                              <span className="bg-brand/15 border border-brand/40 text-brand text-[10px] font-extrabold py-1 px-2.5 rounded tracking-[0.06em] uppercase">{coach.speciality || 'FITNESS'}</span>
                            </div>
                          </div>

                          <div className="p-6 flex flex-col gap-3.5 grow relative z-2">
                            <div className="flex justify-between items-center">
                              <h5 className="text-xl font-extrabold text-white m-0 tracking-[-0.02em]">{name}</h5>
                              <div className="flex items-center gap-1 text-brand text-sm font-extrabold">
                                <Star size={14} fill="currentColor" />
                                <span>4.9</span>
                              </div>
                            </div>

                            <p className="text-[13px] leading-[1.6] text-zinc-400 m-0 grow line-clamp-3">{coach.bio}</p>

                            <button
                              onClick={() => handleOpenHireModal(coach)}
                              className="bg-white/3 border border-white/8 text-white text-[13px] font-extrabold py-3.5 rounded-md cursor-pointer transition-all duration-300 ease-[ease] w-full tracking-[0.04em] group-hover:bg-gradient-to-br group-hover:from-brand group-hover:to-[#a2cb00] group-hover:text-black group-hover:border-brand group-hover:shadow-[0_5px_15px_rgba(195,244,0,0.3)]"
                            >
                              XEM HỒ SƠ & THUÊ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Phân trang danh sách HLV */}
                  {coachTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-5 mt-10 pt-6 pb-3 border-t border-white/5 w-full">
                      <button
                        disabled={coachPage === 1}
                        onClick={() => setCoachPage(p => Math.max(1, p - 1))}
                        className="bg-white/2 border border-white/6 text-zinc-400 text-[11px] font-extrabold py-2.5 px-5 rounded-md cursor-pointer tracking-[0.08em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none enabled:hover:bg-white/8 enabled:hover:border-white/15 enabled:hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        ← TRANG TRƯỚC
                      </button>
                      <span className="text-xs font-bold text-zinc-500 tracking-[0.05em]">TRANG {coachPage} / {coachTotalPages}</span>
                      <button
                        disabled={coachPage === coachTotalPages}
                        onClick={() => setCoachPage(p => Math.min(coachTotalPages, p + 1))}
                        className="bg-white/2 border border-white/6 text-zinc-400 text-[11px] font-extrabold py-2.5 px-5 rounded-md cursor-pointer tracking-[0.08em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none enabled:hover:bg-white/8 enabled:hover:border-white/15 enabled:hover:text-white disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        TRANG SAU →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 border border-dashed border-white/6 rounded-xl bg-white/1">
                  <Users size={40} className="mx-auto mb-4 text-zinc-600" />
                  <p className="text-zinc-400 text-[15px] font-semibold m-0 mb-2">Không tìm thấy Huấn luyện viên nào!</p>
                  <p className="text-zinc-500 text-[13px] m-0">Vui lòng thay đổi bộ lọc tìm kiếm hoặc chọn khung giờ khác.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
