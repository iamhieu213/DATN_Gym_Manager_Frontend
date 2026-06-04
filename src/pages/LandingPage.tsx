import { useEffect, useRef, type PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Heart, Dumbbell, HeartPulse } from 'lucide-react';
import heroImage from '../assets/gym_hero_bg.png';
import elenaVolkImage from '../assets/trainers/elena-volk.png';
import jaxVanceImage from '../assets/trainers/jax-vance.png';
import marcusReedImage from '../assets/trainers/marcus-reed.png';
import sarahKaiImage from '../assets/trainers/sarah-kai.png';

const headline = 'HIỆU SUẤT ĐỈNH CAO';

const stats = [
  { target: 50000, label: 'Học viên tinh anh', format: 'compact' },
  { target: 200, label: 'Huấn luyện viên bậc thầy', format: 'plus' },
  { target: 1000000, label: 'Buổi tập hoàn thành', format: 'million' },
];

const workoutPaths = [
  {
    label: 'Tăng cơ',
    title: 'Sức mạnh thuần túy',
    icon: 'strength',
    progress: 'w-3/4',
    delay: '',
    copy: 'Kích thích cường độ cao, nền tảng cơ thể vững chắc và kiểm soát thần kinh tối ưu. Xây dựng sức mạnh bền lâu.',
  },
  {
    label: 'Trao đổi chất',
    title: 'Tốc độ Noir',
    icon: 'bolt',
    progress: 'w-full',
    delay: '[animation-delay:-2s]',
    copy: 'Bài tập chuyển hóa cường độ cao giúp đốt mỡ mạnh mẽ và nâng ngưỡng chịu đựng yếm khí.',
  },
  {
    label: 'Bền bỉ',
    title: 'Phục hồi tinh anh',
    icon: 'recovery',
    progress: 'w-1/2',
    delay: '[animation-delay:-4s]',
    copy: 'Vận động linh hoạt có chiến lược và điều hòa hệ thần kinh để tối đa hóa khả năng phục hồi mô.',
  },
];

const trainers = [
  { name: 'Jax Vance', role: 'Trưởng bộ môn sức mạnh', image: jaxVanceImage },
  { name: 'Sarah Kai', role: 'Bậc thầy thể lực', image: sarahKaiImage },
  { name: 'Marcus Reed', role: 'Chuyên gia linh hoạt', image: marcusReedImage },
  { name: 'Elena Volk', role: 'Trưởng nhóm sinh trắc', image: elenaVolkImage },
];

function WorkoutIcon({ name }: { name: string }) {
  if (name === 'bolt') {
    return <Zap className="h-16 w-16 text-[#c3f400] fill-current" />;
  }

  if (name === 'recovery') {
    return <HeartPulse className="h-16 w-16 text-[#c3f400]" />;
  }

  return <Dumbbell className="h-16 w-16 text-[#c3f400]" />;
}

