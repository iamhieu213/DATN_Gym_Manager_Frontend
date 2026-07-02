import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import Swal from 'sweetalert2';
import { Camera, Edit3, User, Activity, MapPin } from 'lucide-react';
import { getMyProfile } from '../../features/auth/services/authApi';
import {
  updateMyProfile,
  updateMyAvatar,
  getBodyMetricsHistory,
  createBodyMetric,
  getActiveMembership
} from '../../features/user/services/userApi';
import './UserProfilePage.css';

interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | '';
  citizenId: string;
  address: string;
  emergencyContact: string;
  avatarUrl: string | null;
  branchName?: string;
  status?: string;
}

interface ActiveMembership {
  membershipId: number;
  planId: number;
  planName: string;
  startDate: string;
  endDate: string;
  status?: string;
}

export default function UserProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    email: '',
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    citizenId: '',
    address: '',
    emergencyContact: '',
    avatarUrl: null,
    branchName: '',
    status: ''
  });

  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Active Membership State
  const [membership, setMembership] = useState<ActiveMembership | null>(null);

  // Health Metrics State
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [healthNotes, setHealthNotes] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  // Initial loaded values tracker to determine hasChanges()
  const [initialHeight, setInitialHeight] = useState<string>('');
  const [initialWeight, setInitialWeight] = useState<string>('');
  const [initialHealthNotes, setInitialHealthNotes] = useState<string>('');
  const [initialGoal, setInitialGoal] = useState<string>('');
  const [initialProgress, setInitialProgress] = useState<number>(0);

  // Track field focus for visual scaling effects
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fetchProfileAndData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Profile
      const profileRes = await getMyProfile();
      if (profileRes.success && profileRes.data) {
        const u = profileRes.data;
        const formattedProfile: UserProfile = {
          id: u.id,
          email: u.email || '',
          name: u.name || '',
          phone: u.phone || '',
          dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '',
          gender: u.gender || '',
          citizenId: u.citizenId || '',
          address: u.address || '',
          emergencyContact: u.emergencyContact || '',
          avatarUrl: u.avatarUrl,
          branchName: u.branch?.name || '',
          status: u.status || ''
        };
        setProfile(formattedProfile);
        setFormData(formattedProfile);
        setAvatarPreview(u.avatarUrl);
      }

      // 2. Fetch Membership
      try {
        const membershipRes = await getActiveMembership();
        if (membershipRes.success && membershipRes.data) {
          setMembership(membershipRes.data);
        }
      } catch (err) {
        console.warn('Không lấy được gói tập hoạt động:', err);
      }

      // 3. Fetch Health Metrics History
      try {
        const metricsRes = await getBodyMetricsHistory();
        console.log('Debug - metricsRes:', metricsRes);
        if (metricsRes.success && Array.isArray(metricsRes.data) && metricsRes.data.length > 0) {
          const latestMetric = metricsRes.data[0];
          const hStr = latestMetric.height_cm ? String(latestMetric.height_cm) : '';
          const wStr = latestMetric.weight_kg ? String(latestMetric.weight_kg) : '';
          const noteStr = latestMetric.note || '';

          setHeight(hStr);
          setWeight(wStr);
          setHealthNotes(noteStr);

          setInitialHeight(hStr);
          setInitialWeight(wStr);
          setInitialHealthNotes(noteStr);
        }
      } catch (err) {
        console.warn('Không lấy được lịch sử chỉ số sức khỏe:', err);
      }

      // 4. Fetch goal/progress from localStorage if exists
      const savedGoal = localStorage.getItem('user_fitness_goal') || '';
      setGoal(savedGoal);
      setInitialGoal(savedGoal);
      const savedProgress = localStorage.getItem('user_fitness_progress') || '0';
      setProgress(Number(savedProgress));
      setInitialProgress(Number(savedProgress));

    } catch (err: any) {
      console.error('Lỗi khi tải thông tin hồ sơ:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tải dữ liệu',
        text: err.response?.data?.message || 'Không thể tải thông tin hồ sơ cá nhân.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      Swal.fire({
        title: 'Đang tải ảnh lên...',
        text: 'Vui lòng chờ trong giây lát.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const res = await updateMyAvatar(file);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công',
          text: 'Ảnh đại diện của bạn đã được thay đổi.',
          timer: 1500,
          showConfirmButton: false
        });
        // Fetch profile again to update avatar in context/layouts
        fetchProfileAndData();
      }
    } catch (err: any) {
      console.error('Lỗi tải ảnh lên:', err);
      setAvatarPreview(profile.avatarUrl); // Revert preview on failure
      Swal.fire({
        icon: 'error',
        title: 'Tải ảnh thất bại',
        text: err.response?.data?.message || 'Không thể tải ảnh đại diện lên hệ thống.'
      });
    }
  };

  const hasChanges = () => {
    const profileChanged = (
      formData.name !== profile.name ||
      formData.phone !== profile.phone ||
      formData.dateOfBirth !== profile.dateOfBirth ||
      formData.gender !== profile.gender ||
      formData.citizenId !== profile.citizenId ||
      formData.address !== profile.address ||
      formData.emergencyContact !== profile.emergencyContact
    );
    const healthChanged = (
      height !== initialHeight ||
      weight !== initialWeight ||
      healthNotes !== initialHealthNotes ||
      goal !== initialGoal ||
      progress !== initialProgress
    );
    return profileChanged || healthChanged;
  };

  const handleCancelChanges = () => {
    setFormData({ ...profile });
    setAvatarPreview(profile.avatarUrl);
    setHeight(initialHeight);
    setWeight(initialWeight);
    setHealthNotes(initialHealthNotes);
    setGoal(initialGoal);
    setProgress(initialProgress);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges()) return;

    try {
      setSaving(true);

      // 1. Save Profile if changed
      const profileChanged = (
        formData.name !== profile.name ||
        formData.phone !== profile.phone ||
        formData.dateOfBirth !== profile.dateOfBirth ||
        formData.gender !== profile.gender ||
        formData.citizenId !== profile.citizenId ||
        formData.address !== profile.address ||
        formData.emergencyContact !== profile.emergencyContact
      );

      if (profileChanged) {
        const payload: any = {
          name: formData.name,
          phone: formData.phone || null,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
          gender: formData.gender || null,
          citizenId: formData.citizenId || null,
          address: formData.address || null,
          emergencyContact: formData.emergencyContact || null
        };
        await updateMyProfile(payload);
      }

      // 2. Save Health Metrics if changed
      const healthChanged = (
        height !== initialHeight ||
        weight !== initialWeight ||
        healthNotes !== initialHealthNotes
      );

      if (healthChanged) {
        const w = parseFloat(weight);
        const h = parseFloat(height);
        if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
          await createBodyMetric({
            weight_kg: w,
            height_cm: h,
            note: healthNotes
          });
        }
      }

      // 3. Save goal/progress if changed
      if (goal !== initialGoal) {
        localStorage.setItem('user_fitness_goal', goal);
      }
      if (progress !== initialProgress) {
        localStorage.setItem('user_fitness_progress', progress.toString());
      }

      Swal.fire({
        icon: 'success',
        title: 'Đã lưu thay đổi',
        text: 'Toàn bộ thông tin cá nhân và sức khỏe đã được cập nhật.',
        timer: 1500,
        showConfirmButton: false
      });

      fetchProfileAndData(); // Reload latest
    } catch (err: any) {
      console.error('Lỗi lưu thông tin:', err);
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại',
        text: err.response?.data?.message || 'Đã có lỗi xảy ra khi lưu thông tin.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateHealthMetrics = async () => {
    await handleSaveChanges();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#caf300] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400 font-medium tracking-wider">ĐANG TẢI HỒ SƠ CỦA BẠN...</p>
        </div>
      </div>
    );
  }

  // Generating a dynamic ID display based on database ID (e.g. KNT-00123)
  const formattedUserId = `KNT-${String(profile.id).padStart(5, '0')}`;

  return (
    <div className="profile-page-wrapper">
      {/* File Upload Input (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Profile Header */}
      <section className="profile-header-section">
        <div className="profile-avatar-container" onClick={handleAvatarClick} title="Nhấn để đổi ảnh đại diện">
          <div className="profile-avatar-box">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt={formData.name || 'Hội viên'} 
              />
            ) : (
              <div className="avatar-placeholder">
                <span>{formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}</span>
              </div>
            )}
            <div className="avatar-upload-overlay">
              <Camera size={32} className="text-[#caf300]" />
            </div>
          </div>
          <button className="avatar-edit-btn" aria-label="Đổi ảnh đại diện">
            <Edit3 size={14} />
          </button>
        </div>

        <div className="profile-meta-info">
          <h2 className="profile-meta-name">{formData.name || 'HỘI VIÊN KINETIC'}</h2>
          <div className="profile-meta-tags">
            {membership && (
              <span className="profile-badge-pro">
                {membership.planName.replace('KINETIC ', '')}
              </span>
            )}
            <span className="profile-meta-id">ID: {formattedUserId}</span>
          </div>
        </div>

      </section>

      {/* Bento Grid */}
      <div className="profile-bento-grid">
        {/* Section 1: Thông tin cá nhân */}
        <div className="bento-card bento-col-personal">
          <div className="card-title-row">
            <User size={24} />
            <h3 className="card-title-text">Thông tin cá nhân</h3>
          </div>
          <div className="form-layout-grid">
            <div className={`form-field-group ${focusedField === 'name' ? 'focus-effect' : ''}`}>
              <label className="field-label">Họ và tên</label>
              <input
                className="field-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
            <div className={`form-field-group ${focusedField === 'phone' ? 'focus-effect' : ''}`}>
              <label className="field-label">Số điện thoại</label>
              <input
                className="field-input"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className={`form-field-group ${focusedField === 'email' ? 'focus-effect' : ''}`}>
              <label className="field-label">Email (Không thể thay đổi)</label>
              <input
                className="field-input"
                type="email"
                value={formData.email}
                disabled
              />
            </div>
            <div className={`form-field-group ${focusedField === 'dateOfBirth' ? 'focus-effect' : ''}`}>
              <label className="field-label">Ngày sinh</label>
              <input
                className="field-input"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('dateOfBirth')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className={`form-field-group ${focusedField === 'gender' ? 'focus-effect' : ''}`}>
              <label className="field-label">Giới tính</label>
              <select
                className="field-input"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('gender')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <div className={`form-field-group ${focusedField === 'address' ? 'focus-effect' : ''}`}>
              <label className="field-label">Địa chỉ</label>
              <input
                className="field-input"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className={`form-field-group ${focusedField === 'citizenId' ? 'focus-effect' : ''}`}>
              <label className="field-label">Số CCCD / CMND</label>
              <input
                className="field-input"
                type="text"
                name="citizenId"
                value={formData.citizenId}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('citizenId')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className={`form-field-group ${focusedField === 'emergencyContact' ? 'focus-effect' : ''}`}>
              <label className="field-label">Liên hệ khẩn cấp (SĐT người thân)</label>
              <input
                className="field-input"
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('emergencyContact')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
          <div className="profile-actions-wrapper">
            <button
              className="btn-cancel"
              onClick={handleCancelChanges}
              disabled={!hasChanges() || saving}
            >
              Hủy
            </button>
            <button
              className="btn-save"
              onClick={handleSaveChanges}
              disabled={!hasChanges() || saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {/* Section 2: Sức khỏe & Mục tiêu */}
        <div className="bento-card bento-col-health">
          <div className="health-card-header">
            <div className="card-title-row" style={{ marginBottom: 0 }}>
              <Activity size={24} />
              <h3 className="card-title-text">Sức khỏe &amp; Mục tiêu</h3>
            </div>
            <button 
              className="btn-update-health"
              onClick={handleUpdateHealthMetrics}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Cập nhật thông tin'}
            </button>
          </div>

          <div className="health-metrics-container">
            <div className="health-metric-box">
              <label className="health-metric-label">Chiều cao (CM)</label>
              <input
                className="field-input health-metric-number"
                style={{ backgroundColor: 'transparent', width: '120px' }}
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <span className="health-metric-unit">CM</span>
            </div>

            <div className="health-metric-box">
              <label className="health-metric-label">Cân nặng (KG)</label>
              <input
                className="field-input health-metric-number"
                style={{ backgroundColor: 'transparent', width: '120px' }}
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="health-metric-unit">KG</span>
            </div>

            <div className="health-metric-box">
              <label className="health-metric-label">Mục tiêu luyện tập</label>
              <input
                className="field-input health-metric-text"
                style={{ backgroundColor: 'transparent', marginTop: '8px' }}
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div className="health-metric-box error-border">
              <label className="health-metric-label">Ghi chú sức khỏe</label>
              <input
                className="field-input health-metric-desc"
                style={{ backgroundColor: 'transparent', marginTop: '8px' }}
                type="text"
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="progress-bar-section">
            <label className="field-label">Tiến độ mục tiêu: {progress}%</label>
            <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="progress-track-wrapper" style={{ flex: 1 }}>
                <div className="progress-fill-lime" style={{ width: `${progress}%` }}></div>
                <div className="progress-percentage-label">
                  <span>{progress}%</span>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={(e) => setProgress(Number(e.target.value))}
                style={{ accentColor: '#caf300', width: '120px' }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Thẻ hội viên & Checkin QR */}
        <div className="bento-col-qr">
          <div className="bento-card qr-checkin-card">
            <h3 className="qr-title">Mã Check-in của bạn</h3>
            <div className="qr-code-wrapper">
              <div className="qr-mock-canvas">
                <div className="qr-mock-grid">
                  <div className="qr-black-block col-span-2 row-span-2"></div>
                  <div className="qr-white-block"></div>
                  <div className="qr-black-block"></div>
                  <div className="qr-black-block col-span-2 row-span-2 absolute right-1 top-1 w-8 h-8"></div>
                  <div className="qr-black-block absolute bottom-1 left-1 w-8 h-8"></div>
                  <div className="qr-black-block absolute bottom-3 right-3 w-4 h-4"></div>
                  <div className="qr-black-block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"></div>
                </div>
              </div>
            </div>
            <p className="qr-code-id">{formattedUserId}</p>
            <p className="qr-code-desc">Đưa mã này cho quầy lễ tân</p>
          </div>

          <div className="bento-card">
            <div className="status-card-fields">
              <div className="status-info-row">
                <label className="status-label">Chi nhánh gốc</label>
                <div className="status-value-box">
                  <MapPin className="status-icon-lime" size={24} />
                  <span className="status-text-bold">
                    {profile.branchName || 'Không có'}
                  </span>
                </div>
              </div>
              <div className="status-info-row">
                <label className="status-label">Trạng thái thẻ</label>
                <div className="status-value-box">
                  <div className="status-pulse-dot"></div>
                  <span className="status-text-normal">
                    {profile.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm khóa'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
