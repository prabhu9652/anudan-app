import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../model/user';
import {RegistrationCredentials} from '../model/registration-credentials';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit {

  granteeRegisteationForm = new FormGroup({
    emailId: new FormControl('', Validators. email),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });

  constructor(private http: HttpClient, private router: Router, private appComponent: AppComponent) { }

  ngOnInit() {
  }

  onSubmit() {
  // TODO: Use EventEmitter with form value
    console.warn(this.granteeRegisteationForm.value);
  }

  register() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE')
      })
    };

    const form = this.granteeRegisteationForm.value;
    const user: RegistrationCredentials = {
      emailId : this.granteeRegisteationForm.value.emailId,
      password : this.granteeRegisteationForm.value.password,
      firstName: '',
      lastName: '',
      username: this.granteeRegisteationForm.value.emailId,
      role: 'USER',
      organization: null
    };
    const url = '/api/users/';
    this.http.post<User>(url, user, httpOptions).subscribe( (response: User) => {

      // ocalStorage.setItem('AUTH_TOKEN', resp.headers.get('Authorization'));
      localStorage.setItem('USER', JSON.stringify(response));
      this.appComponent.loggedIn = true;
      this.appComponent.loggedInUser = response;

      this.router.navigate(['dashboard']);
    });
  }
}
