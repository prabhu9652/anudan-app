import {Organization} from './organization';

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export class UserRole {
  id: number;
  role: Role;
}

export class Permission {
  id: number;
  permission: string;
}

export class User {
  id?: number;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  username?: string;
  password?: string;
  organization?: Organization;
  userRoles?: UserRole[];
  permissions: string[];
  recaptchaToken: string;
}
