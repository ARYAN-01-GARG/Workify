import { IsString } from 'class-validator';
import type { IGoogleAuthPayload } from '@repo/shared-types';

export class GoogleAuthDto implements IGoogleAuthPayload {
  @IsString()
  idToken: string;
}
