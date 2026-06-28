import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/kinetic-hero.png';
import { loginUser } from '../services/authApi';
import Swal from 'sweetalert2';
import './LoginPage.css';

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
    <div className="login-overlay">
      {/* Background Section */}
      <div className="login-bg-container">
        <img
          ref={bgRef}
          className="login-bg-img"
          src={heroImage}
          alt="Nền phòng gym cao cấp phong cách điện ảnh"
        />
        <div className="login-bg-gradient" />
        <div className="login-bg-radial" />
        <div ref={spotlightRef} className="mouse-spotlight" />
      </div>

      {/* Navigation */}
      <nav className="login-nav">
        <div className="login-logo">
          KINETIC NOIR
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-close"
          aria-label="Đóng đăng nhập"
        >
          X
        </button>
      </nav>

      {/* Main Form container */}
      <main className="login-main">
        <div className="login-form-wrapper">
          <div className="form-glow-container">
            <div className="form-glow-pulse" />
          </div>

          <section className="login-panel">
            <div className="login-panel-header">
              <h1 className="login-title">
                CHÀO MỪNG TRỞ LẠI
              </h1>
              <p className="login-subtitle">
                Kích hoạt hiệu suất
              </p>
            </div>

            {/* Thẻ Form kết nối onSubmit */}
            <form className="login-form" onSubmit={handleSubmit}>

              {/* Input Email */}
              <div className="login-input-group">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={email} // <-- Gán state email
                  onChange={(event) => setEmail(event.target.value)} // <-- Cập nhật state
                  className="login-input"
                  required
                />
                <label
                  htmlFor="email"
                  className="login-input-label"
                >
                  Địa chỉ email
                </label>
                <div className="login-input-line" />
              </div>

              {/* Input Password */}
              <div className="login-input-group">
                <input
                  id="password"
                  type="password"
                  placeholder=" "
                  value={password} // <-- Gán state password
                  onChange={(event) => setPassword(event.target.value)} // <-- Cập nhật state
                  className="login-input"
                  required
                />
                <label
                  htmlFor="password"
                  className="login-input-label"
                >
                  Mật khẩu
                </label>
                <div className="login-input-line" />
              </div>

              {/* Quên mật khẩu */}
              <div className="forgot-row">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="btn-forgot"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Nút hành động */}
              <div className="login-actions-wrapper">
                <button
                  type="submit"
                  disabled={loading} // <-- Disable khi đang gọi API
                  className="btn-login-submit"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                <div className="divider-row">
                  <div className="divider-line" />
                  <span className="divider-text">
                    Hoặc tiếp tục với
                  </span>
                  <div className="divider-line" />
                </div>

                {/* Đăng nhập bằng Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="btn-google"
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
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
            <p className="register-redirect">
              Chưa có tài khoản?
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="btn-register-link"
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
