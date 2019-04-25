import {Organization} from './organization';

export class Role {
  id: number;
  name: string;
  createdAt: number;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: any;
}

export class User {
  id?: number;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  username?: string;
  password?: string;
  organization?: Organization;
  role?: Role;
}
