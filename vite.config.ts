import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Dùng polling thay vì inotify để tránh lỗi ENOSPC khi hệ thống hết file watcher
      // (ví dụ khi extension C# Dev Kit của VSCode chiếm phần lớn watcher)
      usePolling: true,
      interval: 300,
    },
  },
})
