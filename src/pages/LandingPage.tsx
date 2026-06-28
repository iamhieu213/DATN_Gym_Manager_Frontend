import { useEffect, useRef, type PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Heart, Dumbbell, HeartPulse } from 'lucide-react';
import './LandingPage.css';
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
    <div className="mini-dashboard glass-card">
      {/* Top bar */}
      <div className="mockup-top">
        <div className="mockup-circles">
          <div className="circle-red"></div>
          <div className="circle-yellow"></div>
          <div className="circle-green"></div>
        </div>
        <span className="mockup-os-text">Kinetic Noir OS</span>
        <div className="mockup-zap-icon">
          <Zap size={10} className="fill-current" />
        </div>
      </div>
      {/* Grid */}
      <div className="mockup-grid">
        <div className="mockup-grid-card">
          <span className="mockup-card-label">Hội viên mới</span>
          <div className="mockup-card-value-highlight">+12.4%</div>
        </div>
        <div className="mockup-grid-card">
          <span className="mockup-card-label">Calo tiêu hao</span>
          <div className="mockup-card-value">142.5K kcal</div>
        </div>
        <div className="mockup-grid-card">
          <span className="mockup-card-label">Mục tiêu tuần</span>
          <div className="mockup-card-value-highlight">94.8%</div>
        </div>
      </div>
      {/* Chart preview */}
      <div className="mockup-chart-card">
        <div className="mockup-chart-header">
          <span className="mockup-chart-label">Tần suất luyện tập (giờ)</span>
          <span className="mockup-live-badge">LIVE</span>
        </div>
        <div className="mockup-bars">
          <div className="mockup-bar h-35"></div>
          <div className="mockup-bar h-45"></div>
          <div className="mockup-bar h-40"></div>
          <div className="mockup-bar h-60"></div>
          <div className="mockup-bar h-52"></div>
          <div className="mockup-bar h-75 highlight-bg"></div>
          <div className="mockup-bar h-95 highlight"></div>
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
    <div className="landing-container">
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
      <header className="landing-header">
        <nav className="landing-nav">
          <a href="#hero" className="landing-logo">
            KINETIC NOIR
          </a>
          <div className="landing-menu">
            <a className="menu-item active" href="#paths">Bài tập</a>
            <a className="menu-item" href="#story">Câu chuyện</a>
            <a className="menu-item" href="#trainers">HLV</a>
            <a className="menu-item" href="#stats">Thành tích</a>
          </div>
          <div className="landing-nav-right">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-login"
            >
              Đăng nhập
            </button>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="btn-join"
            >
              Tham gia
            </button>
          </div>
        </nav>
      </header>

      {/* Main Sections */}
      <main>
        {/* HERO SECTION: Hai cột cao cấp có Floating Dashboard Mockup + Glow CTA */}
        <section id="hero" className="hero-section">
          <div className="hero-grid">
            {/* Cột trái: Tiêu đề & Glow CTA */}
            <div className="hero-left">
              <span className="hero-tagline hero-reveal hero-reveal-1">
                Hiệu suất không thỏa hiệp
              </span>
              <h1 className="hero-title hero-reveal hero-reveal-2" aria-label={headline}>
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
              <p className="hero-text hero-reveal hero-reveal-3">
                Vượt qua giới hạn tiềm năng của bạn. Trải nghiệm hệ thống tập luyện cường độ cao dành cho những người theo đuổi kỷ luật và sức mạnh.
              </p>
              
              {/* CTA Glow button */}
              <div className="hero-cta hero-reveal hero-reveal-4">
                <span
                  className="magnetic-wrap"
                  onPointerMove={handleMagneticMove}
                  onPointerLeave={resetMagnetic}
                >
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="btn-cta-primary"
                  >
                    <span className="btn-cta-primary-bg" />
                    <span className="btn-cta-primary-content">
                      THAM GIA NGAY <Zap size={16} className="fill-current text-[#283500]" />
                    </span>
                  </button>
                </span>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-cta-secondary"
                >
                  Xem Dashboard
                </button>
              </div>
            </div>

            {/* Cột phải: Floating Dashboard & Phone Mockup */}
            <div className="hero-right">
              {/* Glow background */}
              <div className="hero-glow"></div>

              {/* Dashboard Preview Mockup (Scroll Zoom) */}
              <div
                ref={dashboardMockupRef}
                style={{ transform: 'perspective(1000px) rotateY(-15deg) rotateX(10deg)' }}
                className="mockup-wrapper"
              >
                <MiniDashboardMockup />
              </div>

              {/* Mobile app preview mockup floating in front */}
              <div className="phone-wrapper">
                {/* Speaker & notch */}
                <div className="phone-notch">
                  <div className="notch-line"></div>
                  <div className="notch-dot"></div>
                </div>
                {/* Phone screen container */}
                <div className="phone-content">
                  <div className="phone-header">
                    <span className="phone-system">KINETIC 09</span>
                    <span className="phone-percent">86%</span>
                  </div>
                  <div className="phone-card">
                    <div className="phone-card-title">Daily Target</div>
                    <div className="phone-progress-outer">
                      <div className="phone-progress-inner"></div>
                    </div>
                  </div>
                  <div className="phone-card flex-row">
                    <div>
                      <div className="phone-pulse-label">Heart Rate</div>
                      <div className="phone-pulse-val">142 BPM</div>
                    </div>
                    <Heart size={12} className="text-red-500 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STORY SECTION */}
        <section id="story" className="story-section">
          <div className="story-grid">
            <div className="story-left">
              <div className="fade-up">
                <h2 className="story-title">VIẾT LẠI GIỚI HẠN</h2>
                <p className="story-desc">
                  Chúng tôi không chỉ xây cơ bắp; chúng tôi rèn sức bền, kỷ luật và khả năng chịu tải. Kinetic Noir ra đời để theo đuổi hiệu suất cơ thể tối đa.
                </p>
              </div>
              <div className="fade-up delay-100">
                <h3 className="story-subtitle">THIẾT KẾ CHO SỰ XUẤT SẮC</h3>
                <p className="story-desc-sub">
                  Mỗi chương trình là sự kết hợp giữa khoa học thể thao, kích thích cường độ cao và quy trình phục hồi chính xác.
                </p>
              </div>
              <div className="fade-up delay-200">
                <h3 className="story-subtitle">PHƯƠNG PHÁP KINETIC</h3>
                <p className="story-desc-sub">
                  Hệ thống tập luyện riêng sử dụng phản hồi sinh trắc để giữ bạn ở vùng hiệu suất tốt nhất.
                </p>
              </div>
            </div>

            <div className="story-image-card glass-card">
              <img
                alt="Vận động viên tập luyện trong phòng gym cao cấp phong cách tối"
                className="story-img"
                src={heroImage}
              />
              <div className="story-img-overlay" />
            </div>
          </div>
          <div className="bg-text-noir">
            NOIR
          </div>
        </section>

        {/* COUNTER SECTION */}
        <section id="stats" className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div className={`fade-up ${index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : ''}`} key={stat.label}>
                <div
                  className="counter stat-val"
                  data-target={stat.target}
                  data-format={stat.format}
                >
                  0
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURE CARDS SECTION: Hover Lift & Neon Borders */}
        <section id="paths" className="paths-section">
          <div className="paths-container">
            <div className="paths-header">
              <h2 className="paths-title">CHỌN LỘ TRÌNH CỦA BẠN</h2>
              <p className="paths-desc">
                Các phương pháp được thiết kế chính xác cho từng mục tiêu hiệu suất riêng biệt.
              </p>
            </div>

            <div className="paths-grid">
              {workoutPaths.map((path) => (
                <article
                  className={`path-card glass-card ${path.delay}`}
                  key={path.label}
                >
                  <div className="path-card-icon">
                    <WorkoutIcon name={path.icon} />
                  </div>
                  <span className="path-tag">
                    {path.label}
                  </span>
                  <h3 className="path-title">{path.title}</h3>
                  <p className="path-copy">{path.copy}</p>
                  <div className="path-progress-bar">
                    <div className={`path-progress ${path.progress}`} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TRAINERS SECTION */}
        <section id="trainers" className="trainers-section">
          <div className="trainers-container">
            <div className="trainers-header">
              <div>
                <h2 className="trainers-title">LÀM CHỦ KỸ NĂNG</h2>
                <p className="trainers-desc">Được dẫn dắt bởi những huấn luyện viên hiệu suất kỷ luật hàng đầu.</p>
              </div>
              <a href="#final-cta" className="btn-team-link">
                Gặp đội ngũ
              </a>
            </div>

            <div className="trainers-grid">
              {trainers.map((trainer) => (
                <article
                  className="trainer-card"
                  onPointerMove={handleTiltMove}
                  onPointerLeave={resetTilt}
                  key={trainer.name}
                >
                  <img
                    className="trainer-img"
                    src={trainer.image}
                    alt={`${trainer.name}, ${trainer.role}`}
                  />
                  <div className="trainer-overlay" />
                  <div className="trainer-info">
                    <p className="trainer-role">{trainer.role}</p>
                    <h3 className="trainer-name">{trainer.name}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION: Neon Glow Pulsing Button */}
        <section id="final-cta" className="final-cta-section">
          <div className="final-cta-container">
            <h2 className="final-cta-title fade-up">ĐÊM NAY THUỘC VỀ BẠN.</h2>
            <p className="final-cta-desc fade-up delay-100">
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
                className="btn-final-cta"
              >
                <span className="btn-final-cta-bg" />
                <span className="btn-final-cta-content">GIỮ CHỖ NGAY</span>
              </button>
            </span>
          </div>
          <div className="final-cta-pattern" />
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-logo">KINETIC NOIR</div>
          <div className="footer-links">
            {['Bảo mật', 'Điều khoản', 'Liên hệ', 'Instagram', 'YouTube'].map((item) => (
              <a className="footer-link" href="#hero" key={item}>
                {item}
              </a>
            ))}
          </div>
          <div className="footer-copy">
            © 2026 KINETIC NOIR. CHỈ DÀNH CHO HIỆU SUẤT ĐỈNH CAO.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
