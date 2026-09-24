import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { logoutUser } from '../services/authApi';

/**
 * Hook đăng xuất dùng chung cho mọi layout (Admin/Staff, Coach, User).
 * Hỏi xác nhận -> thu hồi refresh token ở server -> xoá token ở client -> về trang đăng nhập.
 */
export function useLogout() {
  const navigate = useNavigate();

  return () => {
    Swal.fire({
      title: 'Đăng xuất?',
      text: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      background: '#09090b',
      color: '#fafafa',
      confirmButtonColor: '#c3f400',
      cancelButtonColor: '#27272a',
      customClass: {
        confirmButton: 'text-black font-bold',
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await logoutUser(refreshToken);
        }
      } catch (err) {
        console.error('Lỗi khi gọi API logout:', err);
      } finally {
        // Xoá token ở client trong mọi trường hợp
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        Swal.fire({
          title: 'Đã đăng xuất!',
          text: 'Bạn đã đăng xuất khỏi hệ thống thành công.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#09090b',
          color: '#fafafa',
        }).then(() => {
          navigate('/login');
        });
      }
    });
  };
}
