// -------------------- Types & Interfaces --------------------
export interface IUser {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
}

export interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<{ success: boolean; message: string }>;
  signup: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface IVerifyUser {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
}

export interface IVerifyResponse {
  success: boolean;
  message: string;
  data: {
    user: IVerifyUser;
  };
}

export interface ILoginResponseUser {
  id: string;
  email: string;
  username: string;
}
export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: ILoginResponseUser;
  };
}

export interface ISignupResponse {
  success: boolean;
  message: string;
}