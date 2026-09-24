import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import Swal from 'sweetalert2';
import { Camera, Edit3, User, Activity, MapPin } from 'lucide-react';
import { getMyProfile } from '../../auth/services/authApi';
import {
  updateMyProfile,
  updateMyAvatar,
  getBodyMetricsHistory,
  createBodyMetric
} from '../services/userApi';
import { getActiveMembership } from '../services/membershipApi';
import './UserProfilePage.animations.css';

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
  id: number;
  user_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  status: string;
  plan: {
    id: number;
    name: string;
    code: string;
  };
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
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400 font-medium tracking-wider">ĐANG TẢI HỒ SƠ CỦA BẠN...</p>
        </div>
      </div>
    );
  }

  // Generating a dynamic ID display based on database ID (e.g. KNT-00123)
  const formattedUserId = `KNT-${String(profile.id).padStart(5, '0')}`;

  return (
    <div className="w-full max-w-[1600px] mx-auto box-border pt-10 pb-20 px-6 lg:p-10">
      {/* File Upload Input (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Profile Header */}
      <section className="flex flex-col items-center gap-6 mb-10 w-full md:flex-row md:items-end">
        <div className="group relative cursor-pointer shrink-0" onClick={handleAvatarClick} title="Nhấn để đổi ảnh đại diện">
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-2 border-brand bg-[#201f1f] transition-colors duration-200 md:w-40 md:h-40">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={formData.name || 'Hội viên'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-brand font-[Montserrat,_sans-serif] text-5xl font-black">
                <span>{formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Camera size={32} className="text-brand" />
            </div>
          </div>
          <button className="absolute -bottom-2 -right-2 bg-brand text-[#171e00] border-none p-2 cursor-pointer flex items-center justify-center rounded-full shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105 active:scale-95" aria-label="Đổi ảnh đại diện">
            <Edit3 size={14} />
          </button>
        </div>

        <div className="text-center flex-1 md:text-left">
          <h2 className="font-[Montserrat,_sans-serif] text-[2rem] lg:text-5xl font-black text-white m-0 mb-2 tracking-[-0.02em] uppercase">{formData.name || 'HỘI VIÊN KINETIC'}</h2>
          <div className="flex items-center justify-center gap-3 md:justify-start">
            {membership && (
              <span className="bg-brand text-[#171e00] text-[10px] font-black tracking-widest px-3 py-1 uppercase rounded">
                {membership.plan.name.replace('KINETIC ', '')}
              </span>
            )}
            <span className="text-sm text-zinc-500 font-medium">ID: {formattedUserId}</span>
          </div>
        </div>

      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6 w-full">
        {/* Section 1: Thông tin cá nhân */}
        <div className="bg-[#201f1f] border border-[#333333] p-8 box-border rounded-2xl col-span-12 lg:col-span-6 xl:col-span-5">
          <div className="flex items-center gap-3 mb-8">
            <User size={24} />
            <h3 className="font-[Montserrat,_sans-serif] text-xl font-bold text-white uppercase m-0 tracking-[-0.02em]">Thông tin cá nhân</h3>
          </div>
          <div className="grid grid-cols-1 gap-y-8 gap-x-12 md:grid-cols-2">
            <div className={`flex flex-col gap-2 transition-transform duration-200 ${focusedField === 'name' ? 'scale-[1.01]' : ''}`}>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Họ và tên</label>
              <input
                className="bg-[#131313] border border-[#333333] text-[#e5e2e1] px-3.5 py-3 text-sm font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)] disabled:text-zinc-500 disabled:bg-[#131313]/40 disabled:border-[#222222] disabled:cursor-not-allowed"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
            <div className={`flex flex-col gap-2 transition-transform duration-200 ${focusedField === 'phone' ? 'scale-[1.01]' : ''}`}>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Số điện thoại</label>
              <input
                className="bg-[#131313] border border-[#333333] text-[#e5e2e1] px-3.5 py-3 text-sm font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)] disabled:text-zinc-500 disabled:bg-[#131313]/40 disabled:border-[#222222] disabled:cursor-not-allowed"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className={`flex flex-col gap-2 transition-transform duration-200 ${focusedField === 'email' ? 'scale-[1.01]' : ''}`}>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Email (Không thể thay đổi)</label>
              <input
                className="bg-[#131313] border border-[#333333] text-[#e5e2e1] px-3.5 py-3 text-sm font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)] disabled:text-zinc-500 disabled:bg-[#131313]/40 disabled:border-[#222222] disabled:cursor-not-allowed"
                type="email"
                value={formData.email}
                disabled
              />
            </div>
            <div className={`flex flex-col gap-2 transition-transform duration-200 ${focusedField === 'dateOfBirth' ? 'scale-[1.01]' : ''}`}>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Ngày sinh</label>
              <input
                className="bg-[#131313] border border-[#333333] text-[#e5e2e1] px-3.5 py-3 text-sm font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)] disabled:text-zinc-500 disabled:bg-[#131313]/40 disabled:border-[#222222] disabled:cursor-not-allowed"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('dateOfBirth')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className={`flex flex-col gap-2 transition-transform duration-200 ${focusedField === 'gender' ? 'scale-[1.01]' : ''}`}>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Giới tính</label>
              <select
                className="bg-[#131313] border border-[#333333] text-[#e5e2e1] pl-3.5 pr-6 py-3 text-sm font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)] appearance-none"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 4px center'
                }}
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
            <div className={`flex flex-col gap-2 transition-transform duration-200 ${focusedField === 'address' ? 'scale-[1.01]' : ''}`}>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Địa chỉ</label>
              <input
                className="bg-[#131313] border border-[#333333] text-[#e5e2e1] px-3.5 py-3 text-sm font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)] disabled:text-zinc-500 disabled:bg-[#131313]/40 disabled:border-[#222222] disabled:cursor-not-allowed"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className={`flex flex-col gap-2 transition-transform duration-200 ${focusedField === 'citizenId' ? 'scale-[1.01]' : ''}`}>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Số CCCD / CMND</label>
              <input
                className="bg-[#131313] border border-[#333333] text-[#e5e2e1] px-3.5 py-3 text-sm font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)] disabled:text-zinc-500 disabled:bg-[#131313]/40 disabled:border-[#222222] disabled:cursor-not-allowed"
                type="text"
                name="citizenId"
                value={formData.citizenId}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('citizenId')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div className={`flex flex-col gap-2 transition-transform duration-200 ${focusedField === 'emergencyContact' ? 'scale-[1.01]' : ''}`}>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Liên hệ khẩn cấp (SĐT người thân)</label>
              <input
                className="bg-[#131313] border border-[#333333] text-[#e5e2e1] px-3.5 py-3 text-sm font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)] disabled:text-zinc-500 disabled:bg-[#131313]/40 disabled:border-[#222222] disabled:cursor-not-allowed"
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('emergencyContact')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-8 w-full justify-end">
            <button
              className="px-6 py-3 border border-[#333333] bg-transparent text-[#e5e2e1] text-sm font-semibold cursor-pointer rounded-lg transition-colors duration-200 hover:bg-[#201f1f] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancelChanges}
              disabled={!hasChanges() || saving}
            >
              Hủy
            </button>
            <button
              className="px-6 py-3 bg-brand text-[#171e00] border-none text-sm font-bold cursor-pointer rounded-lg [transition:filter_0.2s,transform_0.1s] hover:brightness-110 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:scale-100"
              onClick={handleSaveChanges}
              disabled={!hasChanges() || saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {/* Section 2: Sức khỏe & Mục tiêu */}
        <div className="bg-[#201f1f] border border-[#333333] p-8 box-border rounded-2xl col-span-12 lg:col-span-6 xl:col-span-4">
          <div className="flex flex-col justify-between items-start gap-6 mb-8 md:flex-row md:items-center">
            <div className="flex items-center gap-3" style={{ marginBottom: 0 }}>
              <Activity size={24} />
              <h3 className="font-[Montserrat,_sans-serif] text-xl font-bold text-white uppercase m-0 tracking-[-0.02em]">Sức khỏe &amp; Mục tiêu</h3>
            </div>
            <button
              className="bg-brand text-[#171e00] border-none px-8 py-3 text-sm font-black uppercase tracking-[-0.02em] cursor-pointer rounded-lg [transition:filter_0.2s,transform_0.1s] hover:brightness-110 active:scale-[0.98]"
              onClick={handleUpdateHealthMetrics}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Cập nhật thông tin'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-[#131313]/50 border-l-2 border-brand p-6 box-border rounded-xl">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Chiều cao (CM)</label>
              <input
                className="border border-[#333333] text-white py-3 px-3.5 font-[Montserrat,_sans-serif] text-[2rem] font-black rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)]"
                style={{ backgroundColor: 'transparent', width: '120px' }}
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <span className="text-brand text-sm font-semibold ml-1">CM</span>
            </div>

            <div className="bg-[#131313]/50 border-l-2 border-brand p-6 box-border rounded-xl">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Cân nặng (KG)</label>
              <input
                className="border border-[#333333] text-white py-3 px-3.5 font-[Montserrat,_sans-serif] text-[2rem] font-black rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)]"
                style={{ backgroundColor: 'transparent', width: '120px' }}
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <span className="text-brand text-sm font-semibold ml-1">KG</span>
            </div>

            <div className="bg-[#131313]/50 border-l-2 border-brand p-6 box-border rounded-xl">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Mục tiêu luyện tập</label>
              <input
                className="border border-[#333333] text-white py-3 px-3.5 font-[Montserrat,_sans-serif] text-xl font-bold leading-[1.2] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)]"
                style={{ backgroundColor: 'transparent', marginTop: '8px' }}
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div className="bg-[#131313]/50 border-l-2 border-[#ffb4ab] p-6 box-border rounded-xl">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Ghi chú sức khỏe</label>
              <input
                className="border border-[#333333] text-[#e5e2e1] py-3 px-3.5 text-base font-[Inter,_sans-serif] rounded-lg outline-none w-full box-border transition-[border-color,box-shadow] duration-200 focus:border-brand focus:shadow-[0_0_0_2px_rgba(202,243,0,0.15)]"
                style={{ backgroundColor: 'transparent', marginTop: '8px' }}
                type="text"
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-12">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Tiến độ mục tiêu: {progress}%</label>
            <div style={{ marginTop: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="relative h-4 w-full bg-[#131313] overflow-hidden border border-[#333333] rounded-lg" style={{ flex: 1 }}>
                <div className="absolute top-0 left-0 h-full bg-brand rounded-lg [transition:width_0.5s_ease-out]" style={{ width: `${progress}%` }}></div>
                <div className="absolute top-0 right-0 h-full pr-2 flex items-center">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">{progress}%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="accent-brand"
                style={{ width: '120px' }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Thẻ hội viên & Checkin QR */}
        <div className="col-span-12 flex flex-col gap-6 lg:flex-row xl:col-span-3 xl:flex-col">
          <div className="bg-[#201f1f] border border-[#333333] p-8 box-border rounded-2xl flex flex-col items-center text-center lg:flex-1 xl:flex-none">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">Mã Check-in của bạn</h3>
            <div className="bg-white p-4 mb-6 inline-block">
              <div className="w-32 h-32 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-white grid grid-cols-8 grid-rows-8 gap-1 p-1">
                  <div className="bg-black col-span-2 row-span-2"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-black col-span-2 row-span-2 absolute right-1 top-1 w-8 h-8"></div>
                  <div className="bg-black absolute bottom-1 left-1 w-8 h-8"></div>
                  <div className="bg-black absolute bottom-3 right-3 w-4 h-4"></div>
                  <div className="bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"></div>
                </div>
              </div>
            </div>
            <p className="font-[Montserrat,_sans-serif] text-xl font-bold text-brand m-0 mb-1">{formattedUserId}</p>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest m-0">Đưa mã này cho quầy lễ tân</p>
          </div>

          <div className="bg-[#201f1f] border border-[#333333] p-8 box-border rounded-2xl lg:flex-1 xl:flex-none">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Chi nhánh gốc</label>
                <div className="flex items-center gap-3">
                  <MapPin className="text-brand" size={24} />
                  <span className="font-[Montserrat,_sans-serif] text-xl font-bold text-white">
                    {profile.branchName || 'Không có'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Trạng thái thẻ</label>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-brand shadow-[0_0_0_0_rgba(202,243,0,0.7)] animate-[pulseAnimation_2s_infinite]"></div>
                  <span className="text-base text-[#e5e2e1]">
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
