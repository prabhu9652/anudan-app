import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import {Role, User} from '../model/user';
import {AppComponent} from '../app.component';
import {AccessCredentials} from '../model/access-credentials';

import {AuthService} from 'ng-social-login-module';
import {GoogleLoginProvider, LinkedinLoginProvider} from 'ng-social-login-module';
import {SocialUser} from 'ng-social-login-module';
import {ToastrService} from 'ngx-toastr';
import {Notifications} from '../model/dahsboard'
import {interval} from 'rxjs';


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
  logoURL:string;
  host: string;
  orgName: string;
  recaptchaToken:string;
  //recaptchaVisible = false;
  loginForm = new FormGroup({
    emailId: new FormControl('', Validators.email),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient,
              private router: Router,
              public appComponent: AppComponent,
              private authService: AuthService,
              private toastr: ToastrService) {

              this.host = localStorage.getItem('X-TENANT-CODE');

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
        role: 'user',
        recaptchaToken:''
      };
      this.signIn(user);
    });
    /*this.authService.authState.subscribe((socialUser) => {
      console.log(socialUser);
      t
    });*/
  }

  ngOnInit() {
    const tenantCode = localStorage.getItem('X-TENANT-CODE');
    this.logoURL = "/api/public/images/"+tenantCode+"/logo";

    const url = '/api/public/tenant/' + tenantCode;
    this.http.get(url,{responseType: 'text'}).subscribe((orgName) => {
       localStorage.setItem('ORG-NAME',orgName);
       this.orgName = localStorage.getItem('ORG-NAME');
    },error =>{
    });

  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    if(this.recaptchaToken===undefined){
        alert("Please tick on reCaptcha to let us know that you're not a bot.");
        return;
    }
    console.warn(this.loginForm.value);
    const user: AccessCredentials = {
      username: this.emailId.value,
      password: this.password.value,
      provider: 'ANUDAN',
      role: 'user',
      recaptchaToken: this.recaptchaToken
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
    //console.log(localStorage.getItem('X-TENANT-CODE'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE') === 'undefined' ? 'ANUDAN' : localStorage.getItem('X-TENANT-CODE')
      }),
      observe: 'response' as 'body'
    };

    let url = '/api/authenticate';

    this.http.post<HttpResponse<User>>(url, user, httpOptions).subscribe(resp => {

        const keys = resp.headers.keys();
        // console.log(keys);
        this.user = resp.body;


        localStorage.setItem('AUTH_TOKEN', resp.headers.get('Authorization'));

        this.user.permissions = new Array();
        for (const userRole of this.user.userRoles) {
          if (userRole.role.permissions) {
            for (const perm of userRole.role.permissions) {
              this.user.permissions.push(perm.permission);
            }
          }
        }
          localStorage.setItem('USER', '' + JSON.stringify(this.user));
          this.appComponent.loggedInUser = this.user;
        console.log(this.user);

        if (!this.user.organization || this.user.organization.type === 'GRANTEE') {
          this.router.navigate(['/grants']);
        } else {
          this.router.navigate(['/grants']);
        }
      },
      error => {

        const errorMsg = error as HttpErrorResponse;
        console.log(error);
        this.toastr.error(errorMsg.error.message, errorMsg.error.messageTitle, {
          enableHtml: true
        });
      });
  }

  showPopover(message: string) {
    console.log(message);
  }

  signup() {
    this.router.navigate(['registration'])
  }

  resolved(evt){
    this.recaptchaToken = evt;
  }

}
