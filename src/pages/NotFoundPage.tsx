import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFoundPage.css';
import { 
  Home, 
  Dumbbell, 
  UserCheck, 
  TrendingUp, 
  Menu, 
  ChevronLeft 
} from 'lucide-react';

function NotFoundPage() {
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  // 1. Hiệu ứng quét đèn Spotlight theo con trỏ chuột
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setSpotlight({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 2. Kích hoạt hiệu ứng xuất hiện (Fade-in Slide-up) khi trang được tải xong
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="not-found-container">
      {/* TopAppBar Shell */}
      <header className="not-found-header">
        <div className="mobile-logo-section">
          <Menu className="text-[#c5c9ac] cursor-pointer" size={24} />
          <h1 className="mobile-logo-title">
            KINÉTIC
          </h1>
        </div>
        <div className="desktop-title-section">
          <span className="desktop-title">
            404 Error
          </span>
        </div>
        <div className="flex items-center gap-2"></div>
      </header>

      {/* Main Content Canvas */}
      <main className="not-found-main">
        {/* Background Atmospheric Spotlight */}
        <div 
          className="spotlight-bg"
          style={{
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(212, 255, 0, 0.08) 0%, rgba(18, 18, 18, 0) 60%)`
          }}
        />
        <div className="static-glow"></div>

        <section className="not-found-content">
          {/* Hero Kettlebell Composition */}
          <div className={`kettlebell-container delay-100 ${isMounted ? 'mounted' : ''}`}>
            <div className="kettlebell-glow"></div>
            <img 
              alt="404 Error Kettlebell" 
              className="kettlebell-img" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBymURyMJRcDA_As4YGWTe6Ejbd0pe8UIf2L47_qSmwQucPBS1Ea-iyPK9frsAc_wupb2SpLeylDSW4QFtc1mQioQNLdyzhG1imoH9IuUcBZzd-fXziQUe_RaeK4fJ-Th34bSsV18LEVxjMt17q44OzC3uDy5ZIdgzJIkWj-JJfVKzQXtfEbMwwLncDfuPLkPtq2SxH5jRALLrJuJXvnidkozNOo-333tlAmByAC1MYIZVoSwzN4Q51l1KL61tym7csdp02jb6jXvI"
            />
          </div>

          {/* Error Messaging */}
          <div className="error-msg-container">
            <h2 className={`error-title delay-200 ${isMounted ? 'mounted' : ''}`}>
              404 ERROR
            </h2>
            <div className={`error-info delay-300 ${isMounted ? 'mounted' : ''}`}>
              <h3 className="error-subtitle">Looks like you missed a rep.</h3>
              <p className="error-text">
                Trang này không tồn tại trong giáo án tập luyện của chúng tôi. Hãy để chúng tôi đưa bạn trở lại mục tiêu của mình.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`action-buttons delay-400 ${isMounted ? 'mounted' : ''}`}>
            <Link 
              className="btn-primary"
              to="/dashboard"
            >
              Về trang chủ Dashboard
            </Link>
            <button 
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={16} /> Quay lại trang trước
            </button>
          </div>

          {/* Kinetic Branding Accent */}
          <div className={`branding-accent delay-500 ${isMounted ? 'mounted' : ''}`}>
            <div className="branding-line"></div>
            <span className="branding-text">Precision Performance</span>
            <div className="branding-line"></div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="mobile-nav">
        <Link className="mobile-nav-link" to="/dashboard">
          <Home size={20} />
          <span className="mobile-nav-text">Home</span>
        </Link>
        <a className="mobile-nav-link" href="#">
          <Dumbbell size={20} />
          <span className="mobile-nav-text">Train</span>
        </a>
        <a className="mobile-nav-link" href="#">
          <UserCheck size={20} />
          <span className="mobile-nav-text">Team</span>
        </a>
        <a className="mobile-nav-link" href="#">
          <TrendingUp size={20} />
          <span className="mobile-nav-text">Data</span>
        </a>
      </nav>
    </div>
  );
}

export default NotFoundPage;