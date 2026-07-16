import { AlertTriangle } from 'lucide-react';
import './PaymentAlert.css';

interface PaymentAlertProps {
  payments?: any[];
}

export default function PaymentAlert({ payments = [] }: PaymentAlertProps) {
  // Tìm hóa đơn chưa thanh toán
  const pendingInvoice = payments.find((p) => p.status === 'PENDING');

  if (!pendingInvoice) return null;

  return (
    <div className="payment-alert">
      <div className="alert-message-box">
        <AlertTriangle className="alert-icon" size={24} />
        <div>
          <p className="alert-title">Thông báo thanh toán</p>
          <p className="alert-desc">
            Bạn đang có 1 hóa đơn trị giá <strong>{Number(pendingInvoice.amount).toLocaleString('vi-VN')} đ</strong> chưa thanh toán. Vui lòng hoàn tất thanh toán để tránh gián đoạn dịch vụ.
          </p>
        </div>
      </div>
      <button className="btn-alert-pay">
        Thanh toán ngay
      </button>
    </div>
  );
}

