import { UserRole } from '@repo/db';

export interface AuthContextType {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  name: string;
  avatarUrl?: string;
}

export interface ISendOtpPayload {
  email: string;
  role?: UserRole;
}

export interface IVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface IGoogleAuthPayload {
  idToken: string;
}
