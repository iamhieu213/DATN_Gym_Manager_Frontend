import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công',
        text: 'Chào mừng bạn quay lại hệ thống!',
        showConfirmButton: false,
        timer: 1500,
        background: '#1c1c1c',
        color: '#fff',
      });

      // Chuyển hướng đến dispatcher để kiểm tra quyền và phân trang
      navigate('/dashboard', { replace: true });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: 'Không tìm thấy mã xác thực từ Google.',
        background: '#1c1c1c',
        color: '#fff',
      });
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#131313] font-mono text-brand">
      <div className="mb-5 h-[50px] w-[50px] animate-spin rounded-full border-4 border-brand border-t-transparent" />
      <span className="tracking-[2px] font-bold">ĐANG XỬ LÝ ĐĂNG NHẬP GOOGLE...</span>
    </div>
  );
}
