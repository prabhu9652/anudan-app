import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import * as jQuery from 'jquery';

import {Role, User} from '../model/user';
import {AppComponent} from '../app.component';
import {AccessCredentials} from '../model/access-credentials';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {


  user: User;
  headers: HttpHeaders;
  loginForm = new FormGroup({
    emailId: new FormControl('', Validators.email),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient, private router: Router, private appComponent: AppComponent) {
  }

  ngOnInit() {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.loginForm.value);
    this.signIn();
  }

  get emailId() {
    return this.loginForm.get('emailId');
  }

  get password() {
    return this.loginForm.get('password');
  }

  signIn() {
    console.log(localStorage.getItem('X-TENANT-CODE'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE') === 'undefined' ? 'ANUDAN' : localStorage.getItem('X-TENANT-CODE')
      }),
      observe: 'response' as 'body'
    };


    const url = '/api/authenticate';
    const user: AccessCredentials = {
      username: this.emailId.value,
      password: this.password.value,
      role: 'user'
    };
    this.http.post<HttpResponse<User>>(url, user, httpOptions).subscribe(resp => {

        const keys = resp.headers.keys();
        // console.log(keys);
        this.user = resp.body;


        localStorage.setItem('AUTH_TOKEN', resp.headers.get('Authorization'));
        localStorage.setItem('USER', '' + JSON.stringify(this.user));

        if (!this.user.organization || this.user.organization.type === 'GRANTEE') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error => {
        switch (error.status) {
          case 401:
            const signInButton = this.loginForm.get('btn-signin');
            console.log(signInButton);

            alert('A problem occured while processing your login. Please try again');
            break;
        }
      });
  }

  showPopover(message: string) {
    console.log(message);
  }

}
