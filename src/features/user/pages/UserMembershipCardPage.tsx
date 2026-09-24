import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  ChevronDown,
  CheckCircle2,
  ArrowUpRight,
  MapPin,
  Cake,
  Phone,
  HeartPulse,
  Dumbbell,
} from 'lucide-react';
import { getMyProfile } from '../../auth/services/authApi';
import { getBodyMetricsHistory } from '../services/userApi';
import { getActiveMembership, getPlansList, getMembershipHistory } from '../services/membershipApi';
import PhysicalMembershipCard from '../components/PhysicalMembershipCard';

interface ProfileInfo {
  id: number;
  name: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  address: string | null;
  emergencyContact: string | null;
}

interface Plan {
  id: number;
  name: string;
  code: string;
  description: string | null;
  price: number | string;
  duration_days: number;
  features?: string[] | string;
}

const PLANS_INITIAL_VISIBLE = 3;

export default function UserMembershipCardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [membership, setMembership] = useState<any>(null);
  const [healthNote, setHealthNote] = useState<string>('');

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PLANS_INITIAL_VISIBLE);

  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<any[] | null>(null);

  // 1. Tải thông tin cá nhân, gói hội viên hiện tại và ghi chú sức khỏe gần nhất
  useEffect(() => {
    const load = async () => {
      try {
        const profileRes = await getMyProfile();
        if (profileRes.success && profileRes.data) {
          const u = profileRes.data;
          setProfile({
            id: u.id,
            name: u.name || '',
            avatarUrl: u.avatarUrl,
            dateOfBirth: u.dateOfBirth || null,
            address: u.address || null,
            emergencyContact: u.emergencyContact || null,
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin cá nhân:', err);
      }

      try {
        const membershipRes = await getActiveMembership();
        if (membershipRes.success && membershipRes.data) {
          setMembership(membershipRes.data);
        }
      } catch (err) {
        console.warn('Không lấy được gói hội viên hiện tại:', err);
      }

      try {
        const metricsRes = await getBodyMetricsHistory();
        if (metricsRes.success && Array.isArray(metricsRes.data) && metricsRes.data.length > 0) {
          setHealthNote(metricsRes.data[0].note || '');
        }
      } catch (err) {
        console.warn('Không lấy được chỉ số sức khỏe:', err);
      }

      setLoading(false);
    };
    load();
  }, []);

  // 2. Tải toàn bộ gói tập đang mở bán để tham khảo (lấy 1 lần, "Xem thêm" xử lý ở client)
  useEffect(() => {
    setPlansLoading(true);
    getPlansList({ limit: 50 })
      .then((res) => {
        if (res.success) {
          setPlans(res.data || []);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách gói tập:', err);
      })
      .finally(() => setPlansLoading(false));
  }, []);

  const handleToggleHistory = () => {
    const next = !showHistory;
    setShowHistory(next);
    if (next && history === null) {
      setHistoryLoading(true);
      getMembershipHistory()
        .then((res) => {
          if (res.success) setHistory(res.data || []);
        })
        .catch((err) => {
          console.error('Lỗi khi tải lịch sử đăng ký:', err);
          setHistory([]);
        })
        .finally(() => setHistoryLoading(false));
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '—';
    const d = new Date(value);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return { text: 'Đang hoạt động', cls: 'bg-brand/10 text-brand border-brand/30' };
      case 'PENDING': return { text: 'Chờ kích hoạt', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'EXPIRED': return { text: 'Đã hết hạn', cls: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' };
      case 'CANCELLED': return { text: 'Đã hủy', cls: 'bg-red-500/10 text-red-400 border-red-500/30' };
      case 'UPGRADED': return { text: 'Đã nâng cấp', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      default: return { text: status, cls: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' };
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center uppercase tracking-[0.1em] text-white">
        Đang tải thông tin thẻ hội viên...
      </div>
    );
  }

  const visiblePlans = plans.slice(0, visibleCount);
  const hasMorePlans = plans.length > visibleCount;

  return (
    <div className="flex flex-col gap-9 box-border">
      {/* HERO */}
      <section className="flex flex-col gap-4 max-w-3xl">
        <h1 className="m-0 text-4xl font-black uppercase leading-tight tracking-[-0.03em] text-white lg:text-5xl">
          Chọn thẻ tập phù hợp với nhịp sống của bạn
        </h1>
      </section>

      {/* THẺ TẬP HIỆN TẠI + THÔNG TIN HỘI VIÊN */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="m-0 text-lg font-bold text-white">Thẻ tập hiện tại</h2>
          <button
            onClick={handleToggleHistory}
            className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/2 px-3.5 py-2 text-xs font-bold text-zinc-300 transition-colors hover:border-brand/40 hover:text-brand"
          >
            <History size={14} />
            Lịch sử đăng ký
            <ChevronDown size={14} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
          <PhysicalMembershipCard userName={profile?.name} userId={profile?.id} membership={membership} />

          <div className="flex h-full flex-col gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-900/90 p-5 shadow-xl backdrop-blur-sm box-border">
            <h3 className="m-0 text-base font-bold tracking-tight text-white">Thông tin hội viên</h3>
            <div className="flex items-center gap-4">
              <img
                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100'}
                alt={profile?.name || 'Avatar'}
                className="h-16 w-16 flex-shrink-0 rounded-full border border-white/10 object-cover"
              />
              <div>
                <p className="m-0 text-base font-bold text-white">{profile?.name || 'Hội viên Kinetic'}</p>
                <p className="m-0 text-xs text-zinc-500">Mã hội viên: HV{String(profile?.id || 0).padStart(5, '0')}</p>
              </div>
            </div>

            <div className="flex flex-col divide-y divide-white/5 text-sm">
              <div className="flex items-center gap-3 py-2.5">
                <Cake size={15} className="flex-shrink-0 text-zinc-500" />
                <span className="text-zinc-400">Ngày sinh</span>
                <span className="ml-auto font-semibold text-white">{formatDate(profile?.dateOfBirth)}</span>
              </div>
              <div className="flex items-center gap-3 py-2.5">
                <MapPin size={15} className="flex-shrink-0 text-zinc-500" />
                <span className="text-zinc-400">Địa chỉ</span>
                <span className="ml-auto max-w-[60%] text-right font-semibold text-white">{profile?.address || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center gap-3 py-2.5">
                <Phone size={15} className="flex-shrink-0 text-zinc-500" />
                <span className="text-zinc-400">Liên hệ khẩn cấp</span>
                <span className="ml-auto font-semibold text-white">{profile?.emergencyContact || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center gap-3 py-2.5">
                <HeartPulse size={15} className="flex-shrink-0 text-zinc-500" />
                <span className="text-zinc-400">Ghi chú sức khỏe</span>
                <span className="ml-auto max-w-[60%] text-right font-semibold text-white">{healthNote || 'Không có'}</span>
              </div>
            </div>

            <Link
              to="/user/profile"
              className="mt-auto text-center text-xs font-bold text-zinc-500 transition-colors hover:text-brand"
            >
              Chỉnh sửa thông tin cá nhân →
            </Link>
          </div>
        </div>

        {/* LỊCH SỬ ĐĂNG KÝ */}
        {showHistory && (
          <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/60 p-5 box-border">
            {historyLoading ? (
              <p className="m-0 text-center text-sm text-zinc-500">Đang tải lịch sử đăng ký...</p>
            ) : !history || history.length === 0 ? (
              <p className="m-0 text-center text-sm text-zinc-500">Bạn chưa có lịch sử đăng ký gói hội viên nào.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((item) => {
                  const st = statusLabel(item.status);
                  return (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3"
                    >
                      <div>
                        <p className="m-0 text-sm font-bold text-white">{item.plan?.name || 'Gói thành viên'}</p>
                        <p className="m-0 text-xs text-zinc-500">
                          {formatDate(item.start_date)} – {formatDate(item.end_date)}
                        </p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${st.cls}`}>
                        {st.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* GÓI TẬP THAM KHẢO */}
      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-lg font-bold text-white">Thẻ hội viên có thể tham khảo</h2>

        {plansLoading ? (
          <p className="text-sm text-zinc-500">Đang tải danh sách gói tập...</p>
        ) : plans.length === 0 ? (
          <p className="text-sm text-zinc-500">Hiện chưa có gói tập nào đang mở bán.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visiblePlans.map((plan) => {
                const featuresList: string[] = Array.isArray(plan.features)
                  ? plan.features
                  : typeof plan.features === 'string'
                    ? JSON.parse(plan.features)
                    : [];
                return (
                  <div
                    key={plan.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-800/70 to-zinc-900/90 p-6 backdrop-blur-xl transition-transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Dumbbell size={18} />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                        {plan.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="m-0 text-base font-bold text-white">{plan.name}</h3>
                      {plan.description && (
                        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{plan.description}</p>
                      )}
                    </div>

                    {featuresList.length > 0 && (
                      <ul className="m-0 flex flex-col gap-1.5 p-0">
                        {featuresList.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-brand" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-4">
                      <div>
                        <p className="m-0 text-lg font-black text-white">{Number(plan.price).toLocaleString('vi-VN')}đ</p>
                        <p className="m-0 text-[11px] text-zinc-500">/ {plan.duration_days} ngày</p>
                      </div>
                      <Link
                        to="/user/plans"
                        className="flex items-center gap-1 rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-black transition-[filter] hover:brightness-110"
                      >
                        Đăng ký
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMorePlans && (
              <button
                onClick={() => setVisibleCount(plans.length)}
                className="mx-auto flex items-center gap-2 rounded-lg border border-white/10 bg-white/2 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:border-brand hover:text-brand"
              >
                Xem thêm {plans.length - visibleCount} gói tập
                <ChevronDown size={16} />
              </button>
            )}

            {!hasMorePlans && plans.length > PLANS_INITIAL_VISIBLE && (
              <button
                onClick={() => setVisibleCount(PLANS_INITIAL_VISIBLE)}
                className="mx-auto flex items-center gap-2 rounded-lg border border-white/10 bg-white/2 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:border-brand hover:text-brand"
              >
                Thu gọn
                <ChevronDown size={16} className="rotate-180" />
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
