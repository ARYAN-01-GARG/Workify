import type { AuthContextType } from '@repo/shared-types/types';
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
    return await ApiClient.post<AuthResponse>('/api/auth/google', { idToken });
  }

  static async me() {
    return await ApiClient.get<AuthContextType>('/api/user/profile');
  }

  static async login(email: string, password: string) {
    return await ApiClient.post<AuthResponse>('/api/auth/login', { email, password });
  }

  static async register(data: any) {
    return await ApiClient.post<AuthResponse>('/api/auth/register', data);
  }

  static async sendOtp(email: string) {
    return await ApiClient.post<{ message: string }>('/api/auth/send-otp', { email });
  }

  static async verifyOtp(email: string, otp: string) {
    return await ApiClient.post<AuthResponse>('/api/auth/verify-otp', { email, otp });
  }
}
