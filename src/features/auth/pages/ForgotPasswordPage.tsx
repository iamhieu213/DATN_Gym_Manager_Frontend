import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestForgotPasswordOtp } from '../services/authApi';
import heroImage from '../../../assets/kinetic-hero.png';
import Swal from 'sweetalert2';
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
    <div className="login-overlay fixed inset-0 isolate z-100 flex min-h-screen items-center justify-center overflow-y-auto bg-[#131313] p-5 text-[#e5e2e1] selection:bg-[#c3f400] selection:text-black md:p-16">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          className="h-full w-full object-cover opacity-55 grayscale brightness-75 blur-[1px]"
          src={heroImage}
          alt="Nền phòng gym cao cấp"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#131313]/90 via-[#131313]/35 to-[#131313]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(195,244,0,0.2),transparent_38%),radial-gradient(circle_at_100%_100%,rgba(195,244,0,0.14),transparent_42%)]" />
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-[#c3f400]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-[#c3f400]/5 blur-[120px] [animation-delay:2s]" />
      </div>

      <header className="fixed top-0 z-10 flex w-full items-center justify-between border-b border-white/10 px-5 py-4 backdrop-blur-xl md:px-16">
        <div className="text-2xl font-black uppercase tracking-tight text-[#c3f400]">
          KINETIC NOIR
        </div>

        <button
          type="button"
          className="text-sm font-mono uppercase text-[#c4c9ac] transition-colors hover:text-white"
        >
          Trợ giúp
        </button>
      </header>

      <main className="relative z-10 w-full max-w-120">
        <section className="rounded-4xl border border-white/10 bg-white/3 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-500 md:p-12">
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Quên mật khẩu
            </h1>

            <p className="mx-auto max-w-[320px] text-[#c4c9ac]">
              Nhập email đã đăng ký để nhận mã OTP gồm 6 chữ số.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="group flex flex-col gap-2">
              <label
                className="ml-1 font-mono text-sm uppercase tracking-widest text-[#c4c9ac]"
                htmlFor="forgot-email"
              >
                Địa chỉ email
              </label>

              <div className="relative rounded-t-lg border-b border-white/10 bg-white/5 transition-all duration-300 focus-within:border-[#c3f400] focus-within:shadow-[0_4px_20px_-10px_rgba(195,244,0,0.3)]">
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@example.com"
                  className="w-full border-none bg-transparent px-4 py-4 text-white outline-none placeholder:text-white/20 focus:ring-0"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#c3f400] py-5 text-xl font-black uppercase text-[#161e00] shadow-[0_10px_30px_-10px_rgba(195,244,0,0.4)] transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{loading ? 'Đang gửi...' : 'Gửi mã OTP'}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 font-mono text-sm uppercase text-[#c4c9ac] transition-colors hover:text-[#c3f400]"
            >
              <span aria-hidden="true">←</span>
              Quay lại đăng nhập
            </button>
          </div>
        </section>

        <div className="mt-8 flex justify-center gap-4 opacity-20 grayscale">
          <div className="h-px w-12 bg-white" />
          <div className="h-px w-2 bg-[#c3f400]" />
          <div className="h-px w-12 bg-white" />
        </div>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;
