import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { KeyRound, ShieldAlert, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { changePassword } from '../../auth/services/authApi';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  // Form inputs state
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  // Password visibility state
  const [showOld, setShowOld] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng điền đầy đủ các trường mật khẩu.'
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu quá ngắn',
        text: 'Mật khẩu mới phải có độ dài ít nhất 8 ký tự.'
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Mật khẩu không khớp',
        text: 'Mật khẩu mới và mật khẩu xác nhận không giống nhau.'
      });
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword({
        oldPassword,
        newPassword,
        confirmNewPassword
      });

      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Đổi mật khẩu thành công',
          text: 'Mật khẩu của bạn đã được cập nhật thành công.',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Clear form
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        
        // Go back to profile or home
        navigate('/user');
      }
    } catch (err: any) {
      console.error('Lỗi đổi mật khẩu:', err);
      Swal.fire({
        icon: 'error',
        title: 'Đổi mật khẩu thất bại',
        text: err.response?.data?.message || 'Có lỗi xảy ra trong quá trình cập nhật mật khẩu.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[80vh] box-border px-6 pt-10 pb-20 bg-[radial-gradient(circle_at_10%_20%,rgba(202,243,0,0.02)_0%,transparent_50%),radial-gradient(circle_at_90%_80%,rgba(202,243,0,0.01)_0%,transparent_50%)]">
      <div className="w-full max-w-[580px] bg-[#201f1f] border border-[#333333] rounded-2xl p-10 box-border shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3),0_10px_10px_-5px_rgba(0,0,0,0.3)]">
        {/* Title / Heading */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-brand/5 border border-brand flex items-center justify-center mb-6 rounded-xl">
            <KeyRound size={32} className="text-brand" />
          </div>
          <h2 className="font-[Montserrat,_sans-serif] text-2xl font-extrabold text-brand uppercase m-0 mb-2 tracking-[-0.02em]">Đổi mật khẩu</h2>
          <p className="text-sm text-zinc-500 leading-normal m-0">
            Cập nhật thông tin truy cập để đảm bảo an toàn cho tài khoản Elite của bạn.
          </p>
        </div>

        {/* Security Tip */}
        <div className="bg-[#131313]/50 border-l-2 border-brand rounded-lg p-4 flex gap-4 items-start mb-8 box-border">
          <ShieldAlert size={24} className="text-brand shrink-0" />
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-bold text-white m-0">Mẹo bảo mật</h4>
            <p className="text-xs text-zinc-500 leading-[1.6] m-0">
              Sử dụng ít nhất 8 ký tự bao gồm chữ cái, chữ số và ký tự đặc biệt để tăng cường bảo mật cho hệ thống quản lý KINÉTIC.
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="flex flex-col gap-2 transition-transform duration-200">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Mật khẩu cũ</label>
            <div className="relative w-full">
              <input
                className="w-full bg-[#131313] border border-[#333333] text-[#e5e2e1] pr-12 pl-4 py-3.5 text-sm font-[Inter,_sans-serif] rounded-lg outline-none box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)]"
                type={showOld ? 'text' : 'password'}
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-zinc-500 cursor-pointer p-1.5 flex items-center justify-center transition-colors duration-200 hover:text-brand"
                onClick={() => setShowOld(!showOld)}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2 transition-transform duration-200">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Mật khẩu mới</label>
            <div className="relative w-full">
              <input
                className="w-full bg-[#131313] border border-[#333333] text-[#e5e2e1] pr-12 pl-4 py-3.5 text-sm font-[Inter,_sans-serif] rounded-lg outline-none box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)]"
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-zinc-500 cursor-pointer p-1.5 flex items-center justify-center transition-colors duration-200 hover:text-brand"
                onClick={() => setShowNew(!showNew)}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-2 transition-transform duration-200">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Xác nhận mật khẩu mới</label>
            <div className="relative w-full">
              <input
                className="w-full bg-[#131313] border border-[#333333] text-[#e5e2e1] pr-12 pl-4 py-3.5 text-sm font-[Inter,_sans-serif] rounded-lg outline-none box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)]"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-zinc-500 cursor-pointer p-1.5 flex items-center justify-center transition-colors duration-200 hover:text-brand"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-4">
            <button
              className="flex-1 py-4 px-6 bg-brand text-[#171e00] border-none text-sm font-bold uppercase tracking-wider cursor-pointer rounded-lg flex items-center justify-center gap-2 [transition:filter_0.2s,transform_0.1s] hover:brightness-110 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:scale-100"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              {!loading && <ArrowRight size={16} />}
            </button>
            <button
              className="flex-1 py-4 px-6 border border-[#333333] bg-transparent text-[#e5e2e1] text-sm font-bold uppercase tracking-wider cursor-pointer rounded-lg [transition:background-color_0.2s,color_0.2s,transform_0.1s] hover:bg-[#131313] hover:text-white active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              type="button"
              onClick={() => navigate('/user')}
              disabled={loading}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
