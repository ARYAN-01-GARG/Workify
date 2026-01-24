import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from '@repo/db';

export class SendOtpDto {
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // Optional, default to CANDIDATE if new
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}
