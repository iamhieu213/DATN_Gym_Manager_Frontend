import { AlertTriangle } from 'lucide-react';
import './PaymentAlert.css';

interface PaymentAlertProps {
  hasPending?: boolean;
}

export default function PaymentAlert({ hasPending = true }: PaymentAlertProps) {
  if (!hasPending) return null;

  return (
    <div className="payment-alert">
      <div className="alert-message-box">
        <AlertTriangle className="alert-icon" size={24} />
        <div>
          <p className="alert-title">Thông báo thanh toán</p>
          <p className="alert-desc">Bạn có 1 hóa đơn chưa thanh toán cho tháng 10. Vui lòng hoàn tất để tránh gián đoạn.</p>
        </div>
      </div>
      <button className="btn-alert-pay">
        Thanh toán ngay
      </button>
    </div>
  );
}
