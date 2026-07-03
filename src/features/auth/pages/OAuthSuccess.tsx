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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#131313',
      color: '#caf300',
      fontFamily: 'monospace'
    }}>
      <div style={{
        border: '4px solid #caf300',
        borderTop: '4px solid transparent',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }} />
      <span style={{ letterSpacing: '2px', fontWeight: 'bold' }}>ĐANG XỬ LÝ ĐĂNG NHẬP GOOGLE...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
