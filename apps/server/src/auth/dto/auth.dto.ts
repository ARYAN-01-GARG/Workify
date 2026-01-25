import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import type { IGoogleAuthPayload } from '@repo/shared-types';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAuthDto implements IGoogleAuthPayload {
  @ApiProperty({ example: 'req_123...' })
  @IsString()
  idToken: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  otp: string;
}
