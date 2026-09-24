import { AlertTriangle } from 'lucide-react';

interface PaymentAlertProps {
  payments?: any[];
}

export default function PaymentAlert({ payments = [] }: PaymentAlertProps) {
  // Tìm hóa đơn chưa thanh toán
  const pendingInvoice = payments.find((p) => p.status === 'PENDING');

  if (!pendingInvoice) return null;

  return (
    <div className="bg-[#93000a] text-[#ffdad6] p-4 rounded-xl flex flex-col items-center justify-between gap-4 border border-[#ffb4ab]/20 box-border sm:flex-row sm:text-left">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <AlertTriangle className="text-[30px]" size={24} />
        <div>
          <p className="font-bold text-sm m-0">Thông báo thanh toán</p>
          <p className="text-sm opacity-90 m-0 mt-0.5 leading-[1.4]">
            Bạn đang có 1 hóa đơn trị giá <strong>{Number(pendingInvoice.amount).toLocaleString('vi-VN')} đ</strong> chưa thanh toán. Vui lòng hoàn tất thanh toán để tránh gián đoạn dịch vụ.
          </p>
        </div>
      </div>
      <button className="whitespace-nowrap px-6 py-2 bg-[#ffdad6] text-[#93000a] font-bold rounded-lg border-none cursor-pointer transition-opacity hover:opacity-90">
        Thanh toán ngay
      </button>
    </div>
  );
}

