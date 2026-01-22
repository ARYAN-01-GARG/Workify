import type { UserRole } from '@repo/db';
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export interface PermissionRequirement {
  role?: UserRole;
  permissions?: string[];
}

export const RequirePermissions = (requirement: PermissionRequirement) => SetMetadata(PERMISSIONS_KEY, requirement);
