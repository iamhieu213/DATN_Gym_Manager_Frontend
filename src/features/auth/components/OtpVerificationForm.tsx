import { useRef, useState, useEffect, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import heroImage from '../../../assets/kinetic-hero.png';
import apiClient from '../services/apiClient';
import { LockKeyhole } from 'lucide-react';
import { requestForgotPasswordOtp } from '../services/authApi';
import Swal from 'sweetalert2';
import './OtpVerificationForm.css';

type OtpMode = 'register' | 'forgot-password';

type OtpVerificationFormProps = {
  mode: OtpMode;
  endpoint: string;
  onVerified?: (data?: any) => void;
  onBack?: () => void;
};

const modeConfig = {
  register: {
    title: 'Xác thực tài khoản',
    description: 'Nhập mã OTP gồm 6 chữ số đã được gửi đến email của bạn.',
    submitText: 'Xác thực mã',
    resendText: 'Gửi lại mã',
    backText: 'Đổi email đăng ký',
    protocol: 'Bảo mật đăng ký 09',
  },
  'forgot-password': {
    title: 'Xác thực đặt lại mật khẩu',
    description: 'Nhập mã OTP gồm 6 chữ số để tiếp tục đặt lại mật khẩu.',
    submitText: 'Xác nhận OTP',
    resendText: 'Gửi lại mã',
    backText: 'Đổi email khôi phục',
    protocol: 'Bảo mật khôi phục 09',
  },
};

function OtpVerificationForm({
  mode,
  endpoint,
  onVerified,
  onBack,
}: OtpVerificationFormProps) {
  const config = modeConfig[mode];
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);

  // 1. Khai báo State đếm ngược 10 phút (600 giây)
  const [timeLeft, setTimeLeft] = useState(600);

  // 2. Chạy bộ đếm ngược
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 3. Helper format giây thành định dạng MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // 4. Hàm xử lý khi nhấn "Gửi lại mã"
  const handleResend = async () => {
    if (timeLeft > 0) return;
    const email = sessionStorage.getItem('auth_email') || '';

    try {
      if (mode === 'forgot-password') {
        await requestForgotPasswordOtp({ email });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Để nhận mã OTP đăng ký mới, vui lòng quay lại trang Đăng ký và gửi lại thông tin!",
        });
        return;
      }

      setTimeLeft(600); // Reset bộ đếm về 10 phút
      Swal.fire({
        title: "Mã OTP mới đã được gửi về gmail của bạn.",
        icon: "success",
        draggable: true
      });
    } catch (error) {
      Swal.fire({
        title: "Không thể gửi lại mã OTP. Vui lòng thử lại sau.",
        icon: "error",
        draggable: true
      });
    }
  };

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
      .split('');

    const nextOtp = Array(6).fill('');
    pasted.forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const code = otp.join('');

    if (code.length !== 6) {
      alert('Vui lòng nhập đủ 6 chữ số OTP.');
      return;
    }

    const email = sessionStorage.getItem('auth_email') || '';
    setLoading(true);

    try {
      let bodyData = {};

      if (mode === 'register') {
        const registerToken = sessionStorage.getItem('registerToken') || '';
        bodyData = {
          email,
          registerToken,
          otpCode: code,
        };
      } else {
        bodyData = {
          email,
          otpCode: code,
        };
      }

      // Gọi API qua Axios
      const res = await apiClient.post(endpoint, bodyData);

      // Nếu là Quên mật khẩu, lưu lại resetPasswordToken từ backend
      if (mode === 'forgot-password' && res.data.data?.resetPasswordToken) {
        sessionStorage.setItem('resetPasswordToken', res.data.data.resetPasswordToken);
      }

      // Xóa các session tạm khi đăng ký thành công
      if (mode === 'register') {
        sessionStorage.removeItem('registerToken');
        sessionStorage.removeItem('auth_email');
      }

      onVerified?.(res.data);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Xác thực OTP thất bại.';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-overlay">
      <div className="otp-bg-container">
        <img
          className="otp-bg-img"
          src={heroImage}
          alt="Nền phòng gym hiệu suất cao"
        />
        <div className="otp-bg-gradient" />
      </div>

      <main className="otp-main">
        <div className="otp-logo-container">
          <h1 className="otp-logo-text">
            KINETIC NOIR
          </h1>
        </div>

        <section className="otp-panel">
          <div className="otp-icon-wrapper">
            <LockKeyhole className="otp-icon" />
          </div>

          <div className="otp-header-text">
            <h2 className="otp-title">
              {config.title}
            </h2>
            <p className="otp-desc">
              {config.description}
            </p>
          </div>

          <form className="otp-form" onSubmit={handleSubmit}>
            <div className="otp-inputs-row">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  value={value}
                  onChange={(event) => updateOtp(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-input-field"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-otp-submit"
            >
              {loading ? 'Đang xác thực...' : config.submitText}
            </button>
          </form>

          <div className="otp-footer-actions">
            <button
              type="button"
              onClick={handleResend}
              disabled={timeLeft > 0}
              className={`btn-otp-resend ${timeLeft > 0 ? 'disabled' : 'active'}`}
            >
              {config.resendText} <span style={{ fontSize: '10px', opacity: 0.6 }}>({formatTime(timeLeft)})</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="btn-otp-back"
            >
              {config.backText}
            </button>
          </div>
        </section>

        <div className="otp-protocol">
          <div className="protocol-line" />
          <span className="protocol-text">
            {config.protocol}
          </span>
          <div className="protocol-line" />
        </div>
      </main>
    </div>
  );
}

export default OtpVerificationForm;
