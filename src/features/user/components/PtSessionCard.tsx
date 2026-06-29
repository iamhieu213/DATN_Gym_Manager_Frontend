import { UserCheck } from 'lucide-react';
import './PtSessionCard.css';

interface PtSessionCardProps {
  sessionsLeft?: string;
  nextSession?: string;
  coachName?: string;
  coachAvatar?: string;
}

export default function PtSessionCard({
  sessionsLeft = '08/12',
  nextSession = '17:30 Chiều nay',
  coachName = 'HLV Marcus V.',
  coachAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
}: PtSessionCardProps) {
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
        <p className="pt-card-time">Buổi tập tiếp theo: {nextSession}</p>
      </div>
    </div>
  );
}
