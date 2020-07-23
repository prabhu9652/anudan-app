import { User, Role } from './model/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AdminService {

  constructor(private http: HttpClient) { }

  public getOrgRoles(user: User): Promise<Role[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };
    const url = 'api/admin/user/' + user.id + '/role';
    return this.http.get(url, httpOptions).toPromise().then<Role[]>().catch(err => {
      return Promise.reject('Error retreiving roles');
    });
  }

  public getOrgUsers(user: User): Promise<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };
    const url = 'api/admin/user/' + user.id + '/user';

    return this.http.get(url, httpOptions).toPromise().then<User[]>().catch(err => {
      return Promise.reject('Could not retreive users');
    });
  }

  public deleteUser(user: User, loggedInUser: User): Promise<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };
    const url = 'api/admin/user/' + loggedInUser.id + '/user/' + user.id;
    return this.http.delete(url, httpOptions).toPromise().then<User[]>().catch(err => {
      return Promise.reject('Could not delete user');
    });
  }

}