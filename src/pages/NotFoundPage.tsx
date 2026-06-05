import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans antialiased selection:bg-[#caf300] selection:text-[#171e00] overflow-x-hidden flex flex-col justify-between">
      {/* TopAppBar Shell */}
      <header className="bg-[#131313] border-b border-[#444932] fixed top-0 left-0 w-full z-100 h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-4 lg:hidden">
          <Menu className="text-[#c5c9ac] cursor-pointer" size={24} />
          <h1 className="font-extrabold text-2xl tracking-tighter text-[#caf300] uppercase font-mono">
            KINÉTIC
          </h1>
        </div>
        <div className="hidden lg:block">
          <span className="text-xl font-bold tracking-tight text-[#caf300] uppercase font-mono">
            404 Error
          </span>
        </div>
        <div className="flex items-center gap-2"></div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 pt-16 flex items-center justify-center relative min-h-[calc(100vh-64px)] pb-16 lg:pb-0">
        {/* Background Atmospheric Spotlight */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-75"
          style={{
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(212, 255, 0, 0.08) 0%, rgba(18, 18, 18, 0) 60%)`
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#caf300] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

        <section className="max-w-4xl w-full px-6 py-16 flex flex-col items-center text-center z-10">
          {/* Hero Kettlebell Composition */}
          <div 
            className={`relative w-full max-w-105 mb-8 group transition-all duration-700 delay-100 transform ${
              isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <div className="absolute -inset-4 bg-[#caf300] opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-500"></div>
            <img 
              alt="404 Error Kettlebell" 
              className="w-full h-auto drop-shadow-[0_0_30px_rgba(212,255,0,0.2)]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBymURyMJRcDA_As4YGWTe6Ejbd0pe8UIf2L47_qSmwQucPBS1Ea-iyPK9frsAc_wupb2SpLeylDSW4QFtc1mQioQNLdyzhG1imoH9IuUcBZzd-fXziQUe_RaeK4fJ-Th34bSsV18LEVxjMt17q44OzC3uDy5ZIdgzJIkWj-JJfVKzQXtfEbMwwLncDfuPLkPtq2SxH5jRALLrJuJXvnidkozNOo-333tlAmByAC1MYIZVoSwzN4Q51l1KL61tym7csdp02jb6jXvI"
            />
          </div>

          {/* Error Messaging */}
          <div className="space-y-4">
            <h2 
              className={`font-black text-5xl tracking-tighter text-[#caf300] uppercase transition-all duration-700 delay-200 transform cursor-default hover:text-shadow-[2px_0_#D4FF00,-2px_0_#ffffff] ${
                isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              404 ERROR
            </h2>
            <div 
              className={`space-y-2 transition-all duration-700 delay-300 transform ${
                isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              <h3 className="text-2xl font-bold text-[#e5e2e1]">Looks like you missed a rep.</h3>
              <p className="text-lg text-[#c5c9ac] max-w-lg mx-auto">
                Trang này không tồn tại trong giáo án tập luyện của chúng tôi. Hãy để chúng tôi đưa bạn trở lại mục tiêu của mình.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className={`mt-10 flex flex-col sm:flex-row items-center gap-4 transition-all duration-700 delay-400 transform ${
              isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <Link 
              className="px-10 py-4 bg-[#caf300] text-[#171e00] font-bold text-sm uppercase tracking-tight hover:bg-[#b0d500] transition-all scale-100 active:scale-95 shadow-[0_0_20px_rgba(212,255,0,0.15)] hover:shadow-[0_0_30px_rgba(212,255,0,0.3)]"
              to="/dashboard"
            >
              Về trang chủ Dashboard
            </Link>
            <button 
              className="px-10 py-4 border border-[#8f9378] text-[#e5e2e1] font-bold text-sm uppercase tracking-tight hover:bg-[#2a2a2a] transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={16} /> Quay lại trang trước
            </button>
          </div>

          {/* Kinetic Branding Accent */}
          <div 
            className={`mt-12 flex items-center gap-4 opacity-30 transition-all duration-700 delay-500 transform ${
              isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <div className="h-px w-12 bg-[#444932]"></div>
            <span className="text-xs tracking-[0.4em] uppercase text-[#c5c9ac]">Precision Performance</span>
            <div className="h-px w-12 bg-[#444932]"></div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-16 bg-[#0e0e0e] border-t border-[#444932] px-6">
        <Link className="flex flex-col items-center justify-center text-[#c5c9ac] hover:text-[#caf300] transition-transform active:scale-90" to="/dashboard">
          <Home size={20} />
          <span className="text-xs font-semibold mt-1">Home</span>
        </Link>
        <a className="flex flex-col items-center justify-center text-[#c5c9ac] hover:text-[#caf300] transition-transform active:scale-90" href="#">
          <Dumbbell size={20} />
          <span className="text-xs font-semibold mt-1">Train</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#c5c9ac] hover:text-[#caf300] transition-transform active:scale-90" href="#">
          <UserCheck size={20} />
          <span className="text-xs font-semibold mt-1">Team</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#c5c9ac] hover:text-[#caf300] transition-transform active:scale-90" href="#">
          <TrendingUp size={20} />
          <span className="text-xs font-semibold mt-1">Data</span>
        </a>
      </nav>
    </div>
  );
}

export default NotFoundPage;