import {AfterViewChecked, ChangeDetectorRef, Component,enableProdMode} from '@angular/core';
import {HttpClient,HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { User} from './model/user';
import {ToastrService,IndividualConfig} from 'ngx-toastr';
import {AppConfig} from './model/app-config';
import {WorkflowStatus, Notifications, Organization, Tenant, GrantTemplate} from "./model/dahsboard";
import {Time} from "@angular/common";
import {interval} from 'rxjs';
import {GrantDataService} from './grant.data.service';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { environment } from '../environments/environment.prod';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked{


  loggedIn = localStorage.getItem('AUTH_TOKEN') === null ? false : true;

  title = 'anudan.org';
  loggedInUser: User;
  autosave: boolean = false;
  autosaveDisplay = '';
  currentView = 'grants';
  sectionAdded = false;
  sectionUpdated = false;
  notifications = [];
  selectedTemplate: GrantTemplate;
  sectionInModification = false;
  currentTenant: Tenant;
  grantSaved = false;
  confgSubscription: any;

  public appConfig: AppConfig = {
    appName: '',
    logoUrl: '',
    navbarColor: '#e3f2fd;',
    navbarTextColor: '#222',
    tenantCode: '',
    defaultSections: [],
    grantInitialStatus: new WorkflowStatus(),
    submissionInitialStatus: new WorkflowStatus(),
    granteeOrgs: [],
    workflowStatuses: [],
    tenantUsers: []
  };

  org: string;
  public defaultClass = '';

  constructor(private toastr:ToastrService, private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef, private grantService: GrantDataService) {

  }

  ngOnInit() {

    if (environment.production) {
      enableProdMode();
    }


    if ('serviceWorker' in navigator){
        navigator.serviceWorker.register('/ngsw-worker.js')
        console.log('Registered as service worker');
    }


    this.loggedInUser = localStorage.getItem('USER') === 'undefined' ? {} : JSON.parse(localStorage.getItem('USER'));
    this.initAppUI();
    const isLocal = this.isLocalhost();
    if ( this.loggedIn ) {
      this.router.navigate(['/grants']);
    } else {
      this.router.navigate(['/']);
    }


    interval(5000).subscribe(t => {
      this.initAppUI();      
    });

  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  isLocalhost() {
    return (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  }

  initAppUI() {
    const hostName = this.isLocalhost() ? this.queryParam() : this.subdomain();
    this.getAppUI(hostName);
  }

  subdomain(): string {
    const hostName = location.hostname;
    let subDomain = '';
    if (hostName !== '127.0.0.1') {
      const arr = hostName.split('.');
      if (arr.length > 1) {
        subDomain = arr[0];
      }
    }
    return subDomain;
  }


  getAppUI(hostName) {
    //console.log('hostName = ' + hostName);
    const url = '/api/public/config/'.concat(hostName);
    this.confgSubscription = this.httpClient.get<HttpResponse<AppConfig>>(url, {observe: 'response'}).subscribe((response) => {
      const newObj: any = response.body;
      this.appConfig = newObj as AppConfig;
      localStorage.setItem('X-TENANT-CODE', this.appConfig.tenantCode);

    },error => {
                            const errorMsg = error as HttpErrorResponse;
                            const x = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-full-width','progressBar':true} as Partial<IndividualConfig>;
                            const y = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-right','progressBar':true} as Partial<IndividualConfig>;
                            const errorconfig: Partial<IndividualConfig> = x;
                            const config: Partial<IndividualConfig> = y;
                            if(errorMsg.error.message==='Token Expired'){
                             //this.toastr.error('Logging you out now...',"Your session has expired", errorconfig);
                             alert("Your session has timed out. Please sign in again.")
                             this.logout();
                            } else {
                             this.toastr.error("Oops! We encountered an error.", errorMsg.error.message, config);
                            }


                          });
    if (!hostName) {
      this.defaultClass = ' navbar fixed-top navbar-expand-lg navbar-light';

    }
  }

  queryParam() {
    const name = this.getQueryStringValue('org');

    return name;

    // this.route.queryParamMap.subscribe(
    //   (queryParams: ParamMap) => {
    //     console.log(queryParams);
    //     return queryParams.get('org');
    //   }
    // );
  }

  getQueryStringValue(key: string): string {
    return decodeURIComponent(location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  }

  grateeRegistration() {
    console.log('grantee login');
    this.router.navigate(['/grantee/registration']);
  }

  logout() {
    localStorage.removeItem('AUTH_TOKEN');
    localStorage.removeItem('USER');
    this.notifications = [];
    this.grantService.changeMessage(null);
    this.confgSubscription.unsubscribe();
    this.loggedInUser = null;
    this.currentView = 'grants';
    // localStorage.removeItem('X-TENANT-CODE');
    this.loggedIn = false;
    this.router.navigate(['/']);
  }

  goToHome() {
    this.router.navigate(['grants']);
  }

  goToGrantSummary() {
    this.router.navigate(['grant']);
  }

}
