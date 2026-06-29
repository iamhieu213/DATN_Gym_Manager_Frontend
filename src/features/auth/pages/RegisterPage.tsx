import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/kinetic-hero.png';
import { registerUser } from '../services/authApi';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import './RegisterPage.css';

type RegisterPageProps = {};

function RegisterPage({ }: RegisterPageProps) {
    const bgRef = useRef<HTMLImageElement | null>(null);
    const spotlightRef = useRef<HTMLDivElement | null>(null); // <-- Khai báo ref cho spotlight
    const navigate = useNavigate();

    //1.Dinh nghia cac state quan ly du lieu nhap vao form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    const switchToLogin = () => {
        navigate('/login');
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!name.trim() || !email.trim() || !phone.trim() || !dateOfBirth.trim() || !password.trim()) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);

        try {
            const res = await registerUser({ name, email, phone, dateOfBirth, password });

            sessionStorage.setItem('auth_email', res.data.email);
            sessionStorage.setItem('registerToken', res.data.registerToken);

            await Swal.fire({
                icon: 'success',
                title: 'Đăng ký thành công',
                text: res.message || 'Mã OTP đã được gửi đến email của bạn.',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/verify-register');

        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: errMsg,
                footer: "<a href=\"#\">Why do I have this issue?</a>"
            });
        } finally {
            setLoading(false);
        }
    }

    //4.Xu ly dang ky bang Google
    const handleGoogleRegister = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
    }

    return (
        <div className="register-overlay">
            <div className="register-bg-container">
                <img
                    ref={bgRef}
                    className="register-bg-img"
                    src={heroImage}
                    alt="Nền phòng gym cao cấp"
                />
                <div className="register-bg-gradient" />
                <div className="register-bg-radial" />
                <div ref={spotlightRef} className="mouse-spotlight" />
            </div>

            <nav className="register-nav">
                <div className="register-logo">
                    KINETIC NOIR
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn-close"
                    aria-label="Đóng đăng ký"
                >
                    X
                </button>
            </nav>

            <main className="register-main">
                <section className="register-panel">
                    <div className="register-panel-header">
                        <span className="register-tagline">
                            Nâng cấp hành trình tập luyện
                        </span>
                        <h1 className="register-title">
                            BẮT ĐẦU NGAY
                        </h1>
                        <p className="register-desc">
                            Tham gia cộng đồng KINETIC NOIR dành cho những người theo đuổi hiệu suất đỉnh cao.
                        </p>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div>
                            <label className="register-input-label" htmlFor="reg-name">
                                Họ và tên
                            </label>
                            <input
                                id="reg-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="register-input"
                            />
                        </div>
                        <div>
                            <label className="register-input-label" htmlFor="reg-email">
                                Email
                            </label>
                            <input
                                id="reg-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="register-input"
                            />
                        </div>

                        <div>
                            <label className="register-input-label" htmlFor="reg-phone">
                                Số điện thoại
                            </label>
                            <input
                                id="reg-phone"
                                type="text"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="09xxxxxxxx"
                                className="register-input"
                            />
                        </div>

                        <div>
                            <label className="register-input-label" htmlFor="reg-dob">
                                Ngày sinh
                            </label>
                            <input
                                id="reg-dob"
                                type="date"
                                required
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                placeholder="dd/mm/yyyy"
                                className="register-input"
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <label className="register-input-label" htmlFor="reg-password">
                                Mật khẩu
                            </label>
                            <input
                                id="reg-password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="register-input register-input-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn-toggle-password"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-register-submit"
                        >
                            {loading ? 'Đang gửi thông tin...' : 'Tạo tài khoản'}
                        </button>

                        <div className="divider-row">
                            <div className="divider-line" />
                            <span className="divider-text">
                                Hoặc đăng ký với
                            </span>
                            <div className="divider-line" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleRegister}
                            className="btn-google"
                        >
                            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
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

                    <p className="login-redirect">
                        Đã có tài khoản?
                        <button
                            type="button"
                            onClick={switchToLogin}
                            className="btn-login-link"
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
