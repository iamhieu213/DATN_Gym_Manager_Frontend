import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Hàm khởi tạo kết nối Socket và đính kèm Token xác thực
export const connectSocket = (accessToken: string) => {
  if (socket) return socket; // Nếu đã kết nối rồi thì không tạo mới kết nối nữa

  socket = io('http://localhost:3000', {
    auth: {
      token: accessToken,
    },
  });

  socket.on('connect', () => {
    console.log('[Socket] Đã kết nối thành công tới Server!');
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Lỗi kết nối:', err.message);
  });

  return socket;
};

// Hàm lấy đối tượng socket đang chạy
export const getSocket = () => socket;

// Hàm ngắt kết nối (gọi khi người dùng đăng xuất)
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('[Socket] Đã ngắt kết nối chủ động.');
  }
};