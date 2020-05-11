import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpHeaders,HttpResponse,HttpErrorResponse } from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../model/user';
import {RegistrationCredentials} from '../model/registration-credentials';
import {AppComponent} from '../app.component';
import {AuthService, GoogleLoginProvider, SocialUser} from 'ng-social-login-module';
import {AccessCredentials} from '../model/access-credentials';
import {register} from 'ts-node';
import {ToastrService} from 'ngx-toastr';
import {MessagingComponent} from '../components/messaging/messaging.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.sass']
})
export class PasswordResetComponent implements OnInit {

  provider: string;
  socialUser: SocialUser;
  hasEmailId:boolean = false;
  logoURL:string;
  orgName:string;
  parameters: any;
  currentEmail:string='';
  userOrg:string='';
  recaptchaToken:string;
  user: User;
  reCaptchaResolved: boolean = false;
  sentStatus: string = "notsent";
  sentEmailStatusMessage:string;
  hasError: boolean = false;
  errorMessage: string;

  resetForm = new FormGroup({
    emailId: new FormControl('', Validators.email),
  });
  @ViewChild("emailId") emailIdElem: ElementRef;


  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient, private router: Router, public appComponent: AppComponent, private authService: AuthService,private toastr: ToastrService,private dialog: MatDialog) {
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

    if(this.parameters.mail){
      if(!this.hasEmailId){
          this.hasEmailId = true;
          this.currentEmail=this.parameters.mail;
          this.resetForm.setValue({'emailId':this.currentEmail});
          this.currentEmail = this.currentEmail.replace(/ /g,"+");
      }
    }

    this.resetForm.valueChanges.subscribe(data => {
        if(data.emailId===null || data.emailId.trim()===""){
            this.reCaptchaResolved = false;
        }
    });
  }

  onSubmit() {
  // TODO: Use EventEmitter with form value
    //console.warn(this.granteeRegisteationForm.value);
    this.submit();
  }

  submit() {
     this.sendPasswordResetMail();
  }


  sendPasswordResetMail() {

    this.sentStatus = 'sending';

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE')
      })
    };

    //const form = this.granteeRegisteationForm.value;
    const email = this.resetForm.get('emailId').value;
    const url = '/api/users/forgot/'+email;
    this.http.get(url, httpOptions).subscribe( (result:any) => {
        this.sentStatus = 'sent';
        this.sentEmailStatusMessage = result.message;
    },error =>{
        const errorMsg = error as HttpErrorResponse;
        this.hasError = true;
        this.errorMessage = errorMsg.error.message;
        this.sentStatus = 'notsent';
        this.resetForm.setValue(
            {'emailId':email}
        );
        this.currentEmail = email;
        this.reCaptchaResolved = false;
    });

  }


  resolved(evt){
   this.recaptchaToken = evt;
   if(evt!=null){
       this.reCaptchaResolved = true;
   }else{
       this.reCaptchaResolved = false;
   }
  }

  goBackToLogin(){
    this.router.navigate(['/login']);
  }
}
