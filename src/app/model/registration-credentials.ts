import {Organization} from './organization';
import {Role} from './user';

export class RegistrationCredentials {
  id?: number;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  organizationName: string;
  organization?: Organization;
  role?: string;
}
