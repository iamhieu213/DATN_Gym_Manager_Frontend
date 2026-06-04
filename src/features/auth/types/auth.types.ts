export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  message: string;
  token?: string;
};

export type RegisterRequest = {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    email: string;
    registerToken: string;
  };
};