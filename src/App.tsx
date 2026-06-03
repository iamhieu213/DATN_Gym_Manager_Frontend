import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const openForgotPassword = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgotPassword(true);
    setShowResetPassword(false);
  };

  const openLogin = () => {
    setShowForgotPassword(false);
    setShowRegister(false);
    setShowResetPassword(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setShowRegister(true);
  };

  const openResetPassword = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgotPassword(false);
    setShowResetPassword(true);
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
          onOtpSent={openResetPassword}
        />
      )}

      {showResetPassword && (
        <ResetPasswordPage
          onBackToLogin={openLogin}
          onSuccess={() => {
            openLogin();
          }}
        />
      )}
    </>
  );
}

export default App;
