import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Role} from '../../model/user'
import {AppComponent} from '../../app.component'
import {FieldDialogComponent} from '../../components/field-dialog/field-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

    roles: Role[];

    constructor(private appComponent: AppComponent, private http: HttpClient, private dialog: MatDialog) { }

    ngOnInit() {
        this.fetchRolesForUserOrg();
    }

    fetchRolesForUserOrg(){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };
        const user = this.appComponent.loggedInUser;
        const url = 'api/admin/user/'+user.id+'/role';

        this.http.get(url,httpOptions).subscribe((roles:Role[]) => {
            this.roles = roles;

        });
    }

    createNewRole(){
        if(!this.roles){
            this.roles = [];
        }
        const role = new Role();
        role.name='';
        role.description='';
        role.editMode=true;
        role.hasUsers = false;
        this.roles.push(role);
    }

    editRole(role: Role, evt:Event){
        role.editMode=true;
    }

    cancelEdit(role: Role){
        role.editMode=false;
    }

    deleteRole(role){
        const dialogRef = this.dialog.open(FieldDialogComponent, {
            data: 'Are you sure you want to delete role ' + role.name
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {


            }
        });
    }

    saveRole(role: Role){
        role.editMode=false;
    }
}
