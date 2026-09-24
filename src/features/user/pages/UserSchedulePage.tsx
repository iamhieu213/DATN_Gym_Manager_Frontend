import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Users,
  CalendarDays,
} from 'lucide-react';
import { getMyBookings, getCoachDetail } from '../services/ptBookingApi';

// ------------------------------------------------------------------
// Kiểu dữ liệu (khớp với dữ liệu thật trả về từ backend)
// ------------------------------------------------------------------
interface AssignmentItem {
  id: number;
  coachId?: number;
  totalSessions: number;
  remainingSessions: number;
  startDate: string;
  endDate: string;
  status: string;
  coach?: {
    id?: number;
    user?: { name?: string; avatarUrl?: string | null } | null;
  } | null;
  ptPackage?: {
    name?: string;
    code?: string;
    numberOfSessions?: number;
  } | null;
}

interface AvailabilitySlot {
  dayOfWeek: number; // 0: Chủ Nhật, 1: Thứ 2, ..., 6: Thứ 7 (đúng quy ước Prisma)
  startTime: string; // "18:00"
  endTime: string;   // "20:00"
  startMinutes: number;
  endMinutes: number;
}

type ViewMode = 'week' | 'year';

// Thứ tự cột hiển thị: Thứ 2 -> Chủ Nhật, mapping sang dayOfWeek chuẩn Prisma (0 = CN)
const WEEK_COLUMNS = [
  { label: 'T2', prismaDay: 1 },
  { label: 'T3', prismaDay: 2 },
  { label: 'T4', prismaDay: 3 },
  { label: 'T5', prismaDay: 4 },
  { label: 'T6', prismaDay: 5 },
  { label: 'T7', prismaDay: 6 },
  { label: 'CN', prismaDay: 0 },
];

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const HOUR_HEIGHT = 60; // px cho 1 giờ => 1px tương ứng 1 phút, tính toán vị trí rất đơn giản
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Class dùng chung cho <select> tuỳ biến (mũi tên SVG được encode sẵn để nhúng an toàn
// vào Tailwind arbitrary value — tương đương y hệt background-image trong CSS cũ).
const SELECT_BASE_CLASS =
  `appearance-none cursor-pointer rounded-lg border border-white/8 bg-white/2 bg-no-repeat bg-[right_12px_center] bg-[length:12px] bg-[url("data:image/svg+xml,%3Csvg%20fill%3D'none'%20stroke%3D'%2371717a'%20stroke-width%3D'2.5'%20viewBox%3D'0%200%2024%2024'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%20d%3D'M19.5%208.25l-7.5%207.5-7.5-7.5'%3E%3C%2Fpath%3E%3C%2Fsvg%3E")] font-[Inter,sans-serif] font-semibold text-white transition-all duration-200 hover:border-brand hover:shadow-[0_0_12px_rgba(195,244,0,0.15)] focus:border-brand focus:shadow-[0_0_12px_rgba(195,244,0,0.15)] focus:outline-none`;

const pad2 = (n: number) => String(n).padStart(2, '0');

// Lấy ngày Thứ 2 của tuần chứa `date`
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0: CN ... 6: T7
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// So sánh chỉ theo ngày (bỏ giờ phút): trả về true nếu `date` ở trước ngày hôm nay
function isPastDay(date: Date, today: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d.getTime() < t.getTime();
}

const getDaysInMonth = (monthIndex: number, year: number) => new Date(year, monthIndex + 1, 0).getDate();
// 0: Thứ 2 ... 6: Chủ Nhật (đồng bộ quy ước T2 -> CN đang dùng trong toàn bộ app)
const getFirstWeekdayOfMonth = (monthIndex: number, year: number) => {
  const day = new Date(year, monthIndex, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

export default function UserSchedulePage() {
  const today = useMemo(() => new Date(), []);

  // ---------------- Dữ liệu hợp đồng thuê PT & lịch rảnh HLV ----------------
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [availabilities, setAvailabilities] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showCancelled, setShowCancelled] = useState(true);

  // ---------------- Điều khiển hiển thị ----------------
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [weekAnchor, setWeekAnchor] = useState<Date>(() => getMondayOfWeek(today));
  const [yearValue, setYearValue] = useState<number>(today.getFullYear());
  const [jumpMonth, setJumpMonth] = useState<number>(today.getMonth());

  const weekScrollRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Array<HTMLDivElement | null>>([]);

  // 1. Tải danh sách hợp đồng thuê PT của hội viên
  useEffect(() => {
    setLoading(true);
    setLoadError(false);
    getMyBookings()
      .then((res: any) => {
        if (res.success) {
          const list: AssignmentItem[] = res.data || [];
          setAssignments(list);
          const preferred = list.find((a) => a.status === 'ACTIVE') || list[0] || null;
          setSelectedAssignmentId(preferred ? preferred.id : null);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách hợp đồng thuê PT:', err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // 2. Tải lịch rảnh hàng tuần của HLV thuộc hợp đồng đang chọn
  useEffect(() => {
    const assignment = assignments.find((a) => a.id === selectedAssignmentId);
    const coachId = assignment?.coach?.id ?? assignment?.coachId;
    if (!coachId) {
      setAvailabilities([]);
      return;
    }
    getCoachDetail(coachId)
      .then((res: any) => {
        if (res.success) {
          setAvailabilities(res.data?.availabilities || []);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải lịch rảnh của HLV:', err);
      });
  }, [selectedAssignmentId, assignments]);

  // 3. Mặc định cuộn khung tuần tới khoảng 5h sáng cho dễ nhìn (giống app lịch phổ biến)
  useEffect(() => {
    if (viewMode === 'week' && weekScrollRef.current) {
      weekScrollRef.current.scrollTop = 5 * HOUR_HEIGHT;
    }
  }, [viewMode]);

  const visibleAssignments = assignments.filter((a) => showCancelled || a.status !== 'CANCELLED');
  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId) || null;

  const weekDates = useMemo(
    () => WEEK_COLUMNS.map((_, idx) => addDays(weekAnchor, idx)),
    [weekAnchor]
  );
  const weekEnd = weekDates[6];

  const slotsForColumn = (prismaDay: number) =>
    availabilities.filter((slot) => slot.dayOfWeek === prismaDay);

  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  const goToToday = () => {
    if (viewMode === 'week') {
      setWeekAnchor(getMondayOfWeek(today));
    } else {
      setYearValue(today.getFullYear());
      setJumpMonth(today.getMonth());
      requestAnimationFrame(() => {
        monthRefs.current[today.getMonth()]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const handleJumpToMonth = (monthIndex: number) => {
    setJumpMonth(monthIndex);
    monthRefs.current[monthIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textTransform: 'uppercase', textAlign: 'center', color: '#fff', letterSpacing: '0.1em' }}>
        Đang tải lịch tập...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-5 rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-800/70 to-zinc-900/90 p-[18px] backdrop-blur-xl md:p-7">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-1 font-[Montserrat,sans-serif] text-2xl font-black tracking-[-0.02em] text-white">Lịch tập</h1>
            <p className="font-[Inter,sans-serif] text-[13px] text-zinc-400">Xem và quản lý lịch tập luyện.</p>
          </div>

          {assignments.length > 0 && (
            <label className="flex cursor-pointer select-none items-center gap-2 text-[13px] font-semibold text-zinc-300">
              <input
                type="checkbox"
                className="h-[15px] w-[15px] cursor-pointer accent-brand"
                checked={showCancelled}
                onChange={(e) => setShowCancelled(e.target.checked)}
              />
              <span>Hiện lịch đã hủy</span>
            </label>
          )}
        </div>

        {loadError ? (
          <p className="m-0 text-[13px] text-red-400">Không thể tải dữ liệu lịch tập. Vui lòng thử lại sau.</p>
        ) : (
          <>
            {assignments.length > 0 ? (
              <>
                {/* Bộ chọn hợp đồng PT & HLV */}
                <div className="flex flex-wrap items-end gap-5">
                  <div className="flex min-w-[220px] flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Gói huấn luyện viên</label>
                    <select
                      className={`${SELECT_BASE_CLASS} py-2.5 pl-3.5 pr-[34px] text-[13px]`}
                      value={selectedAssignmentId ?? ''}
                      onChange={(e) => setSelectedAssignmentId(Number(e.target.value))}
                    >
                      {visibleAssignments.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.ptPackage?.code ? `${a.ptPackage.code} - ` : ''}
                          {a.ptPackage?.name || 'Gói huấn luyện viên'} — PT {a.totalSessions} buổi
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex min-w-[220px] flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Tên HLV</label>
                    <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/2 px-3.5 py-2.5 text-[13px] font-bold text-white">
                      <Users size={14} className="shrink-0 text-brand" />
                      <span>{selectedAssignment?.coach?.user?.name || 'Chưa xác định'}</span>
                    </div>
                  </div>

                  <label
                    className="flex cursor-not-allowed select-none items-center gap-2 text-[13px] font-semibold text-zinc-500"
                    title="Tính năng đặt lịch trực quan sẽ khả dụng khi hệ thống hỗ trợ đặt buổi tập theo khung giờ cụ thể."
                  >
                    <input type="checkbox" disabled className="h-[15px] w-[15px] cursor-pointer accent-brand" />
                    <span>Đặt lịch trực quan</span>
                    <span className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.03em] text-zinc-400">Sắp ra mắt</span>
                  </label>
                </div>

                {/* Ghi chú trung thực về dữ liệu đang hiển thị */}
                <div className="flex items-start gap-2 rounded-lg border border-brand/15 bg-brand/5 px-3.5 py-2.5 text-[12.5px] leading-normal text-zinc-300">
                  <Info size={14} className="mt-0.5 shrink-0 text-brand" />
                  <span>
                    Các khối màu trên lịch là <strong className="text-white">khung giờ rảnh cố định hàng tuần</strong> của HLV. Tính năng đặt và
                    theo dõi từng buổi tập cụ thể theo ngày sẽ được bổ sung sau.
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-2 rounded-lg border border-white/8 bg-white/2 px-3.5 py-2.5 text-[12.5px] leading-normal text-zinc-300">
                <Info size={14} className="mt-0.5 shrink-0 text-zinc-400" />
                <span>
                  Bạn chưa thuê Huấn luyện viên nào nên lịch bên dưới hiện chưa có khung giờ nào.{' '}
                  <Link to="/user/plans" className="font-bold text-brand no-underline hover:underline">Xem gói huấn luyện viên</Link>
                </span>
              </div>
            )}

            {/* Thanh điều khiển: Tuần / Lịch năm */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-1 rounded-lg border border-white/8 bg-white/3 p-1">
                <button
                  className={`cursor-pointer rounded-md border-0 px-[18px] py-[7px] text-[13px] font-bold transition-all duration-200 ${viewMode === 'week' ? 'bg-brand text-black' : 'text-zinc-400 hover:text-white'}`}
                  onClick={() => setViewMode('week')}
                >
                  Tuần
                </button>
                <button
                  className={`cursor-pointer rounded-md border-0 px-[18px] py-[7px] text-[13px] font-bold transition-all duration-200 ${viewMode === 'year' ? 'bg-brand text-black' : 'text-zinc-400 hover:text-white'}`}
                  onClick={() => setViewMode('year')}
                >
                  Lịch năm
                </button>
              </div>
              <button
                className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-white/8 bg-white/2 text-zinc-400 transition-all duration-200 hover:border-brand hover:text-white"
                title="Về hôm nay"
                onClick={goToToday}
              >
                <CalendarDays size={16} />
              </button>
            </div>

            {viewMode === 'week' ? (
              <>
                {/* Điều hướng tuần */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-3.5 py-2 text-[12.5px] font-bold text-white transition-all duration-200 hover:border-brand hover:text-brand"
                    onClick={() => setWeekAnchor((w) => addDays(w, -7))}
                  >
                    <ChevronLeft size={16} />
                    <span>Trước</span>
                  </button>
                  <span className="text-[13px] font-bold text-white">
                    Tuần: {weekDates[0].getDate()}/{weekDates[0].getMonth() + 1} – {weekEnd.getDate()}/{weekEnd.getMonth() + 1}/{weekEnd.getFullYear()}
                  </span>
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-3.5 py-2 text-[12.5px] font-bold text-white transition-all duration-200 hover:border-brand hover:text-brand"
                    onClick={() => setWeekAnchor((w) => addDays(w, 7))}
                  >
                    <span>Sau</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Lưới tuần */}
                <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-white/6 pb-2">
                  <div />
                  {weekDates.map((date, idx) => {
                    const isToday = sameDay(date, today);
                    return (
                      <div key={idx} className={`flex flex-col items-center gap-0.5 rounded-md py-1 ${isToday ? 'bg-brand/8' : ''}`}>
                        <span className={`text-[9px] font-bold tracking-wider md:text-[11px] ${isToday ? 'text-brand' : 'text-zinc-500'}`}>{WEEK_COLUMNS[idx].label}</span>
                        <span className="text-[12px] font-extrabold text-white md:text-[14px]">{date.getDate()}/{date.getMonth() + 1}</span>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="max-h-[620px] overflow-y-auto rounded-lg [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/12"
                  ref={weekScrollRef}
                >
                  <div className="relative grid grid-cols-[56px_repeat(7,1fr)]">
                    <div className="flex flex-col">
                      {HOURS.map((h) => (
                        <div key={h} className="pr-2 text-right text-[11px] text-zinc-600 -translate-y-1.5" style={{ height: HOUR_HEIGHT }}>
                          {pad2(h)}:00
                        </div>
                      ))}
                    </div>

                    {weekDates.map((date, idx) => {
                      const past = isPastDay(date, today);
                      const isToday = sameDay(date, today);
                      const dimHeight = past ? 24 * HOUR_HEIGHT : isToday ? nowMinutes : 0;
                      return (
                        <div
                          key={idx}
                          className={`relative border-l border-white/5 ${isToday ? 'bg-brand/3' : ''}`}
                          style={{ height: 24 * HOUR_HEIGHT }}
                        >
                          {HOURS.map((h) => (
                            <div key={h} className="absolute inset-x-0 border-t border-white/5" style={{ top: h * HOUR_HEIGHT }} />
                          ))}

                          {slotsForColumn(WEEK_COLUMNS[idx].prismaDay).map((slot, i) => (
                            <div
                              key={i}
                              className="absolute inset-x-1 z-[1] overflow-hidden rounded-md border border-brand/40 bg-brand/14 px-1.5 py-1"
                              style={{ top: slot.startMinutes, height: Math.max(slot.endMinutes - slot.startMinutes, 20) }}
                              title={`HLV rảnh ${slot.startTime} - ${slot.endTime}`}
                            >
                              <span className="whitespace-nowrap text-[10.5px] font-bold text-brand">{slot.startTime} - {slot.endTime}</span>
                            </div>
                          ))}

                          {dimHeight > 0 && (
                            <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] bg-black/45" style={{ height: dimHeight }} />
                          )}
                          {isToday && (
                            <div
                              className="absolute inset-x-0 z-[3] h-0 border-t-2 border-red-500 before:absolute before:-left-1 before:-top-1 before:h-2 before:w-2 before:rounded-full before:bg-red-500 before:content-['']"
                              style={{ top: nowMinutes }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Điều hướng năm */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <select
                      className={`${SELECT_BASE_CLASS} min-w-[130px] py-2 pl-3 pr-[30px] text-[12.5px]`}
                      value={jumpMonth}
                      onChange={(e) => handleJumpToMonth(Number(e.target.value))}
                    >
                      {MONTH_NAMES.map((m, idx) => (
                        <option key={idx} value={idx}>{m}</option>
                      ))}
                    </select>
                    <button
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-3.5 py-2 text-[12.5px] font-bold text-white transition-all duration-200 hover:border-brand hover:text-brand"
                      onClick={goToToday}
                    >
                      Hôm nay
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-white/8 bg-white/2 text-zinc-400 transition-all duration-200 hover:border-brand hover:text-white"
                      onClick={() => setYearValue((y) => y - 1)}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-[13px] font-bold text-white">{yearValue}</span>
                    <button
                      className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-white/8 bg-white/2 text-zinc-400 transition-all duration-200 hover:border-brand hover:text-white"
                      onClick={() => setYearValue((y) => y + 1)}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex max-h-[620px] flex-col gap-6 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/12">
                  {MONTH_NAMES.map((monthName, monthIndex) => {
                    const daysInMonth = getDaysInMonth(monthIndex, yearValue);
                    const leading = getFirstWeekdayOfMonth(monthIndex, yearValue);

                    const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
                    const prevYear = monthIndex === 0 ? yearValue - 1 : yearValue;
                    const daysInPrevMonth = getDaysInMonth(prevMonthIndex, prevYear);
                    const leadingDays = Array.from({ length: leading }, (_, i) => daysInPrevMonth - leading + i + 1);

                    const totalCells = leading + daysInMonth;
                    const trailing = (7 - (totalCells % 7)) % 7;
                    const trailingDays = Array.from({ length: trailing }, (_, i) => i + 1);

                    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                    return (
                      <div
                        key={monthIndex}
                        className="rounded-xl border border-white/5 bg-white/[1.5%] p-4"
                        ref={(el) => { monthRefs.current[monthIndex] = el; }}
                      >
                        <h3 className="mb-3 text-sm font-extrabold tracking-[-0.01em] text-white">{monthName} {yearValue}</h3>
                        <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                          {WEEK_COLUMNS.map((c) => (
                            <span key={c.label} className="pb-1.5 text-center text-[10.5px] font-bold tracking-[0.04em] text-zinc-500">{c.label}</span>
                          ))}
                          {leadingDays.map((d, i) => (
                            <div key={`lead-${i}`} className="flex aspect-square items-center justify-center rounded-md text-xs font-semibold text-zinc-700">{d}</div>
                          ))}
                          {monthDays.map((d) => {
                            const cellDate = new Date(yearValue, monthIndex, d);
                            const isToday = sameDay(cellDate, today);
                            const past = isPastDay(cellDate, today);
                            const cellClass = isToday
                              ? 'flex aspect-square items-center justify-center rounded-md text-xs font-extrabold bg-brand text-black'
                              : past
                              ? 'flex aspect-square items-center justify-center rounded-md text-xs font-semibold text-zinc-600'
                              : 'flex aspect-square items-center justify-center rounded-md text-xs font-semibold text-zinc-200';
                            return (
                              <div key={d} className={cellClass}>
                                {d}
                              </div>
                            );
                          })}
                          {trailingDays.map((d, i) => (
                            <div key={`trail-${i}`} className="flex aspect-square items-center justify-center rounded-md text-xs font-semibold text-zinc-700">{d}</div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
