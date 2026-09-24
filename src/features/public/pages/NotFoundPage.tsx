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
    <div className="min-h-screen flex flex-col justify-between bg-[#131313] text-[#e5e2e1] font-sans antialiased overflow-x-hidden selection:bg-brand selection:text-[#171e00]">
      {/* TopAppBar Shell */}
      <header className="fixed top-0 left-0 z-[100] flex h-16 w-full items-center justify-between bg-[#131313] px-6 border-b border-[#444932]">
        <div className="flex items-center gap-4 lg:hidden">
          <Menu className="text-[#c5c9ac] cursor-pointer" size={24} />
          <h1 className="m-0 font-mono text-2xl font-extrabold uppercase tracking-tighter text-brand">
            KINÉTIC
          </h1>
        </div>
        <div className="hidden lg:block">
          <span className="font-mono text-xl font-bold uppercase tracking-tight text-brand">
            404 Error
          </span>
        </div>
        <div className="flex items-center gap-2"></div>
      </header>

      {/* Main Content Canvas */}
      <main className="relative flex flex-1 min-h-[calc(100vh-64px)] items-center justify-center pt-16 pb-16 lg:pb-0">
        {/* Background Atmospheric Spotlight */}
        <div
          className="absolute inset-0 pointer-events-none [transition:all_75ms_ease]"
          style={{
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(212, 255, 0, 0.08) 0%, rgba(18, 18, 18, 0) 60%)`
          }}
        />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-brand opacity-[0.03] blur-[120px] pointer-events-none"></div>

        <section className="z-10 flex w-full max-w-4xl flex-col items-center py-16 px-6 text-center">
          {/* Hero Kettlebell Composition */}
          <div className={`group relative mb-8 w-full max-w-[420px] [transition:all_0.7s_ease_100ms] ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="absolute -inset-4 rounded-full bg-brand opacity-5 blur-xl [transition:opacity_0.5s_ease] group-hover:opacity-10"></div>
            <img
              alt="404 Error Kettlebell"
              className="w-full h-auto drop-shadow-[0_0_30px_rgba(212,255,0,0.2)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBymURyMJRcDA_As4YGWTe6Ejbd0pe8UIf2L47_qSmwQucPBS1Ea-iyPK9frsAc_wupb2SpLeylDSW4QFtc1mQioQNLdyzhG1imoH9IuUcBZzd-fXziQUe_RaeK4fJ-Th34bSsV18LEVxjMt17q44OzC3uDy5ZIdgzJIkWj-JJfVKzQXtfEbMwwLncDfuPLkPtq2SxH5jRALLrJuJXvnidkozNOo-333tlAmByAC1MYIZVoSwzN4Q51l1KL61tym7csdp02jb6jXvI"
            />
          </div>

          {/* Error Messaging */}
          <div className="flex flex-col gap-4">
            <h2 className={`m-0 cursor-default text-5xl font-black uppercase tracking-tighter text-brand [transition:all_0.7s_ease_200ms] hover:[text-shadow:2px_0_#D4FF00,-2px_0_#fff] ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              404 ERROR
            </h2>
            <div className={`flex flex-col gap-2 [transition:all_0.7s_ease_300ms] ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
              <h3 className="m-0 text-2xl font-bold text-[#e5e2e1]">Looks like you missed a rep.</h3>
              <p className="mx-auto max-w-lg text-lg text-[#c5c9ac]">
                Trang này không tồn tại trong giáo án tập luyện của chúng tôi. Hãy để chúng tôi đưa bạn trở lại mục tiêu của mình.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`mt-10 flex flex-col items-center gap-4 [transition:all_0.7s_ease_400ms] sm:flex-row ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <Link
              className="inline-block cursor-pointer border-none bg-brand px-10 py-4 text-sm font-bold uppercase tracking-[-0.01em] text-[#171e00] no-underline [transition:all_0.2s_ease] shadow-[0_0_20px_rgba(212,255,0,0.15)] hover:bg-brand hover:shadow-[0_0_30px_rgba(212,255,0,0.3)] active:scale-95"
              to="/dashboard"
            >
              Về trang chủ Dashboard
            </Link>
            <button
              className="flex cursor-pointer items-center gap-2 border border-[#8f9378] bg-transparent px-10 py-4 text-sm font-bold uppercase tracking-[-0.01em] text-[#e5e2e1] [transition:all_0.2s_ease] hover:bg-[#2a2a2a] active:scale-95"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={16} /> Quay lại trang trước
            </button>
          </div>

          {/* Kinetic Branding Accent */}
          <div className={`mt-12 flex items-center gap-4 [transition:all_0.7s_ease_500ms] ${isMounted ? 'translate-y-0 opacity-30' : 'translate-y-5 opacity-0'}`}>
            <div className="h-px w-12 bg-[#444932]"></div>
            <span className="text-xs uppercase tracking-[0.4em] text-[#c5c9ac]">Precision Performance</span>
            <div className="h-px w-12 bg-[#444932]"></div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around bg-[#0e0e0e] px-6 border-t border-[#444932] lg:hidden">
        <Link className="flex flex-col items-center justify-center text-[#c5c9ac] no-underline [transition:transform_0.2s_ease] hover:text-brand active:scale-90" to="/dashboard">
          <Home size={20} />
          <span className="mt-1 text-xs font-semibold">Home</span>
        </Link>
        <a className="flex flex-col items-center justify-center text-[#c5c9ac] no-underline [transition:transform_0.2s_ease] hover:text-brand active:scale-90" href="#">
          <Dumbbell size={20} />
          <span className="mt-1 text-xs font-semibold">Train</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#c5c9ac] no-underline [transition:transform_0.2s_ease] hover:text-brand active:scale-90" href="#">
          <UserCheck size={20} />
          <span className="mt-1 text-xs font-semibold">Team</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#c5c9ac] no-underline [transition:transform_0.2s_ease] hover:text-brand active:scale-90" href="#">
          <TrendingUp size={20} />
          <span className="mt-1 text-xs font-semibold">Data</span>
        </a>
      </nav>
    </div>
  );
}

export default NotFoundPage;
