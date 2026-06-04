import OtpVerificationForm from '../components/OtpVerificationForm';

function VerifyRegisterPage() {
  return (
    <OtpVerificationForm
      mode="register"
      endpoint="/auth/verify-register"
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
