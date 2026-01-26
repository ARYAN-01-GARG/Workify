import type { AuthContextType, IRegisterDto } from '@repo/shared-types/types';
import { ApiClient } from '@/lib/api-client';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
  };
}

export class AuthService {
  static async handleGoogleAuth(idToken: string) {
    return await ApiClient.post<AuthResponse>('/auth/google', { idToken });
  }

  static async me() {
    return await ApiClient.get<AuthContextType>('/user/profile');
  }

  static async login(email: string, password: string) {
    return await ApiClient.post<AuthResponse>('/auth/login', { email, password });
  }

  static async register(data: IRegisterDto) {
    return await ApiClient.post<AuthResponse>('/auth/register', data);
  }

  static async sendOtp(email: string) {
    return await ApiClient.post<{ message: string }>('/auth/send-otp', { email });
  }

  static async verifyOtp(email: string, otp: string) {
    return await ApiClient.post<AuthResponse>('/auth/verify-otp', { email, otp });
  }
}
