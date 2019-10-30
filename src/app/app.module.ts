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

import {UserProfileComponent} from './user-profile/user-profile.component';
import {TableListComponent} from './table-list/table-list.component';
import {TypographyComponent} from './typography/typography.component';
import {IconsComponent} from './icons/icons.component';
import {MapsComponent} from './maps/maps.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {UpgradeComponent} from './upgrade/upgrade.component';
import {LoginComponent} from './login/login.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {WfassignmentComponent} from './components/wfassignment/wfassignment.component';
import {GranthistoryComponent} from './components/granthistory/granthistory.component';
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
import {MatBottomSheet, MatDatepickerModule, MatNativeDateModule,MatIconModule,MatExpansionModule,MatBadgeModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DatePipe} from '@angular/common';
import {Colors} from './model/app-config';


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
    KpisubmissionComponent,
    RegistrationComponent,
    WfassignmentComponent,
    GranthistoryComponent
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
    MDBBootstrapModule.forRoot(),
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
      MatIconModule
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
      Colors
  ],
  entryComponents:[WfassignmentComponent,GranthistoryComponent],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
}
