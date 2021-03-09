import { Tag, TemplateLibrary } from './../../model/dahsboard';
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
    docs: TemplateLibrary[];
    tags: Tag[];
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
                this.adminService.getOrgRoles(this.appComp.loggedInUser).then((data: Role[]) => {
                    this.roles = data;
                });
            });
        } else if (ev.tab.textLabel === 'Library') {
            this.adminService.getLibraryDocs(this.appComp.loggedInUser).then((data: TemplateLibrary[]) => {
                this.docs = data;
                //this.appComp.currentTenant.templateLibrary = this.docs;
            });
        } else if (ev.tab.textLabel === 'Tag Library') {
            this.adminService.getOrgTags(this.appComp.loggedInUser).then((data: Tag[]) => {
                this.tags = data;
                //this.appComp.currentTenant.templateLibrary = this.docs;
            });
        }
    }
}
