import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/kinetic-hero.png';
import { loginUser } from '../services/authApi';
import Swal from 'sweetalert2';

type LoginPageProps = {};

function LoginPage({ }: LoginPageProps) {
  const navigate = useNavigate();
  const bgRef = useRef<HTMLImageElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null); // <-- Thêm ref cho spotlight

  // 1. Định nghĩa State lưu trữ thông tin đăng nhập
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Hiệu ứng di chuyển nền Parallax theo chuột
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const moveX = (event.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (event.clientY - window.innerHeight / 2) * 0.01;

      if (bgRef.current) {
        bgRef.current.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
      }

      // Cập nhật tọa độ thẳng vào inline style của spotlight để ghi đè CSS mặc định
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spotlight-x', `${event.clientX}px`);
        spotlightRef.current.style.setProperty('--spotlight-y', `${event.clientY}px`);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Hàm xử lý gửi yêu cầu đăng nhập lên backend
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Kiểm tra dữ liệu đầu vào cơ bản
    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: "Vui lòng điền đầy đủ email và mật khẩu.",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    setLoading(true);

    try {
      // Gọi API đăng nhập sử dụng Axios
      const res = await loginUser({ email, password });

      // Lưu trữ tokens vào localStorage để dùng cho các yêu cầu sau
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công",
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/dashboard');
    } catch (error: any) {
      // Lấy thông báo lỗi chi tiết từ backend (nếu có)
      const errMsg = error.response?.data?.message || 'Email hoặc mật khẩu không chính xác.';
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: errMsg,
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setLoading(false);
    }
  };

  // 4. Xử lý khi nhấn đăng nhập Google (mở link OAuth)
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="login-overlay fixed inset-0 isolate z-100 flex min-h-screen flex-col overflow-hidden bg-[#131313] text-[#e5e2e1]">
      {/* Background Section */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          ref={bgRef}
          className="h-full w-full object-cover opacity-55 grayscale brightness-75 blur-[1px]"
          src={heroImage}
          alt="Nền phòng gym cao cấp phong cách điện ảnh"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#131313]/90 via-[#131313]/35 to-[#131313]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(195,244,0,0.2),transparent_38%),radial-gradient(circle_at_100%_100%,rgba(195,244,0,0.14),transparent_42%)]" />
        <div ref={spotlightRef} className="mouse-spotlight" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-white/10 bg-[#131313]/10 px-5 py-4 backdrop-blur-xl md:px-16">
        <div className="text-xl font-black tracking-tight text-white md:text-2xl">
          KINETIC NOIR
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-[#c3f400] hover:text-[#c3f400]"
          aria-label="Đóng đăng nhập"
        >
          X
        </button>
      </nav>

      {/* Main Form container */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-12">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute -inset-12 overflow-hidden opacity-20 blur-3xl">
            <div className="h-full w-full animate-pulse rounded-full bg-[#c3f400] mix-blend-screen" />
          </div>

          <section className="login-panel relative z-10 rounded-4xl border border-white/10 bg-white/3 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl md:p-10">
            <div className="mb-10 text-center">
              <h1 className="mb-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                CHÀO MỪNG TRỞ LẠI
              </h1>
              <p className="font-mono text-sm uppercase tracking-widest text-[#c8c6c5]">
                Kích hoạt hiệu suất
              </p>
            </div>

            {/* Thẻ Form kết nối onSubmit */}
            <form className="space-y-8" onSubmit={handleSubmit}>

              {/* Input Email */}
              <div className="group relative">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={email} // <-- Gán state email
                  onChange={(event) => setEmail(event.target.value)} // <-- Cập nhật state
                  className="peer block w-full rounded-lg border-0 border-b border-white/20 bg-white/5 px-4 pb-2 pt-6 text-white outline-none transition-all duration-300 focus:border-[#c3f400] focus:ring-0"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-4 origin-left font-mono text-sm uppercase text-[#c8c6c5] transition-all duration-300 peer-focus:-translate-y-3 peer-focus:scale-85 peer-focus:text-[#c3f400] peer-not-placeholder-shown:-translate-y-3 peer-not-placeholder-shown:scale-85 peer-not-placeholder-shown:text-[#c3f400]"
                >
                  Địa chỉ email
                </label>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-[#c3f400] transition-all duration-500 group-focus-within:w-full" />
              </div>

              {/* Input Password */}
              <div className="group relative">
                <input
                  id="password"
                  type="password"
                  placeholder=" "
                  value={password} // <-- Gán state password
                  onChange={(event) => setPassword(event.target.value)} // <-- Cập nhật state
                  className="peer block w-full rounded-lg border-0 border-b border-white/20 bg-white/5 px-4 pb-2 pt-6 text-white outline-none transition-all duration-300 focus:border-[#c3f400] focus:ring-0"
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-4 origin-left font-mono text-sm uppercase text-[#c8c6c5] transition-all duration-300 peer-focus:-translate-y-3 peer-focus:scale-85 peer-focus:text-[#c3f400] peer-not-placeholder-shown:-translate-y-3 peer-not-placeholder-shown:scale-85 peer-not-placeholder-shown:text-[#c3f400]"
                >
                  Mật khẩu
                </label>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-[#c3f400] transition-all duration-500 group-focus-within:w-full" />
              </div>

              {/* Quên mật khẩu */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="font-mono text-sm text-[#c8c6c5] transition-colors hover:text-white"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Nút hành động */}
              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading} // <-- Disable khi đang gọi API
                  className="login-primary-button w-full rounded-full bg-[#c3f400] py-4 text-xl font-black uppercase tracking-tight text-[#556d00] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                <div className="relative flex items-center py-4">
                  <div className="grow border-t border-white/10" />
                  <span className="mx-4 shrink font-mono text-sm uppercase text-[#c8c6c5]">
                    Hoặc tiếp tục với
                  </span>
                  <div className="grow border-t border-white/10" />
                </div>

                {/* Đăng nhập bằng Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex w-full items-center justify-center rounded-full border border-white/10 bg-white/3 py-3 font-mono text-sm text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10 active:scale-95"
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Tiếp tục với Google
                </button>
              </div>
            </form>

            {/* Chuyển hướng sang trang đăng ký */}
            <p className="mt-10 text-center text-[#b7b5b4]">
              Chưa có tài khoản?
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="ml-1 font-bold text-[#c3f400] hover:underline"
              >
                Tham gia ngay
              </button>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
