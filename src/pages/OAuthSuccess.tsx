import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function OAuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);

            Swal.fire({
                icon: 'success',
                title: 'Đăng nhập Google thành công',
                showConfirmButton: false,
                timer: 1500
            });

            navigate('/dashboard', { replace: true });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                text: 'Không nhận được token xác thực.',
            });
            navigate('/login', { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#131313', color: '#caf300' }}>
            Đang hoàn tất đăng nhập Google...
        </div>
    );
}