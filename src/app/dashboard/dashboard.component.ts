import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders,HttpParams} from '@angular/common/http';
import {User} from '../model/user';
import {SerializationHelper, Tenant, Tenants} from '../model/dahsboard';
import {AppComponent} from '../app.component';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {GrantDataService} from '../grant.data.service';
import {SingleReportDataService} from '../single.report.data.service';
import {DataService} from '../data.service';
import {Grant} from '../model/dahsboard'
import {Report} from '../model/report'
import * as $ from 'jquery'
import {ToastrService} from 'ngx-toastr';
import {GrantComponent} from "../grant/grant.component";
import {MatBottomSheet, MatDatepickerInputEvent, MatDialog} from '@angular/material';
import {GrantTemplateDialogComponent} from '../components/grant-template-dialog/grant-template-dialog.component';
import {WelcomePopupComponent} from '../components/welcome-popup/welcome-popup.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [GrantComponent]
})
export class DashboardComponent implements OnInit {

  user: User;
  tenants: Tenants;
  currentTenant: Tenant;
  hasTenant = false;
  hasKpisToSubmit: boolean;
  kpiSubmissionDate: Date;
  kpiSubmissionTitle: string;
  currentGrantId: number;
  parameters: any;

  constructor(private http: HttpClient,
              public appComponent: AppComponent,
              private router: Router,
              private route: ActivatedRoute,
              private data: GrantDataService,
              private toastr: ToastrService,
              public grantComponent: GrantComponent,
              private dataService: DataService,
              private dialog: MatDialog,
              private singleReportDataService:SingleReportDataService) {

              this.route.queryParams.subscribe(params => {
                      this.parameters = params;
                  });
  }

  ngOnInit() {
  console.log('dashboard');
    if(this.parameters.status && this.parameters.status==='n'){

    const dialogRef = this.dialog.open(WelcomePopupComponent, {
          data: this.appComponent.loggedInUser.firstName,
          panelClass:'welcome-popup-class'
        });

        dialogRef.afterClosed().subscribe(result => {
              if (result) {
                      this.fetchReportOrGrant();
              }
         });

    }else if(this.parameters.status && this.parameters.status==='e'){
        this.fetchReportOrGrant();
    }else{
        const user = JSON.parse(localStorage.getItem('USER'));
        this.appComponent.loggedInUser = user;
        this.fetchDashboard(user.id);
        this.dataService.currentMessage.subscribe(id => this.currentGrantId = id);
    }

  }


  fetchDashboard(userId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    this.appComponent.loggedIn = true;

    const url = '/api/users/' + userId + '/dashboard';
    this.http.get<Tenants>(url, httpOptions).subscribe((tenants: Tenants) => {

      // this.tenants = new Tenants();
      this.tenants = tenants;
      console.log(this.tenants);
      // this.tenants = tenants;
        if (this.tenants.tenants && this.tenants.tenants.length > 0) {
        this.currentTenant = this.tenants.tenants[0];
        this.hasTenant = true;
        localStorage.setItem('X-TENANT-CODE', this.currentTenant.name);

        for (const grant of this.currentTenant.grants) {
          for (const submission of grant.submissions) {
            if (submission.flowAuthorities) {
              this.hasKpisToSubmit = true;
              this.kpiSubmissionTitle = submission.title;
              // this.kpiSubmissionDate = submission.submitBy;
              break;
            }
          }
          if (this.hasKpisToSubmit) {
            break;
          }
        }
      }
    },
        error1 => {
      const errorMsg = error1 as HttpErrorResponse;
          this.toastr.error(errorMsg.error.message, errorMsg.error.messageTitle, {
            enableHtml: true,
            positionClass: 'toast-top-center'
          });
        });
  }

  manageGrant(grant: Grant) {
    

    const dialogRef = this.dialog.open(GrantTemplateDialogComponent, {
      data: ""
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.changeMessage(grant.id);
        this.data.changeMessage(grant,this.appComponent.loggedInUser.id);
        this.router.navigate(['grant']);
      } else {
        dialogRef.close();
      }
    });
  
  }

  fetchReportOrGrant(){
    const type = this.parameters.type;
    if(type==='grant'){
      const grantCode = this.parameters.g;
      const queryParams = new HttpParams().set('g', grantCode)
      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE')
          }),
          params: queryParams
      };
      const url = '/api/user/'+this.appComponent.loggedInUser.id+'/grant/resolve';


      this.http.get(url,httpOptions).subscribe((grant:Grant) => {
          this.data.changeMessage(grant,this.appComponent.loggedInUser.id);
          this.appComponent.originalGrant = JSON.parse(JSON.stringify(grant));
          this.appComponent.currentView = 'grant';

          this.appComponent.selectedTemplate = grant.grantTemplate;

        if((grant.workflowAssignment.filter(wf => wf.stateId===grant.grantStatus.id && wf.assignments===this.appComponent.loggedInUser.id).length>0 ) && this.appComponent.loggedInUser.organization.organizationType!=='GRANTEE' && (grant.grantStatus.internalStatus!=='ACTIVE' && grant.grantStatus.internalStatus!=='CLOSED')){
            grant.canManage=true;
        }else{
            grant.canManage=false;
        }
          if(grant.canManage && grant.grantStatus.internalStatus!='ACTIVE' && grant.grantStatus.internalStatus!='CLOSED'){
              this.router.navigate(['grant/basic-details']);
          } else{
              this.appComponent.action = 'preview';
              this.router.navigate(['grant/preview']);
          }
         // this.router.navigate(['grants']);
      });
    }else if(type==='report'){
        const reportCode = this.parameters.r;
          const queryParams = new HttpParams().set('r', reportCode)
          const httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                  'Authorization': localStorage.getItem('AUTH_TOKEN')
              }),
              params: queryParams
          };
          const url = '/api/user/'+this.appComponent.loggedInUser.id+'/report/resolve';


          this.http.get(url,httpOptions).subscribe((report:Report) => {
              this.appComponent.currentView = 'report';
              this.singleReportDataService.changeMessage(report);


              if(report.canManage ){
                  this.router.navigate(['report/report-header']);
              } else{
                  this.router.navigate(['report/report-preview']);
              }
             // this.router.navigate(['grants']);
          });
    }
  }
}
