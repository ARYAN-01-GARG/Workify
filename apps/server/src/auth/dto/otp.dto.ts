import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from '@repo/db';
import type { ISendOtpPayload, IVerifyOtpPayload } from '@repo/shared-types';

export class SendOtpDto implements ISendOtpPayload {
  @IsEmail()
  email: string;
}

export class VerifyOtpDto implements IVerifyOtpPayload {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;
}
