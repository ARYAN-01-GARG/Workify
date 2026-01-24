import { Exclude } from 'class-transformer';
import { UserRole } from '@repo/db';

export class UserEntity {
  id: string;
  email: string;
  @Exclude()
  password?: string;
  role: UserRole;
  isVerified: boolean;
  name: string;
  bio?: string;
  about?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  candidateProfile?: any;
  recruiterProfile?: any;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
