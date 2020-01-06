import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../model/user';
import {RegistrationCredentials} from '../model/registration-credentials';
import {AppComponent} from '../app.component';
import {AuthService, GoogleLoginProvider, SocialUser} from 'ng-social-login-module';
import {AccessCredentials} from '../model/access-credentials';
import {register} from 'ts-node';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit {

  provider: string;
  socialUser: SocialUser;
  logoURL:string;
  orgName:string;
  parameters: any;
  currentEmail:string='';
  userOrg:string='';
  @ViewChild("emailId") emailIdElem: ElementRef;
  @ViewChild("firstName") firstNameElem: ElementRef;
  @ViewChild("lastName") lastNameElem: ElementRef;
  @ViewChild("password") passwordElem: ElementRef;
  @ViewChild("confirmPassword") confirmPasswordElem: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient, private router: Router, public appComponent: AppComponent, private authService: AuthService) {
    this.activatedRoute.queryParams.subscribe(params => {
        this.parameters = params;
    });
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

    if(this.parameters.email){
      this.currentEmail=this.parameters.email;
    }
    if(this.parameters.org){
      this.userOrg=this.parameters.org;
    }


  }

  onSubmit() {
  // TODO: Use EventEmitter with form value
    //console.warn(this.granteeRegisteationForm.value);
    this.submit();
  }

  submit() {
    const user =  new RegistrationCredentials();
     user.emailId = this.emailIdElem.nativeElement.value;
      user.password = this.passwordElem.nativeElement.value;
      user.firstName = this.firstNameElem.nativeElement.value;
      user.lastName = this.lastNameElem.nativeElement.value;
      user.organizationName = this.userOrg;
      user.username = this.emailIdElem.nativeElement.value;
      user.role = 'USER';
      user.organization = null;


    this.registerUser(user);
  }

  registerUser(user: RegistrationCredentials) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE')
      })
    };

    //const form = this.granteeRegisteationForm.value;

    const url = '/api/users/';
    this.http.post<User>(url, user, httpOptions).subscribe( (response: User) => {

      // ocalStorage.setItem('AUTH_TOKEN', resp.headers.get('Authorization'));
      localStorage.setItem('USER', JSON.stringify(response));
      this.appComponent.loggedIn = true;
      this.appComponent.loggedInUser = response;

      if(this.parameters){
        this.router.navigate(['welcome'], { queryParams: { g: this.parameters.g, email: this.parameters.email,org:this.parameters.org,type:this.parameters.type } });
      }else{
        this.router.navigate(['dashboard']);
        }
    });
  }

  signUpWithGoogle(): void {

    this.provider = GoogleLoginProvider.PROVIDER_ID;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData) => {
      this.socialUser = userData;
      const user: RegistrationCredentials = {
        emailId : this.socialUser.email,
        password : this.passwordElem.nativeElement.value,
        confirmPassword : this.confirmPasswordElem.nativeElement.value,
        firstName: this.socialUser.name,
        lastName: '',
        organizationName: this.userOrg,
        username: this.socialUser.email,
        role: 'USER',
        organization: null
      };
      this.registerUser(user);
    });
    /*this.authService.authState.subscribe((socialUser) => {
      console.log(socialUser);
      t
    });*/
  }

  signup(){
  }
}
