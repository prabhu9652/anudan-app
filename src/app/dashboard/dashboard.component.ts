import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import {Tenant, Tenants} from '../model/dahsboard';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  tenants: Tenants;
  currentTenant: Tenant;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchDashboard(localStorage.getItem('USER_ID'));
  }

  fetchDashboard(userId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    const url = '/api/users/' + userId + '/dashboard';
    this.http.get<Tenant>(url, httpOptions).subscribe((tenants: Tenant) => {
      console.log(tenants);
      this.currentTenant = tenants;
      localStorage.setItem('X-TENANT-CODE', this.currentTenant.name);
    });
  }
}
