import { AdminService } from './../../admin.service';
import { Role, User } from './../../model/user';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { MatTabChangeEvent } from '@angular/material';


@Component({
    selector: 'organization-admin-dashboard',
    templateUrl: './orgadmin.component.html',
    styleUrls: ['./orgadmin.component.css']
})
export class OrgadminComponent implements OnInit {

    roles: Role[];
    users: User[];
    constructor(
        public appComp: AppComponent,
        private adminService: AdminService
    ) { }

    ngOnInit() {
        this.appComp.subMenu = { name: 'Organization Admin' };
        this.adminService.getOrgRoles(this.appComp.loggedInUser).then((data: Role[]) => {
            this.roles = data;
        });
    }

    tabSelected(ev: MatTabChangeEvent) {
        if (ev.tab.textLabel === 'Roles') {
            this.adminService.getOrgRoles(this.appComp.loggedInUser).then((data: Role[]) => {
                this.roles = data;
            });
        } else if (ev.tab.textLabel === 'Users') {
            this.adminService.getOrgUsers(this.appComp.loggedInUser).then((data: User[]) => {
                this.users = data;
            });
        }
    }
}
