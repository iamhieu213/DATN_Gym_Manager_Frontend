import { useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import heroImage from '../../../assets/kinetic-hero.png';

type OtpMode = 'register' | 'forgot-password';

type OtpVerificationFormProps = {
  mode: OtpMode;
  endpoint: string;
  tokenStorageKey?: string;
  onVerified?: () => void;
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
  tokenStorageKey,
  onVerified,
  onBack,
}: OtpVerificationFormProps) {
  const config = modeConfig[mode];
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);

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

    const token = tokenStorageKey ? sessionStorage.getItem(tokenStorageKey) : null;

    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: code,
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Xác thực OTP thất bại.');
      }

      if (tokenStorageKey) {
        sessionStorage.removeItem(tokenStorageKey);
      }

      onVerified?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay fixed inset-0 z-100 min-h-screen overflow-y-auto bg-[#131313] text-[#e5e2e1]">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          className="h-full w-full scale-110 object-cover brightness-[0.2] blur-sm"
          src={heroImage}
          alt="Nền phòng gym hiệu suất cao"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-[#131313]/90 to-[#131313]" />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-12 md:px-16">
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-black tracking-tight text-[#abd600]">
            KINETIC NOIR
          </h1>
        </div>

        <section className="otp-panel flex w-full max-w-120 flex-col items-center rounded-4xl border border-white/10 bg-white/3 p-8 backdrop-blur-2xl md:p-12">
          <div className="mb-8 rounded-full border border-[#abd600]/20 bg-[#abd600]/10 p-4">
            <span className="text-4xl text-[#abd600]">🔐</span>
          </div>

          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
              {config.title}
            </h2>
            <p className="mx-auto max-w-[320px] text-[#c4c9ac]">
              {config.description}
            </p>
          </div>

          <form className="w-full space-y-10" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2 md:gap-3">
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
                  className="aspect-square w-full border-0 border-b-2 border-white/10 bg-white/5 text-center text-2xl font-bold text-[#abd600] outline-none transition-all focus:scale-105 focus:border-[#abd600] focus:bg-[#abd600]/5 md:h-16 md:w-14"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#c3f400] py-5 text-xl font-black uppercase tracking-widest text-black shadow-[0_10px_40px_-10px_rgba(171,214,0,0.5)] transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Đang xác thực...' : config.submitText}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              type="button"
              className="font-mono text-sm uppercase text-[#abd600] transition-all hover:brightness-125"
            >
              {config.resendText} <span className="text-[10px] opacity-60">(0:59)</span>
            </button>

            <button
              type="button"
              onClick={onBack}
              className="font-mono text-sm uppercase text-[#c4c9ac] underline decoration-white/20 underline-offset-4 transition-all hover:text-white"
            >
              {config.backText}
            </button>
          </div>
        </section>

        <div className="mt-12 flex items-center gap-6 opacity-30">
          <div className="h-px w-12 bg-white" />
          <span className="font-mono text-sm uppercase tracking-[0.4em] text-white">
            {config.protocol}
          </span>
          <div className="h-px w-12 bg-white" />
        </div>
      </main>
    </div>
  );
}

export default OtpVerificationForm;
