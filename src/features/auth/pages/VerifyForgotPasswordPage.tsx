import OtpVerificationForm from '../components/OtpVerificationForm';

function VerifyForgotPasswordPage() {
  return (
    <OtpVerificationForm
      mode="forgot-password"
      endpoint="/auth/verify-forgot-password-otp"
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
