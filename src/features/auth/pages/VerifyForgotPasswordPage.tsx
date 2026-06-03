import OtpVerificationForm from '../components/OtpVerificationForm';

function VerifyForgotPasswordPage() {
  return (
    <OtpVerificationForm
      mode="forgot-password"
      endpoint="http://localhost:8080/auth/verify-forgot-password-otp"
      tokenStorageKey="forgotPasswordToken"
      onVerified={() => {
        window.location.href = '/reset-password';
      }}
      onBack={() => {
        window.location.href = '/forgot-password';
      }}
    />
  );
}

export default VerifyForgotPasswordPage;
