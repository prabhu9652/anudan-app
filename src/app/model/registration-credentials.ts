import {Organization} from './organization';
import {Role} from './user';

export class RegistrationCredentials {
  id?: number;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  username?: string;
  password?: string;
  organization?: Organization;
  role?: string;
}
