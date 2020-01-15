import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
    focusField:any;

    @ViewChild('createRoleBtn') createRoleBtn: ElementRef;

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
        role.id = 0;
        role.name='';
        role.description='';
        role.editMode=true;
        role.hasUsers = false;
        this.roles.unshift(role);
        this.toggleCreateRole();
        this.focusField = '#role_'+role.id;
    }

    editRole(role: Role, evt:Event){
        role.editMode=true;
        $('#role_'+role.id).css('background','#f6f6f6')
    }

    cancelEdit(role: Role){
        role.editMode=false;
        if(role.id===0){
            const index = this.roles.findIndex(r => r.id === role.id);
            this.roles.splice(index, 1);
        }
        $('#role_'+role.id).css('background','#fff');
        this.toggleCreateRole();
    }

    deleteRole(role){
        const dialogRef = this.dialog.open(FieldDialogComponent, {
            data: 'Are you sure you want to delete role ' + role.name
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const httpOptions = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                        'Authorization': localStorage.getItem('AUTH_TOKEN')
                    })
                };
                const user = this.appComponent.loggedInUser;
                const url = 'api/admin/user/'+user.id+'/role/'+role.id;
                this.http.delete(url,httpOptions).subscribe((updatedList:Role[]) =>{
                    this.roles = updatedList;
                });
            }
        });
    }

    saveRole(role: Role){
        role.editMode=false;

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };
        const user = this.appComponent.loggedInUser;
        const url = 'api/admin/user/'+user.id+'/role';
        this.http.put(url,role,httpOptions).subscribe((roleReturned:Role) =>{
            role = roleReturned;
        });
    }

    toggleCreateRole(){
        const createRoleButton = this.createRoleBtn.nativeElement;
        if(createRoleButton.disabled){
            createRoleButton.disabled=false;
        }else if(!createRoleButton.disabled){
          createRoleButton.disabled=true;
      }
    }
}
