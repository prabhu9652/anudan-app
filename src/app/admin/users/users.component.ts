import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User, Role} from '../../model/user'
import {AppComponent} from '../../app.component'
import {FieldDialogComponent} from '../../components/field-dialog/field-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    users: User[];
    focusField:any;
    roles: Role[];

    @ViewChild('createRoleBtn') createRoleBtn: ElementRef;
    @ViewChild('email') emailInput: ElementRef;
    @ViewChild('role') roleInput: ElementRef;

    constructor(private appComponent: AppComponent, private http: HttpClient, private dialog: MatDialog) { }

    ngOnInit() {
        this.fetchOrgUsers();
        this.fetchRolesForUserOrg();
    }

    fetchOrgUsers(){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };
        const user = this.appComponent.loggedInUser;
        const url = 'api/admin/user/'+user.id+'/user';

        this.http.get(url,httpOptions).subscribe((users:User[]) => {
            this.users = users;

        });
    }

    createNewUser(){
        if(!this.users){
            this.users = [];
        }
        const user = new User();
        user.id = 0;
        user.emailId=this.emailInput.nativeElement.value;

        this.users.unshift(user);
        this.toggleCreateUser();
        this.focusField = '#user_'+user.id;
    }



    deleteUser(user){
        const dialogRef = this.dialog.open(FieldDialogComponent, {
            data: 'Are you sure you want to delete role ' + user.emailId
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
                const url = 'api/admin/user/'+this.appComponent.loggedInUser.id+'/user/'+user.id;
                this.http.delete(url,httpOptions).subscribe((updatedList:User[]) =>{
                    this.users = updatedList;
                });
            }
        });
    }

    saveUser(user: User){

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };
        const url = 'api/admin/user/'+this.appComponent.loggedInUser+'/user';
        this.http.put(url,user,httpOptions).subscribe((userReturned:User) =>{
            user = userReturned;
        });
    }

    toggleCreateUser(){
        const createRoleButton = this.createRoleBtn.nativeElement;
        if(createRoleButton.disabled){
            createRoleButton.disabled=false;
        }else if(!createRoleButton.disabled){
          createRoleButton.disabled=true;
      }
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
}
