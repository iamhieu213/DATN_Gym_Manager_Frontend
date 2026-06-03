import OtpVerificationForm from '../components/OtpVerificationForm';

function VerifyRegisterPage() {
  return (
    <OtpVerificationForm
      mode="register"
      endpoint="http://localhost:8080/auth/verify-register-otp"
      tokenStorageKey="registerToken"
      onVerified={() => {
        window.location.href = '/login';
      }}
      onBack={() => {
        window.location.href = '/register';
      }}
    />
  );
}

export default VerifyRegisterPage;
