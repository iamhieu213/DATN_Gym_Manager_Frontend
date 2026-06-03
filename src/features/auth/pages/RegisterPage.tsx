import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/kinetic-hero.png';

type RegisterPageProps = {};

function RegisterPage({}: RegisterPageProps) {
    const bgRef = useRef<HTMLImageElement | null>(null);
    const navigate = useNavigate();

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

    const switchToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="login-overlay fixed inset-0 z-100 flex min-h-screen flex-col overflow-y-auto bg-[#131313] text-[#e5e2e1]">
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <img
                    ref={bgRef}
                    className="h-full w-full object-cover opacity-30 grayscale brightness-50 blur-[2px]"
                    src={heroImage}
                    alt="Nền phòng gym cao cấp"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-[#131313]/30 to-[#131313]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(195,244,0,0.16),transparent_38%),radial-gradient(circle_at_100%_100%,rgba(195,244,0,0.1),transparent_42%)]" />
            </div>

            <nav className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-white/10 bg-[#131313]/10 px-5 py-4 backdrop-blur-xl md:px-16">
                <div className="text-xl font-black tracking-tight text-white md:text-2xl">
                    KINETIC NOIR
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-[#c3f400] hover:text-[#c3f400]"
                    aria-label="Đóng đăng ký"
                >
                    X
                </button>
            </nav>

            <main className="flex flex-1 items-center justify-center px-5 py-12">
                <section className="login-panel w-full max-w-lg rounded-2xl border border-white/10 bg-white/3 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl md:p-10">
                    <div className="mb-10 text-center">
                        <span className="mb-2 block font-mono text-sm uppercase tracking-widest text-[#c3f400]">
                            Nâng cấp hành trình tập luyện
                        </span>
                        <h1 className="mb-4 text-3xl font-black tracking-tight text-white md:text-4xl">
                            BẮT ĐẦU NGAY
                        </h1>
                        <p className="text-[#c8c6c5]">
                            Tham gia cộng đồng KINETIC NOIR dành cho những người theo đuổi hiệu suất đỉnh cao.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
                        <div>
                            <label className="mb-2 block font-mono text-sm uppercase text-[#c8c6c5]">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                placeholder="Nguyễn Văn A"
                                className="w-full rounded-t-lg border-0 border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#c3f400]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-mono text-sm uppercase text-[#c8c6c5]">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full rounded-t-lg border-0 border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#c3f400]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-mono text-sm uppercase text-[#c8c6c5]">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                placeholder="+84 ..."
                                className="w-full rounded-t-lg border-0 border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#c3f400]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-mono text-sm uppercase text-[#c8c6c5]">
                                Ngày sinh
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-t-lg border-0 border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#c3f400]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block font-mono text-sm uppercase text-[#c8c6c5]">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-t-lg border-0 border-b border-white/20 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#c3f400]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-primary-button w-full rounded-lg bg-[#c3f400] py-5 text-xl font-black uppercase text-[#283500] transition-all active:scale-[0.98]"
                        >
                            Tạo tài khoản
                        </button>

                        <div className="relative flex items-center py-2">
                            <div className="grow border-t border-white/10" />
                            <span className="mx-4 shrink font-mono text-sm uppercase text-[#c8c6c5]">
                                Hoặc đăng ký với
                            </span>
                            <div className="grow border-t border-white/10" />
                        </div>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/3 py-4 font-mono text-sm text-white transition-all hover:bg-white/10 active:scale-[0.98]"
                        >
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Tiếp tục với Google
                        </button>
                    </form>

                    <p className="mt-8 text-center text-[#b7b5b4]">
                        Đã có tài khoản?
                        <button
                            type="button"
                            onClick={switchToLogin}
                            className="ml-1 font-bold text-[#c3f400] hover:underline"
                        >
                            Đăng nhập tại đây
                        </button>
                    </p>
                </section>
            </main>
        </div>
    );
}

export default RegisterPage;