// 1. Component Giao diện Dashboard Mockup kính bán trong suốt siêu nhỏ (Mini Mockup)
const MiniDashboardMockup = () => {
  return (
    <div className="glass-card relative overflow-hidden rounded-3xl border border-white/10 bg-[#131313]/60 p-5 shadow-2xl backdrop-blur-2xl w-full">
      {/* Top bar */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">Kinetic Noir OS</span>
        <div className="w-5 h-5 rounded-full bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
          <Zap size={10} className="fill-current" />
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="bg-white/3 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1.5">
          <span className="text-[7px] font-mono tracking-widest text-[#71717a] uppercase">Hội viên mới</span>
          <div className="text-[11px] font-mono font-bold text-[#c3f400]">+12.4%</div>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1.5">
          <span className="text-[7px] font-mono tracking-widest text-[#71717a] uppercase">Calo tiêu hao</span>
          <div className="text-[11px] font-mono font-bold text-white">142.5K kcal</div>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1.5">
          <span className="text-[7px] font-mono tracking-widest text-[#71717a] uppercase">Mục tiêu tuần</span>
          <div className="text-[11px] font-mono font-bold text-[#c3f400]">94.8%</div>
        </div>
      </div>
      {/* Chart preview */}
      <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[7px] font-mono tracking-widest text-[#71717a] uppercase">Tần suất luyện tập (giờ)</span>
          <span className="text-[8px] font-mono font-bold text-[#c3f400] px-1.5 py-0.5 bg-[#c3f400]/10 rounded-md">LIVE</span>
        </div>
        <div className="h-20 flex items-end gap-1.5 pb-1">
          <div className="grow bg-white/5 rounded-t-sm h-[35%] transition-all"></div>
          <div className="grow bg-white/5 rounded-t-sm h-[45%] transition-all"></div>
          <div className="grow bg-white/5 rounded-t-sm h-[40%] transition-all"></div>
          <div className="grow bg-white/5 rounded-t-sm h-[60%] transition-all"></div>
          <div className="grow bg-white/5 rounded-t-sm h-[52%] transition-all"></div>
          <div className="grow bg-[#c3f400]/30 rounded-t-sm h-[75%] transition-all"></div>
          <div className="grow bg-[#c3f400] rounded-t-sm h-[95%] transition-all"></div>
        </div>
      </div>
    </div>
  );
};

function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const dashboardMockupRef = useRef<HTMLDivElement | null>(null);

  // 2. Lắng nghe sự kiện cuộn chuột để phóng to Mockup Dashboard (Scroll Zoom)
  useEffect(() => {
    const handleScroll = () => {
      const mockup = dashboardMockupRef.current;
      if (!mockup) return;

      const scrollY = window.scrollY;
      
      // Phóng to nhẹ nhàng khi cuộn chuột và chuyển dịch góc nghiêng
      const scaleValue = 1 + scrollY * 0.0004;
      const rotateY = -15 + scrollY * 0.008;
      const rotateX = 10 - scrollY * 0.004;

      // Đặt giới hạn scale tối đa để tránh quá to
      const boundedScale = Math.min(scaleValue, 1.15);

      mockup.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${boundedScale})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    document.querySelectorAll<HTMLElement>('.fade-up, .counter').forEach((element) => {
      revealObserver.observe(element);
    });

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>('.counter');

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;
          const target = Number(element.dataset.target ?? 0);
          const format = element.dataset.format ?? 'plus';
          const duration = 2000;
          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentValue = Math.floor(eased * target);

            if (format === 'million') {
              element.textContent = `${Math.max(1, Math.round(currentValue / 1000000))}M+`;
            } else if (format === 'compact') {
              element.textContent = `${Math.round(currentValue / 1000)}K+`;
            } else {
              element.textContent = `${currentValue}+`;
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(element);
        });
      },
      { threshold: 0.55 },
    );

    counters.forEach((counter) => counterObserver.observe(counter));

    return () => counterObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    const points = [
      { x: 0.14, y: 0.24, radius: 460, color: 'rgba(195, 244, 0, 0.28)', vx: 0.22, vy: 0.12 },
      { x: 0.86, y: 0.18, radius: 360, color: 'rgba(255, 255, 255, 0.12)', vx: -0.12, vy: 0.18 },
      { x: 0.78, y: 0.72, radius: 560, color: 'rgba(171, 214, 0, 0.18)', vx: -0.16, vy: -0.1 },
      { x: 0.38, y: 0.62, radius: 680, color: 'rgba(255, 255, 255, 0.07)', vx: 0.09, vy: -0.14 },
    ].map((point) => ({ ...point, px: 0, py: 0, ox: 0, oy: 0 }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      points.forEach((point) => {
        point.px = point.ox = width * point.x;
        point.py = point.oy = height * point.y;
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.filter = 'blur(100px)';

      points.forEach((point) => {
        point.px += point.vx;
        point.py += point.vy;

        if (Math.abs(point.px - point.ox) > 130) {
          point.vx *= -1;
        }

        if (Math.abs(point.py - point.oy) > 130) {
          point.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(point.px, point.py, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const spotlight = spotlightRef.current;

    if (!spotlight) {
      return;
    }

    let animationFrame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      spotlight.style.setProperty('--spotlight-x', `${currentX}px`);
      spotlight.style.setProperty('--spotlight-y', `${currentY}px`);
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove);
    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleMagneticMove = (event: PointerEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.4;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.4;

    element.style.transform = `translate(${x}px, ${y}px)`;
  };

  const resetMagnetic = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.transform = 'translate(0px, 0px)';
  };

  const handleTiltMove = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (y - 0.5) * 15;
    const tiltY = (x - 0.5) * -15;

    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const resetTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div className="min-h-screen bg-[#131313] font-sans text-[#e5e2e1] antialiased selection:bg-[#c3f400] selection:text-[#161e00]">
      {/* Thêm CSS Keyframes tùy chỉnh tự chứa để trôi nổi thiết bị trong Hero */}
      <style>{`
        @keyframes float-mockup {
          0%, 100% { transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(-12px); }
        }
        @keyframes float-phone {
          0%, 100% { transform: translateY(0) scale(1.02); }
          50% { transform: translateY(-16px) scale(1.02); }
        }
      `}</style>

      <canvas ref={canvasRef} id="mesh-canvas" aria-hidden="true" />
      <div ref={spotlightRef} className="mouse-spotlight" aria-hidden="true" />

      {/* Top Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#131313]/80 shadow-2xl shadow-[#c3f400]/5 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-16">
          <a href="#hero" className="text-xl font-black tracking-tight text-white md:text-2xl">
            KINETIC NOIR
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a className="border-b-2 border-white pb-1 font-mono text-sm font-bold uppercase text-white" href="#paths">Bài tập</a>
            <a className="font-mono text-sm font-medium uppercase text-[#c4c9ac] transition-colors hover:text-white" href="#story">Câu chuyện</a>
            <a className="font-mono text-sm font-medium uppercase text-[#c4c9ac] transition-colors hover:text-white" href="#trainers">HLV</a>
            <a className="font-mono text-sm font-medium uppercase text-[#c4c9ac] transition-colors hover:text-white" href="#stats">Thành tích</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full border border-white/15 px-5 py-2 font-mono text-sm font-bold uppercase text-white transition-all duration-300 hover:border-[#c3f400] hover:text-[#c3f400]"
            >
              Đăng nhập
            </button>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-full bg-[#c3f400] px-5 py-2 font-mono text-sm font-bold uppercase text-[#283500] transition-all duration-300 hover:scale-105 hover:bg-white"
            >
              Tham gia
            </button>
          </div>
        </nav>
      </header>

      {/* Main Sections */}
      <main>
        {/* HERO SECTION: Hai cột cao cấp có Floating Dashboard Mockup + Glow CTA */}
        <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-28 pb-16 md:px-16">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl items-center text-left">
            {/* Cột trái: Tiêu đề & Glow CTA */}
            <div className="space-y-8 max-w-2xl">
              <span className="hero-reveal hero-reveal-1 inline-block font-mono text-sm uppercase tracking-[0.4em] text-[#c3f400]">
                Hiệu suất không thỏa hiệp
              </span>
              <h1 className="hero-reveal hero-reveal-2 select-none text-[42px] leading-none text-white md:text-[68px] font-black" aria-label={headline}>
                {headline.split('').map((char, index) => (
                  <span
                    className="reveal-char"
                    style={{ transitionDelay: `${index * 40}ms` }}
                    key={`${char}-${index}`}
                    aria-hidden="true"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h1>
              <p className="hero-reveal hero-reveal-3 text-base md:text-lg leading-relaxed text-[#c4c9ac]">
                Vượt qua giới hạn tiềm năng của bạn. Trải nghiệm hệ thống tập luyện cường độ cao dành cho những người theo đuổi kỷ luật và sức mạnh.
              </p>
              
              {/* CTA Glow button */}
              <div className="hero-reveal hero-reveal-4 flex flex-wrap gap-4 items-center">
                <span
                  className="magnetic-wrap"
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={resetMagnetic}
                >
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#c3f400] px-10 py-4.5 text-lg font-black text-[#283500] shadow-[0_0_30px_rgba(195,244,0,0.4)] hover:shadow-[0_0_50px_rgba(195,244,0,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      THAM GIA NGAY <Zap size={16} className="animate-pulse fill-current inline text-[#283500]" />
                    </span>
                    <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 group-hover:translate-y-0" />
                  </button>
                </span>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="rounded-full border border-white/10 bg-white/5 px-8 py-4.5 font-mono text-sm font-bold uppercase text-white transition-all duration-300 hover:border-[#c3f400] hover:text-[#c3f400] hover:bg-white/10 cursor-pointer"
                >
                  Xem Dashboard
                </button>
              </div>
            </div>

            {/* Cột phải: Floating Dashboard & Phone Mockup */}
            <div className="flex items-center justify-center relative w-full h-100 md:h-125">
              {/* Glow background */}
              <div className="absolute w-72 h-72 bg-[#c3f400]/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>

              {/* Dashboard Preview Mockup (Scroll Zoom) */}
              <div
                ref={dashboardMockupRef}
                style={{ transform: 'perspective(1000px) rotateY(-15deg) rotateX(10deg)' }}
                className="absolute w-11/12 max-w-115 transition-transform duration-100 ease-out z-10 animate-[float-mockup_6s_ease-in-out_infinite]"
              >
                <MiniDashboardMockup />
              </div>

              {/* Mobile app preview mockup floating in front */}
              <div className="absolute right-4 bottom-4 w-40 border border-white/15 bg-[#131313]/90 rounded-[28px] p-3.5 shadow-2xl z-20 backdrop-blur-xl animate-[float-phone_5s_ease-in-out_infinite_1.5s] md:right-8">
                {/* Speaker & notch */}
                <div className="w-16 h-3 bg-black/60 mx-auto rounded-full mb-3 flex items-center justify-center gap-1">
                  <div className="w-8 h-0.5 bg-white/20 rounded-full"></div>
                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                </div>
                {/* Phone screen container */}
                <div className="space-y-2 select-none">
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-bold font-mono text-white/40">KINETIC 09</span>
                    <span className="text-[7px] text-[#c3f400]">86%</span>
                  </div>
                  <div className="bg-white/3 rounded-lg p-2 border border-white/5 space-y-1">
                    <div className="text-[8px] font-bold text-white">Daily Target</div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-[#c3f400] h-full w-[70%]"></div>
                    </div>
                  </div>
                  <div className="bg-white/3 rounded-lg p-2 border border-white/5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[6px] text-white/50">Heart Rate</div>
                      <div className="text-[9px] font-bold text-red-500">142 BPM</div>
                    </div>
                    <Heart size={12} className="text-red-500 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STORY SECTION */}
        <section id="story" className="relative overflow-hidden px-5 py-32 md:px-16">
          <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
            <div className="relative z-10 space-y-12">
              <div className="fade-up">
                <h2 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">VIẾT LẠI GIỚI HẠN</h2>
                <p className="text-lg leading-relaxed text-[#c4c9ac]">
                  Chúng tôi không chỉ xây cơ bắp; chúng tôi rèn sức bền, kỷ luật và khả năng chịu tải. Kinetic Noir ra đời để theo đuổi hiệu suất cơ thể tối đa.
                </p>
              </div>
              <div className="fade-up delay-100">
                <h3 className="mb-4 text-2xl font-bold text-white">THIẾT KẾ CHO SỰ XUẤT SẮC</h3>
                <p className="leading-relaxed text-[#c4c9ac]">
                  Mỗi chương trình là sự kết hợp giữa khoa học thể thao, kích thích cường độ cao và quy trình phục hồi chính xác.
                </p>
              </div>
              <div className="fade-up delay-200">
                <h3 className="mb-4 text-2xl font-bold text-white">PHƯƠNG PHÁP KINETIC</h3>
                <p className="leading-relaxed text-[#c4c9ac]">
                  Hệ thống tập luyện riêng sử dụng phản hồi sinh trắc để giữ bạn ở vùng hiệu suất tốt nhất.
                </p>
              </div>
            </div>

            <div className="glass-card group relative aspect-square overflow-hidden rounded-2xl md:aspect-4/5">
              <img
                alt="Vận động viên tập luyện trong phòng gym cao cấp phong cách tối"
                className="h-full w-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                src={heroImage}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent opacity-70" />
            </div>
          </div>
          <div className="parallax-element pointer-events-none absolute -right-20 top-0 hidden select-none text-[300px] font-black text-white/5 md:block">
            NOIR
          </div>
        </section>

        {/* COUNTER SECTION */}
        <section id="stats" className="border-y border-white/5 bg-[#0e0e0e] px-5 py-24 md:px-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 text-center md:grid-cols-3">
            {stats.map((stat, index) => (
              <div className={`fade-up ${index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : ''}`} key={stat.label}>
                <div
                  className="counter mb-2 text-5xl font-black text-[#c3f400] md:text-7xl"
                  data-target={stat.target}
                  data-format={stat.format}
                >
                  0
                </div>
                <div className="font-mono text-sm uppercase tracking-widest text-[#c4c9ac]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURE CARDS SECTION: Hover Lift & Neon Borders */}
        <section id="paths" className="overflow-hidden px-5 py-32 md:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
              <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">CHỌN LỘ TRÌNH CỦA BẠN</h2>
              <p className="mx-auto max-w-xl text-lg leading-relaxed text-[#c4c9ac]">
                Các phương pháp được thiết kế chính xác cho từng mục tiêu hiệu suất riêng biệt.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {workoutPaths.map((path) => (
                <article
                  className={`glass-card animate-float group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-[#c3f400]/40 hover:shadow-[0_15px_40px_rgba(195,244,0,0.12)] ${path.delay}`}
                  key={path.label}
                >
                  <div className="absolute right-0 top-0 p-6 text-white/20 opacity-40 transition-opacity group-hover:opacity-100">
                    <WorkoutIcon name={path.icon} />
                  </div>
                  <span className="mb-8 inline-block rounded-full border border-[#c3f400] px-3 py-1 font-mono text-sm uppercase text-[#c3f400]">
                    {path.label}
                  </span>
                  <h3 className="mb-4 text-2xl font-bold text-white">{path.title}</h3>
                  <p className="mb-8 leading-relaxed text-[#c4c9ac]">{path.copy}</p>
                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full bg-[#c3f400] ${path.progress}`} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TRAINERS SECTION */}
        <section id="trainers" className="bg-[#1c1b1b] px-5 py-32 md:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">LÀM CHỦ KỸ NĂNG</h2>
                <p className="text-lg leading-relaxed text-[#c4c9ac]">Được dẫn dắt bởi những huấn luyện viên hiệu suất kỷ luật hàng đầu.</p>
              </div>
              <a href="#final-cta" className="border-b border-[#c3f400] pb-2 font-mono text-sm uppercase tracking-widest text-[#c3f400] transition-colors hover:text-white">
                Gặp đội ngũ
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {trainers.map((trainer) => (
                <article
                  className="tilt-card group relative aspect-3/4 cursor-pointer overflow-hidden rounded-2xl"
                  onPointerMove={handleTiltMove}
                  onPointerLeave={resetTilt}
                  key={trainer.name}
                >
                  <img
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                    src={trainer.image}
                    alt={`${trainer.name}, ${trainer.role}`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-tight text-[#c3f400]">{trainer.role}</p>
                    <h3 className="text-2xl font-bold text-white">{trainer.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION: Neon Glow Pulsing Button */}
        <section id="final-cta" className="relative overflow-hidden border-t border-white/5 px-5 py-40 text-center md:px-16">
          <div className="relative z-10 mx-auto max-w-7xl">
            <h2 className="fade-up mb-8 text-[48px] font-black leading-none text-white md:text-[80px]">ĐÊM NAY THUỘC VỀ BẠN.</h2>
            <p className="fade-up delay-100 mx-auto mb-16 max-w-2xl text-lg leading-relaxed text-[#c4c9ac]">
              Giữ chỗ trong đợt tuyển thành viên tinh anh tiếp theo. Số lượng hội viên giới hạn cho những người đòi hỏi sự xuất sắc.
            </p>
            <span
              className="magnetic-wrap fade-up delay-200"
              onPointerMove={handleMagneticMove}
              onPointerLeave={resetMagnetic}
            >
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="group relative inline-flex overflow-hidden rounded-full bg-[#c3f400] px-16 py-6 text-2xl font-black text-[#283500] shadow-[0_0_30px_rgba(195,244,0,0.3)] hover:shadow-[0_0_60px_rgba(195,244,0,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="relative z-10">GIỮ CHỖ NGAY</span>
                <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 group-hover:translate-y-0" />
              </button>
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[40px_40px] opacity-[0.03]" />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0e0e0e] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 md:flex-row md:flex-nowrap md:px-16">
          <div className="shrink-0 whitespace-nowrap text-3xl font-black text-white">KINETIC NOIR</div>
          <div className="flex flex-wrap justify-center gap-8 md:flex-nowrap md:gap-6">
            {['Bảo mật', 'Điều khoản', 'Liên hệ', 'Instagram', 'YouTube'].map((item) => (
              <a className="whitespace-nowrap font-mono text-sm uppercase tracking-widest text-[#656464] transition-colors hover:text-white" href="#hero" key={item}>
                {item}
              </a>
            ))}
          </div>
          <div className="shrink-0 whitespace-nowrap text-center font-mono text-sm uppercase tracking-widest text-[#656464] md:text-right">
            © 2026 KINETIC NOIR. CHỈ DÀNH CHO HIỆU SUẤT ĐỈNH CAO.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
