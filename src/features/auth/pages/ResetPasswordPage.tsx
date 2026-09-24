import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/kinetic-hero.png';
import { resetPassword } from '../services/authApi';
import { KeyRound, ShieldCheck, RefreshCw, ArrowLeft, Eye, EyeOff } from 'lucide-react';

type ResetPasswordPageProps = {};

function ResetPasswordPage({}: ResetPasswordPageProps) {
  const navigate = useNavigate();
  const bgRef = useRef<HTMLImageElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Hiệu ứng di chuyển ảnh nền (Parallax) theo chuột
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const moveX = (event.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (event.clientY - window.innerHeight / 2) * 0.01;

      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Hiệu ứng viền phát sáng (Spotlight Border) tương tác trên khung kính
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        panel.style.borderImage = `radial-gradient(circle at ${x}px ${y}px, rgba(171, 214, 0, 0.4), rgba(255, 255, 255, 0.08)) 1`;
      } else {
        panel.style.borderImage = 'none';
        panel.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Logic kiểm tra độ mạnh của mật khẩu tự động
  const getStrength = (pass: string) => {
    if (!pass) return { label: 'Chưa nhập', className: 'bg-white/10', width: '0%' };
    if (pass.length < 6) return { label: 'Yếu', className: 'bg-red-500 shadow-[0_0_8px_#ef4444]', width: '33.3%' };

    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);

    if (hasLetters && hasNumbers && hasSpecial && pass.length >= 8) {
      return { label: 'Mạnh', className: 'bg-brand shadow-[0_0_8px_var(--color-brand)]', width: '100%' };
    }
    return { label: 'Trung bình', className: 'bg-brand/70 shadow-[0_0_8px_rgba(195,244,0,0.5)]', width: '66.6%' };
  };

  const strength = getStrength(password);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (password.length < 6) {
      alert('Mật khẩu mới phải dài từ 6 ký tự trở lên.');
      return;
    }

    const resetPasswordToken = sessionStorage.getItem('resetPasswordToken');
    if (!resetPasswordToken) {
      alert('Yêu cầu đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng thực hiện lại từ đầu.');
      navigate('/forgot-password');
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        resetPasswordToken,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });

      // Clear sessions
      sessionStorage.removeItem('resetPasswordToken');
      sessionStorage.removeItem('auth_email');

      alert('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.');
      navigate('/login');
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Đặt lại mật khẩu thất bại.';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col overflow-y-auto box-border bg-[#131313] text-[#e5e2e1] font-sans">
      {/* Mesh background tĩnh */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a] bg-[radial-gradient(circle_at_20%_30%,rgba(171,214,0,0.05)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(171,214,0,0.08)_0%,transparent_40%)]">
        <img
          ref={bgRef}
          className="h-full w-full object-cover opacity-20 grayscale brightness-50 blur-[2px] transition-transform duration-100 ease-out"
          src={heroImage}
          alt="Hình nền phòng Gym Cinematic"
        />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#131313]/10 box-border px-6 py-4 backdrop-blur-xl md:px-16">
        <div className="text-xl font-black tracking-tight text-brand md:text-2xl">
          KINETIC NOIR
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-brand hover:text-brand"
          aria-label="Quay lại"
        >
          X
        </button>
      </nav>

      {/* Main Content Container */}
      <main className="flex flex-1 items-center justify-center box-border px-5 py-12">
        <div
          ref={panelRef}
          className="w-full max-w-120 rounded-4xl border border-white/8 bg-white/3 p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-500 box-border hover:border-brand/30 md:p-12"
        >
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-brand/10">
              <RefreshCw className="h-6 w-6 text-brand" />
            </div>
            <h1 className="mb-2 mt-0 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Đặt lại mật khẩu
            </h1>
            <p className="m-0 text-sm text-[#c4c9ac]">
              Tạo mật khẩu mới an toàn cho tài khoản Elite của bạn.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Mật khẩu mới */}
            <div className="group relative">
              <label
                className="mb-2 ml-1 block font-mono text-xs uppercase tracking-widest text-brand"
                htmlFor="new_password"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 transition-colors duration-200 group-focus-within:text-brand" />
                <input
                  className="w-full rounded-lg border-0 border-b-2 border-white/10 bg-black/60 py-4 pl-12 pr-12 text-white outline-none transition-all duration-300 box-border placeholder:text-white/20 focus:border-brand focus:bg-black/90"
                  id="new_password"
                  name="new_password"
                  placeholder="••••••••"
                  type={showNewPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-white/30 transition-colors duration-200 hover:text-brand"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="group relative">
              <label
                className="mb-2 ml-1 block font-mono text-xs uppercase tracking-widest text-brand"
                htmlFor="confirm_password"
              >
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 transition-colors duration-200 group-focus-within:text-brand" />
                <input
                  className="w-full rounded-lg border-0 border-b-2 border-white/10 bg-black/60 py-4 pl-12 pr-12 text-white outline-none transition-all duration-300 box-border placeholder:text-white/20 focus:border-brand focus:bg-black/90"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-white/30 transition-colors duration-200 hover:text-brand"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Thanh hiển thị độ mạnh mật khẩu */}
            <div className="flex items-center gap-2 px-1">
              <div className="h-1 flex-grow overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full transition-all duration-500 ${strength.className}`} style={{ width: strength.width }} />
              </div>
              <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-white/50">
                Độ mạnh: {strength.label}
              </span>
            </div>

            {/* Nút gửi */}
            <button
              className="group relative w-full cursor-pointer overflow-hidden rounded-full border-none bg-brand py-5 text-lg font-black uppercase text-[#161e00] shadow-[0_0_20px_rgba(195,244,0,0.2)] transition-all duration-300 hover:scale-102 active:scale-95 disabled:cursor-not-allowed disabled:opacity-75"
              type="submit"
              disabled={loading}
            >
              <span className="absolute inset-0 z-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative z-10">{loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 border-none bg-transparent font-mono text-sm uppercase text-[#c4c9ac] transition-colors duration-200 hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between gap-6 border-t border-white/10 bg-[#131313] box-border px-6 py-8 md:flex-row md:px-16">
        <div className="text-lg font-black tracking-tight text-brand">KINETIC NOIR</div>
        <div className="flex gap-6 font-mono text-xs text-[#c4c9ac]">
          <a className="text-[#c4c9ac] no-underline transition-colors duration-200 hover:text-brand" href="#">Chính sách bảo mật</a>
          <a className="text-[#c4c9ac] no-underline transition-colors duration-200 hover:text-brand" href="#">Điều khoản dịch vụ</a>
          <a className="text-[#c4c9ac] no-underline transition-colors duration-200 hover:text-brand" href="#">Giao thức bảo mật</a>
        </div>
        <div className="font-mono text-[10px] text-[#c4c9ac]/50">
          © 2024 KINETIC NOIR. HIỆU SUẤT ĐỈNH CAO.
        </div>
      </footer>
    </div>
  );
}

export default ResetPasswordPage;
