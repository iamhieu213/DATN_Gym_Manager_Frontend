import { UserCheck } from 'lucide-react';
import './PtSessionCard.css';

interface PtSessionCardProps {
  ptSession?: any;
}

export default function PtSessionCard({ ptSession }: PtSessionCardProps) {
  if (!ptSession) {
    return (
      <div className="pt-card">
        <div className="widget-header">
          <div>
            <p className="widget-tagline">Huấn luyện viên cá nhân</p>
            <div className="pt-coach-info">
              <h3 className="coach-name" style={{ marginLeft: 0, opacity: 0.6 }}>Chưa đăng ký HLV</h3>
            </div>
          </div>
          <UserCheck className="widget-icon-lime" style={{ opacity: 0.5 }} size={32} />
        </div>
        <div className="pt-sessions-details">
          <div className="session-box">
            <span className="session-label">Buổi tập còn lại:</span>
            <span className="session-count">0/0</span>
          </div>
          <p className="pt-card-time">Đăng ký dịch vụ PT để được thiết lập lịch tập cá nhân.</p>
        </div>
      </div>
    );
  }

  const coach = ptSession.coach;
  const coachName = coach?.user?.name || 'Huấn luyện viên';
  const coachAvatar = coach?.user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100';
  const totalSessions = ptSession.totalSessions || 0;
  const sessionsTrained = ptSession.sessionsTrained || 0;
  const sessionsLeftCount = totalSessions - sessionsTrained;
  const sessionsLeft = `${sessionsLeftCount}/${totalSessions}`;

  // Định dạng ngày hết hạn hợp đồng PT
  const expiryDate = ptSession.endDate ? new Date(ptSession.endDate).toLocaleDateString('vi-VN') : 'Không xác định';

  return (
    <div className="pt-card">
      <div className="widget-header">
        <div>
          <p className="widget-tagline">Huấn luyện viên cá nhân</p>
          <div className="pt-coach-info">
            <img src={coachAvatar} alt={coachName} className="coach-avatar" />
            <h3 className="coach-name">{coachName}</h3>
          </div>
        </div>
        <UserCheck className="widget-icon-lime" size={32} />
      </div>
      <div className="pt-sessions-details">
        <div className="session-box">
          <span className="session-label">Buổi tập còn lại:</span>
          <span className="session-count">{sessionsLeft}</span>
        </div>
        <p className="pt-card-time">Hạn hợp đồng PT: {expiryDate}</p>
      </div>
    </div>
  );
}

