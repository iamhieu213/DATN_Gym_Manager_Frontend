import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const openForgotPassword = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgotPassword(true);
  };


  const openLogin = () => {
    setShowForgotPassword(false);
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {

    setShowLogin(false);
    setShowRegister(true);
  };

  return (
    <>
      <LandingPage
        onOpenLogin={openLogin}
        onOpenRegister={openRegister}
      />

      {showLogin && (
        <LoginPage
          onClose={() => setShowLogin(false)}
          onOpenRegister={openRegister}
          onOpenForgotPassword={openForgotPassword}
        />
      )}

      {showRegister && (
        <RegisterPage
          onClose={() => setShowRegister(false)}
          onOpenLogin={openLogin}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordPage
          onBackToLogin={openLogin}
          onOtpSent={() => {
            // Tạm thời chưa xử lý phần OTP
          }}
        />
      )}
    </>
  );
}

export default App;
