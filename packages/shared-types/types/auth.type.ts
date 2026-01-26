import { UserRole } from '@repo/db';

export interface AuthContextType {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
  name: string;
  avatarUrl?: string;
}

export interface ISendOtpPayload {
  email: string;
}

export interface IVerifyOtpPayload {
  email: string;
  otp: string;
}

export interface IGoogleAuthPayload {
  idToken: string;
}

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface IRegisterDto {
  email: string;
  name: string;
  password?: string;
  otp?: string;
  avatarUrl?: string; // Sometimes used in registration flow
}
