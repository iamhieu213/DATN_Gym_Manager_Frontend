import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestForgotPasswordOtp } from '../services/authApi';
import heroImage from '../../../assets/kinetic-hero.png';
import Swal from 'sweetalert2';
import './ForgotPasswordPage.css';

type ForgotPasswordPageProps = {};

function ForgotPasswordPage({ }: ForgotPasswordPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!email.trim()) {
      Swal.fire({
        title: 'Vui lòng nhập địa chỉ email.',
        icon: "error",
        draggable: false
      });
      return;
    }

    setLoading(true);

    try {
      const data = await requestForgotPasswordOtp({ email });

      // Save email for OTP page verification
      sessionStorage.setItem('auth_email', email);

      Swal.fire({
        title: data.message || 'Mã OTP đã được gửi về gmail của bạn.',
        icon: "success",
        draggable: true
      });
      navigate('/verify-forgot-password'); // Redirect to verification page
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Có lỗi xảy ra.';
      Swal.fire({
        title: errMsg || 'Có lỗi xảy ra.',
        icon: "error",
        draggable: false
      });
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-overlay">
      <div className="forgot-bg-container">
        <img
          className="forgot-bg-img"
          src={heroImage}
          alt="Nền phòng gym cao cấp"
        />
        <div className="forgot-bg-gradient" />
        <div className="forgot-bg-radial" />
        <div className="forgot-glow-top-left" />
        <div className="forgot-glow-bottom-right" />
      </div>

      <header className="forgot-header">
        <div className="forgot-header-logo">
          KINETIC NOIR
        </div>

        <button
          type="button"
          className="btn-help"
        >
          Trợ giúp
        </button>
      </header>

      <main className="forgot-main">
        <section className="forgot-card">
          <div className="forgot-card-header">
            <h1 className="forgot-card-title">
              Quên mật khẩu
            </h1>

            <p className="forgot-card-desc">
              Nhập email đã đăng ký để nhận mã OTP gồm 6 chữ số.
            </p>
          </div>

          <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="forgot-input-group">
              <label
                className="forgot-input-label"
                htmlFor="forgot-email"
              >
                Địa chỉ email
              </label>

              <div className="forgot-input-wrapper">
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@example.com"
                  className="forgot-input"
                />
              </div>
            </div>

            <div className="forgot-btn-wrapper">
              <button
                type="submit"
                disabled={loading}
                className="btn-forgot-submit"
              >
                <span>{loading ? 'Đang gửi...' : 'Gửi mã OTP'}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>

          <div className="forgot-back-wrapper">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-forgot-back"
            >
              <span aria-hidden="true">←</span>
              Quay lại đăng nhập
            </button>
          </div>
        </section>

        <div className="forgot-decoration">
          <div className="deco-line" />
          <div className="deco-dot" />
          <div className="deco-line" />
        </div>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;
