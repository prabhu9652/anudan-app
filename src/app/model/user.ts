import { Organization } from './organization';

export class User {
		id?:  number;
	 firstName?: string;
	 lastName?: string;
   emailId?: string;
	 username?: string;
   password?: string;
	 role?: string;
   organization?: Organization;

}
