import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user';
import {Tenant, Tenants} from '../model/dahsboard';
import {AppComponent} from '../app.component';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

import { DataService } from "../data.service";
import { Grant } from '../model/dahsboard'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;
  tenants: Tenants;
  currentTenant: Tenant;
  constructor(private http: HttpClient,
     private appComponent: AppComponent,
     private router: Router,
    private route: ActivatedRoute,
    private data: DataService) { }

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

    this.appComponent.loggedIn = true;

    const url = '/api/users/' + userId + '/dashboard';
    this.http.get<Tenants>(url, httpOptions).subscribe((tenants: Tenants) => {
      console.log(tenants);
      this.tenants = tenants;
      if (this.tenants.tenants && this.tenants.tenants.length > 0) {
          this.currentTenant = this.tenants.tenants[0];
          localStorage.setItem('X-TENANT-CODE', this.currentTenant.name);
      }
    });
  }

  manageGrant(grant: Grant){
    console.log("Clicked Manage Grant");
    this.data.changeMessage(grant);
    this.router.navigate(['grant']);
  }
}
