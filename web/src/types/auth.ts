// -------------------- Types & Interfaces --------------------
export interface IUser {
  id: string;
  name?: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  status?: "online" | "offline" | "away" | "busy";
  bio?: string;
  friends?: string[];
  blockedUsers?: string[];
  lastSeen?: Date;
  otp?: string;
  otpExpires?: Date;
  otpVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
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
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
}
