import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { KeyRound, ShieldAlert, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { changePassword } from '../../features/auth/services/authApi';
import './ChangePasswordPage.css';

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
    <div className="change-password-wrapper">
      <div className="password-form-card">
        {/* Title / Heading */}
        <div className="form-heading-section">
          <div className="icon-lock-wrapper">
            <KeyRound size={32} className="text-[#caf300]" />
          </div>
          <h2 className="password-card-title">Đổi mật khẩu</h2>
          <p className="password-card-desc">
            Cập nhật thông tin truy cập để đảm bảo an toàn cho tài khoản Elite của bạn.
          </p>
        </div>

        {/* Security Tip */}
        <div className="security-tip-box">
          <ShieldAlert size={24} className="text-[#caf300] shrink-0" />
          <div className="tip-content">
            <h4 className="tip-title">Mẹo bảo mật</h4>
            <p className="tip-text">
              Sử dụng ít nhất 8 ký tự bao gồm chữ cái, chữ số và ký tự đặc biệt để tăng cường bảo mật cho hệ thống quản lý KINÉTIC.
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="password-input-form" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="form-field-group">
            <label className="field-label">Mật khẩu cũ</label>
            <div className="password-input-relative">
              <input
                className="field-input-box"
                type={showOld ? 'text' : 'password'}
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowOld(!showOld)}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-field-group">
            <label className="field-label">Mật khẩu mới</label>
            <div className="password-input-relative">
              <input
                className="field-input-box"
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowNew(!showNew)}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="form-field-group">
            <label className="field-label">Xác nhận mật khẩu mới</label>
            <div className="password-input-relative">
              <input
                className="field-input-box"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Hiện/Ẩn mật khẩu"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="password-actions-wrapper">
            <button
              className="btn-update-password"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              {!loading && <ArrowRight size={16} />}
            </button>
            <button
              className="btn-cancel-password"
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
