import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from '@repo/db';
import type { ISendOtpPayload, IVerifyOtpPayload } from '@repo/shared-types';

export class SendOtpDto implements ISendOtpPayload {
  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // Optional, default to CANDIDATE if new
}

export class VerifyOtpDto implements IVerifyOtpPayload {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}
