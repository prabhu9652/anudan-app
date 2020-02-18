import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';
import {AppComponent} from './app.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {IconsComponent} from './icons/icons.component';
import {MapsComponent} from './maps/maps.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {LoginComponent} from './login/login.component';
import {MessagingComponent} from './components/messaging/messaging.component';
import {HomeComponent} from './home/home.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {WfassignmentComponent} from './components/wfassignment/wfassignment.component';
import {GranthistoryComponent} from './components/granthistory/granthistory.component';
import {NotificationspopupComponent} from './components/notificationspopup/notificationspopup.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {
  AgmCoreModule
} from '@agm/core';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {KpisubmissionComponent} from './kpisubmission/kpisubmission.component';
import {RegistrationComponent} from './registration/registration.component';
import {SocialLoginModule, AuthServiceConfig} from 'ng-social-login-module';
import {GoogleLoginProvider, LinkedinLoginProvider} from 'ng-social-login-module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {ToastrModule} from 'ngx-toastr';
import {MatBottomSheet, MatDatepickerModule, MatNativeDateModule,MatIconModule,MatExpansionModule,MatBadgeModule,MatMenuModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DatePipe} from '@angular/common';
import {Colors} from './model/app-config';
import { ExportAsModule } from 'ngx-export-as';
import { RecaptchaModule } from 'ng-recaptcha';
import { NgxSpinnerModule } from "ngx-spinner";
import {indianCurrencyInWords} from 'indian-currency-in-words';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('788882936832-lr47bt54r71ldb866e63gklpgi1cjujd.apps.googleusercontent.com')
  },
  {
    id: LinkedinLoginProvider.PROVIDER_ID,
    provider: new LinkedinLoginProvider('LinkedIn-client-Id')
  }
], true);

export function provideConfig() {
  return config;
}


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    HomeComponent,
    WelcomeComponent,
    KpisubmissionComponent,
    RegistrationComponent,
    WfassignmentComponent,
    GranthistoryComponent,
    MessagingComponent,
    NotificationspopupComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    MatTooltipModule,
    MatExpansionModule,
    MatBadgeModule,
    AppRoutingModule,
    HttpClientModule,
    RecaptchaModule,
    MatMenuModule,
    MDBBootstrapModule.forRoot(),
    ExportAsModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 300
    }),
    SocialLoginModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
      ToastrModule.forRoot({
        autoDismiss: false,
        enableHtml: true
      }),
      MatDatepickerModule,
      MatNativeDateModule,
      MatSnackBarModule,
      MatIconModule,
      NgxSpinnerModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
      MatDatepickerModule,
      MatBottomSheet,
      MatExpansionModule,
      MatSnackBarModule,
      MatBadgeModule,
      MatIconModule,
      MatTooltipModule,
      DatePipe,
      Colors,
      MatMenuModule,
      indianCurrencyInWords
  ],
  entryComponents:[WfassignmentComponent,GranthistoryComponent,NotificationspopupComponent,MessagingComponent],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
