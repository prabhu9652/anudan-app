import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User, Role} from '../../model/user'
import {AppComponent} from '../../app.component'
import {FieldDialogComponent} from '../../components/field-dialog/field-dialog.component';
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    users: User[];
    newUseEntry: User;
    focusField:any;
    roles: Role[];
    selectedRoles: Role[] = [];
    filteredOptions: Observable<Role[]>;
    myControl: FormControl;
    separatorKeysCodes: number[] = [ENTER, COMMA];


    @ViewChild('createRoleBtn') createRoleBtn: ElementRef;
    @ViewChild('email') emailInput: ElementRef;
    @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor(private appComponent: AppComponent, private http: HttpClient, private dialog: MatDialog) { }

    ngOnInit() {
        this.myControl = new FormControl();
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


            const roles1 = this.roles.slice();
            this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value),
                map(name => name ? this._filter(name) : roles1)
            );

        });
    }

    private _filter(value: any): Role[] {
        let filterValue;
        if(typeof value==='string'){
            filterValue = value.toLowerCase();
        }else {
            filterValue = value.name;
        }

        const selectedRole = this.roles.filter(option => option.name.toLowerCase().includes(filterValue));


        return selectedRole;
    }

    checkIfSelected(role):boolean{

        for(let singleRole of this.selectedRoles){
            if(singleRole.id === role.id){
                return true;
            }
        }
        return false;
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.selectedRoles.push(event.option.value);
        this.roleInput.nativeElement.value = '';
        this.myControl.setValue(null);
    }


    add(event: MatChipInputEvent): void {
        // Add fruit only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matAutocomplete.isOpen) {
          const input = event.input;
          const value = event.value;

          // Add our fruit
          /*if ((value || '').trim()) {
            this.selectedRoles.push(value);
          }*/

          // Reset the input value
          if (input) {
            input.value = '';
          }

          this.myControl.setValue(null);
        }
  }

    remove(role: Role): void {
        const index = this.selectedRoles.findIndex(r => r.id===role.id);

        if (index >= 0) {
            this.selectedRoles.splice(index, 1);
        }
    }

}
