import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import {Role, User} from '../model/user';
import {AppComponent} from '../app.component';
import {AccessCredentials} from '../model/access-credentials';

import {AuthService} from 'ng-social-login-module';
import {GoogleLoginProvider, LinkedinLoginProvider} from 'ng-social-login-module';
import {SocialUser} from 'ng-social-login-module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  user: User;
  provider: string;
  socialUser: SocialUser;
  headers: HttpHeaders;
  loggedIn: boolean;
  loginForm = new FormGroup({
    emailId: new FormControl('', Validators.email),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient, private router: Router, private appComponent: AppComponent, private authService: AuthService) {
  }

  signInWithGoogle(): void {

    this.provider = GoogleLoginProvider.PROVIDER_ID;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      this.socialUser = userData;
      this.loggedIn = (this.socialUser != null);
      const user: AccessCredentials = {
        username: this.socialUser.email,
        password: '',
        provider: this.provider,
        role: 'user'
      };
      this.signIn(user);
    });
    /*this.authService.authState.subscribe((socialUser) => {
      console.log(socialUser);
      t
    });*/
  }

  ngOnInit() {

  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.loginForm.value);
    const user: AccessCredentials = {
      username: this.emailId.value,
      password: this.password.value,
      provider: 'ANUDAN',
      role: 'user'
    };
    this.signIn(user);
  }

  get emailId() {
    return this.loginForm.get('emailId');
  }

  get password() {
    return this.loginForm.get('password');
  }

  signIn(user: AccessCredentials) {
    console.log(localStorage.getItem('X-TENANT-CODE'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE') === 'undefined' ? 'ANUDAN' : localStorage.getItem('X-TENANT-CODE')
      }),
      observe: 'response' as 'body'
    };


    const url = '/api/authenticate';

    this.http.post<HttpResponse<User>>(url, user, httpOptions).subscribe(resp => {

        const keys = resp.headers.keys();
        // console.log(keys);
        this.user = resp.body;


        localStorage.setItem('AUTH_TOKEN', resp.headers.get('Authorization'));
        localStorage.setItem('USER', '' + JSON.stringify(this.user));
        this.appComponent.loggedInUser = this.user;

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

  signup() {
    this.router.navigate(['registration'])
  }

}
