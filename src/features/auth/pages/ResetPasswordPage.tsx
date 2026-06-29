import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/kinetic-hero.png';
import { resetPassword } from '../services/authApi';
import { KeyRound, ShieldCheck, RefreshCw, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import './ResetPasswordPage.css';

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
    if (!pass) return { label: 'Chưa nhập', className: 'strength-none', width: '0%' };
    if (pass.length < 6) return { label: 'Yếu', className: 'strength-weak', width: '33.3%' };

    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);

    if (hasLetters && hasNumbers && hasSpecial && pass.length >= 8) {
      return { label: 'Mạnh', className: 'strength-strong', width: '100%' };
    }
    return { label: 'Trung bình', className: 'strength-medium', width: '66.6%' };
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
    <div className="reset-overlay">
      {/* Mesh background tĩnh */}
      <div className="reset-bg-container">
        <img
          ref={bgRef}
          className="reset-bg-img"
          src={heroImage}
          alt="Hình nền phòng Gym Cinematic"
        />
      </div>

      {/* Navigation Bar */}
      <nav className="reset-nav">
        <div className="reset-logo">
          KINETIC NOIR
        </div>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-close"
          aria-label="Quay lại"
        >
          X
        </button>
      </nav>

      {/* Main Content Container */}
      <main className="reset-main">
        <div
          ref={panelRef}
          className="reset-panel"
        >
          {/* Header */}
          <div className="reset-panel-header">
            <div className="reset-icon-wrapper">
              <RefreshCw className="reset-icon" />
            </div>
            <h1 className="reset-title">
              Đặt lại mật khẩu
            </h1>
            <p className="reset-desc">
              Tạo mật khẩu mới an toàn cho tài khoản Elite của bạn.
            </p>
          </div>

          {/* Form */}
          <form className="reset-form" onSubmit={handleSubmit}>
            {/* Mật khẩu mới */}
            <div className="reset-input-group">
              <label
                className="reset-input-label"
                htmlFor="new_password"
              >
                Mật khẩu mới
              </label>
              <div className="reset-input-wrapper">
                <KeyRound className="reset-input-icon" />
                <input
                  className="reset-input-field reset-input-field-password"
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
                  className="btn-toggle-password"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="reset-input-group">
              <label
                className="reset-input-label"
                htmlFor="confirm_password"
              >
                Xác nhận mật khẩu mới
              </label>
              <div className="reset-input-wrapper">
                <ShieldCheck className="reset-input-icon" />
                <input
                  className="reset-input-field reset-input-field-password"
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
                  className="btn-toggle-password"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Thanh hiển thị độ mạnh mật khẩu */}
            <div className="strength-container">
              <div className="strength-bar-outer">
                <div className={`strength-bar-inner ${strength.className}`} style={{ width: strength.width }} />
              </div>
              <span className="strength-text">
                Độ mạnh: {strength.label}
              </span>
            </div>

            {/* Nút gửi */}
            <button
              className="btn-reset-submit"
              type="submit"
              disabled={loading}
            >
              <span className="btn-reset-submit-bg" />
              <span className="btn-reset-submit-content">{loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
            </button>
          </form>

          {/* Back to Login */}
          <div className="reset-back-wrapper">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-reset-back"
            >
              <ArrowLeft className="reset-back-icon" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="reset-footer">
        <div className="footer-logo">KINETIC NOIR</div>
        <div className="footer-links">
          <a className="footer-link" href="#">Chính sách bảo mật</a>
          <a className="footer-link" href="#">Điều khoản dịch vụ</a>
          <a className="footer-link" href="#">Giao thức bảo mật</a>
        </div>
        <div className="footer-copy">
          © 2024 KINETIC NOIR. HIỆU SUẤT ĐỈNH CAO.
        </div>
      </footer>
    </div>
  );
}

export default ResetPasswordPage;
