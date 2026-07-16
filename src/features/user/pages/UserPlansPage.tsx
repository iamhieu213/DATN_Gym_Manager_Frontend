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
  Briefcase
} from 'lucide-react';
import './UserPlansPage.css';

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
        <div class="swal-payment-options-container">
          <div id="pay-vnpay" class="swal-payment-option-card active" data-value="VNPAY">
            <div class="payment-option-circle"></div>
            <div class="payment-option-details">
              <span class="payment-option-title">Cổng thanh toán trực tuyến VNPAY</span>
              <span class="payment-option-sub">Thanh toán an toàn qua Thẻ ATM, QR Code, Mobile Banking</span>
            </div>
          </div>
          <div id="pay-cash" class="swal-payment-option-card" data-value="CASH">
            <div class="payment-option-circle"></div>
            <div class="payment-option-details">
              <span class="payment-option-title">Thanh toán tiền mặt</span>
              <span class="payment-option-sub">Đóng phí trực tiếp tại quầy lễ tân của chi nhánh</span>
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
        confirmButton: 'swal-premium-confirm',
        cancelButton: 'swal-premium-cancel',
        popup: 'swal-premium-popup'
      },
      didOpen: () => {
        const vnpayBtn = document.getElementById('pay-vnpay');
        const cashBtn = document.getElementById('pay-cash');
        if (vnpayBtn && cashBtn) {
          vnpayBtn.addEventListener('click', () => {
            vnpayBtn.classList.add('active');
            cashBtn.classList.remove('active');
          });
          cashBtn.addEventListener('click', () => {
            cashBtn.classList.add('active');
            vnpayBtn.classList.remove('active');
          });
        }
      },
      preConfirm: () => {
        const activeBtn = document.querySelector('.swal-payment-option-card.active');
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
      <div style={{ padding: '80px 0', textTransform: 'uppercase', textAlign: 'center', color: '#fff', letterSpacing: '0.1em' }}>
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
    <div className="plans-page-wrapper">
      {/* ----------------- VIEW 1: TRANG CHI TIẾT PT ----------------- */}
      {selectedCoachId !== null ? (
        <div className="coach-detail-view-container">
          {/* Nút quay lại */}
          <button 
            onClick={() => setSelectedCoachId(null)}
            className="coach-detail-back-btn"
          >
            <ArrowLeft size={16} />
            <span>QUAY LẠI DANH SÁCH</span>
          </button>

          {detailLoading || !coachDetail ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#a1a1aa' }}>
              Đang tải chi tiết hồ sơ PT...
            </div>
          ) : (
            <div className="coach-detail-bento-grid">
              {/* Cột trái: Avatar & Thông tin chung */}
              <div className="coach-detail-left-card">
                <div className="detail-avatar-wrapper">
                  <img 
                    src={coachDetail.user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'} 
                    alt={coachDetail.user?.name} 
                    className="detail-avatar-img"
                  />
                  <span className="detail-badge-goal">{coachDetail.speciality || 'FITNESS'}</span>
                </div>
                <div className="detail-basic-info">
                  <h2>{coachDetail.user?.name}</h2>
                  <div className="detail-rating-box">
                    <Star size={16} fill="currentColor" className="text-[#c3f400]" />
                    <span>4.9 / 5.0 (Đánh giá học viên)</span>
                  </div>
                  <div className="detail-contact-list">
                    <p><strong>Email:</strong> {coachDetail.user?.email}</p>
                    {coachDetail.user?.phone && <p><strong>Điện thoại:</strong> {coachDetail.user?.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Cột phải: Bio, Lịch biểu & Các gói tập */}
              <div className="coach-detail-right-content">
                {/* Khối 1: Tiểu sử */}
                <div className="detail-info-block">
                  <h3 className="block-title">
                    <Briefcase size={18} className="text-[#c3f400]" />
                    TIỂU SỬ & KINH NGHIỆM
                  </h3>
                  <p className="block-desc">{coachDetail.bio || 'Chưa có thông tin giới thiệu chi tiết từ HLV.'}</p>
                </div>

                {/* Khối 2: Lịch rảnh hàng tuần */}
                <div className="detail-info-block">
                  <h3 className="block-title">
                    <Calendar size={18} className="text-[#c3f400]" />
                    LỊCH LÀM VIỆC RẢNH HÀNG TUẦN
                  </h3>
                  {coachDetail.availabilities && coachDetail.availabilities.length > 0 ? (
                    <div className="detail-availability-grid">
                      {coachDetail.availabilities.map((slot: any, idx: number) => (
                        <div key={idx} className="availability-slot-badge">
                          <span className="slot-day">{getDayOfWeekLabel(slot.dayOfWeek)}</span>
                          <span className="slot-time">
                            <Clock size={12} />
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>
                      Huấn luyện viên chưa đăng ký lịch biểu rảnh cố định.
                    </p>
                  )}
                </div>

                {/* Khối 3: Bảng giá dịch vụ PT 1-1 */}
                <div className="detail-info-block">
                  <h3 className="block-title">
                    <CreditCard size={18} className="text-[#c3f400]" />
                    BẢNG GIÁ & ĐĂNG KÝ GÓI COMBO
                  </h3>
                  
                  {coachPackages.length > 0 ? (
                    <div className="detail-packages-grid">
                      {coachPackages.map((item) => (
                        <div key={item.ptPackageId} className="detail-package-card">
                          <div className="package-card-header">
                            <h4>Gói {item.ptPackage?.name || `Combo ${item.ptPackage?.numberOfSessions} buổi`}</h4>
                            <span className="package-card-sessions">{item.ptPackage?.numberOfSessions} Buổi</span>
                          </div>
                          <p className="package-card-duration">Thời hạn: {item.ptPackage?.durationDays} ngày tập luyện</p>
                          <div className="package-card-footer">
                            <span className="package-card-price">{Number(item.price).toLocaleString('vi-VN')}đ</span>
                            <button 
                              onClick={() => handleConfirmHirePT(coachDetail.id, item.ptPackageId)}
                              className="package-card-btn"
                            >
                              ĐĂNG KÝ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-packages-alert">
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
          <section className="plans-hero-section">
            <div className="plans-badge-service">
              <Sparkles size={12} className="fill-current" />
              <span>DỊCH VỤ KINETIC ELITE</span>
            </div>
            <h3 className="plans-hero-title">
              Thiết Lập Lộ Trình <span>Hiệu Suất</span>
            </h3>
            <p className="plans-hero-desc">
              Bứt phá giới hạn thể hình của bạn. Lựa chọn một gói thành viên phù hợp để vào tập luyện tự do hoặc thuê riêng một Huấn luyện viên cá nhân (PT) bậc thầy để dẫn dắt lộ trình tập luyện 1-1 tối ưu nhất.
            </p>
          </section>

          {/* Header Tabs & Filter Row */}
          <div className="plans-header-row">
            <div className="plans-tabs-navigation">
              <button
                onClick={() => setActiveTab('plans')}
                className={`plans-tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
              >
                <CreditCard size={16} />
                Gói Thành Viên
              </button>
              <button
                onClick={() => setActiveTab('coaches')}
                className={`plans-tab-btn ${activeTab === 'coaches' ? 'active' : ''}`}
              >
                <Users size={16} />
                Huấn Luyện Viên (PT)
              </button>
            </div>

            {/* Bộ lọc kép chỉ hiển thị khi ở tab PT */}
            {activeTab === 'coaches' && (
              <div className="coaches-filter-row">
                {/* 1. Lọc mục tiêu */}
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="coaches-filter-select"
                >
                  <option value="">TẤT CẢ MỤC TIÊU</option>
                  <option value="WEIGHT_LOSS">GIẢM CÂN / GIẢM MỠ</option>
                  <option value="MUSCLE_GAIN">TĂNG CƠ / THỂ HÌNH</option>
                  <option value="COMPETITION_PREP">THI ĐẤU CHUYÊN NGHIỆP</option>
                  <option value="REHABILITATION">PHỤC HỒI CHẤN THƯƠNG</option>
                  <option value="GENERAL_FITNESS">SỨC KHỎE TỔNG QUÁT</option>
                </select>

                {/* 2. Lọc Thứ trong tuần */}
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value === '' ? '' : Number(e.target.value))}
                  className="coaches-filter-select"
                >
                  <option value="">TẤT CẢ CÁC NGÀY</option>
                  {daysOfWeekMap.map(day => (
                    <option key={day.value} value={day.value}>{day.label.toUpperCase()}</option>
                  ))}
                </select>

                {/* 3. Lọc Giờ bắt đầu */}
                <select
                  value={selectedStartTime}
                  onChange={(e) => setSelectedStartTime(e.target.value)}
                  className="coaches-filter-select"
                >
                  <option value="">GIỜ BẮT ĐẦU</option>
                  {timeOptions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                {/* 4. Lọc Giờ kết thúc */}
                <select
                  value={selectedEndTime}
                  onChange={(e) => setSelectedEndTime(e.target.value)}
                  className="coaches-filter-select"
                >
                  <option value="">GIỜ KẾT THÚC</option>
                  {timeOptions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tab 1: Membership Plans */}
          {activeTab === 'plans' && (
            <>
              <div className="plans-grid">
                {plans.map((plan) => {
                  const featuresList = Array.isArray(plan.features)
                    ? plan.features
                    : (typeof plan.features === 'string' ? JSON.parse(plan.features) : []);
                  const isPro = plan.code.includes('PRO');
                  
                  return (
                    <div key={plan.id} className={`plan-card ${isPro ? 'popular' : ''}`}>
                      {isPro && <div className="popular-badge">ĐỀ XUẤT</div>}
                      <span className="plan-card-tag">{plan.name}</span>
                      <p className="plan-tagline">{plan.description}</p>
                      
                      <div className="plan-price-box">
                        <span className="plan-price">{Number(plan.price).toLocaleString('vi-VN')}đ</span>
                        <span className="plan-unit">/ {plan.duration_days} ngày</span>
                      </div>

                      <ul className="plan-features-list">
                        {featuresList.map((feature: string, idx: number) => (
                          <li key={idx} className="plan-feature-item">
                            <CheckCircle2 size={16} className="text-[#c3f400]" style={{ flexShrink: 0 }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSelectPlan(plan)}
                        className="plan-action-btn"
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
                <div className="plans-pagination-bar">
                  <button 
                    disabled={plansPage === 1} 
                    onClick={() => setPlansPage(p => Math.max(1, p - 1))}
                    className="pagination-btn"
                  >
                    ← TRANG TRƯỚC
                  </button>
                  <span className="pagination-info">TRANG {plansPage} / {plansTotalPages}</span>
                  <button 
                    disabled={plansPage === plansTotalPages} 
                    onClick={() => setPlansPage(p => Math.min(plansTotalPages, p + 1))}
                    className="pagination-btn"
                  >
                    TRANG SAU →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Tab 2: Hire Coaches */}
          {activeTab === 'coaches' && (
            <div className="coaches-tab-container">
              {coaches.length > 0 ? (
                <>
                  <div className="coaches-grid">
                    {coaches.map((coach) => {
                      const name = coach.user?.name || 'Huấn luyện viên';
                      const avatarUrl = coach.user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';
                      
                      return (
                        <div key={coach.id} className="coach-card">
                          <div className="coach-image-wrapper">
                            <img src={avatarUrl} alt={name} className="coach-image" />
                            <div className="coach-badge-overlay">
                              <span className="coach-goal-badge">{coach.speciality || 'FITNESS'}</span>
                            </div>
                          </div>
                          
                          <div className="coach-info-content">
                            <div className="coach-info-header">
                              <h5 className="coach-card-name">{name}</h5>
                              <div className="coach-rating-box">
                                <Star size={14} fill="currentColor" />
                                <span>4.9</span>
                              </div>
                            </div>
                            
                            <p className="coach-bio-text">{coach.bio}</p>
                            
                            <button
                              onClick={() => handleOpenHireModal(coach)}
                              className="coach-hire-btn"
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
                    <div className="plans-pagination-bar">
                      <button 
                        disabled={coachPage === 1} 
                        onClick={() => setCoachPage(p => Math.max(1, p - 1))}
                        className="pagination-btn"
                      >
                        ← TRANG TRƯỚC
                      </button>
                      <span className="pagination-info">TRANG {coachPage} / {coachTotalPages}</span>
                      <button 
                        disabled={coachPage === coachTotalPages} 
                        onClick={() => setCoachPage(p => Math.min(coachTotalPages, p + 1))}
                        className="pagination-btn"
                      >
                        TRANG SAU →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(255,255,255,0.06)', borderRadius: '12px', background: 'rgba(255,255,255,0.01)' }}>
                  <Users size={40} className="text-zinc-600" style={{ margin: '0 auto 16px auto' }} />
                  <p style={{ color: '#a1a1aa', fontSize: '15px', fontWeight: 600, margin: '0 0 8px 0' }}>Không tìm thấy Huấn luyện viên nào!</p>
                  <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>Vui lòng thay đổi bộ lọc tìm kiếm hoặc chọn khung giờ khác.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
