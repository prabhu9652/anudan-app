import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
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
import * as inf from 'indian-number-format';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [GrantComponent],
    styles: [`
     ::ng-deep .mat-card-header-text {
        width:100% !important;
     }
    `]
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
  grantInProgressCount:number;
  grantActiveCount:number;
  grantClosedCount:number;

  //Retain this
  totalGrantsIssued:number=0;
  totalGrantees:number=0;
  totalGrantAmount:string='-';
  totalActiveUsers:number=0;
  portfolioData:any;

  ///////////

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

    this.appComponent.subMenu = {name:''};
    this.getDashboardSummary();
    if(this.parameters.status && this.parameters.status==='n' && this.appComponent.loggedInUser.organization.type!=='PLATFORM'){

    const dialogRef = this.dialog.open(WelcomePopupComponent, {
          data: this.appComponent.loggedInUser.firstName,
          panelClass:'welcome-popup-class'
        });

        dialogRef.afterClosed().subscribe(result => {
              if (result) {
                      this.fetchReportOrGrant();
              }
         });

    }else if(this.parameters.status && this.parameters.status==='e' && this.appComponent.loggedInUser.organization.type!=='PLATFORM'){
        this.fetchReportOrGrant();
    } else{
        const user = JSON.parse(localStorage.getItem('USER'));
        this.appComponent.loggedInUser = user;
        this.fetchDashboard(user.id);
        this.dataService.currentMessage.subscribe(id => this.currentGrantId = id);
    }

  }


  fetchDashboard(userId: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    this.appComponent.loggedIn = true;

    let url = '/api/users/' + userId + '/dashboard/in-progress';
    this.http.get<number>(url, httpOptions).subscribe((count: number) => {

     this.grantInProgressCount = count;
    },
        error1 => {
      const errorMsg = error1 as HttpErrorResponse;
          this.toastr.error(errorMsg.error.message, errorMsg.error.messageTitle, {
            enableHtml: true,
            positionClass: 'toast-top-center'
          });
    });

    url = '/api/users/' + userId + '/dashboard/active';
        this.http.get<number>(url, httpOptions).subscribe((count: number) => {

         this.grantActiveCount = count;
        },
            error1 => {
          const errorMsg = error1 as HttpErrorResponse;
              this.toastr.error(errorMsg.error.message, errorMsg.error.messageTitle, {
                enableHtml: true,
                positionClass: 'toast-top-center'
              });
    });

     url = '/api/users/' + userId + '/dashboard/closed';
        this.http.get<number>(url, httpOptions).subscribe((count: number) => {

         this.grantClosedCount = count;
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
              this.appComponent.subMenu = {name:'In-progress Grants',action:'dg'};
              this.router.navigate(['grant/basic-details']);
          } else{
              if(grant.grantStatus.internalStatus==='ACTIVE'){
                  this.appComponent.subMenu = {name:'Active Grants',action:'ag'};
              } else if (grant.grantStatus.internalStatus === 'CLOSED'){
                  this.appComponent.subMenu = {name:'Closed Grants',action:'cg'};
              }
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

               if(report.status.internalStatus==='DRAFT' || report.status.internalStatus==='ACTIVE'){
                    this.appComponent.subMenu = {name:'Upcoming Reports',action:'ur'};
                } else if(report.status.internalStatus==='REVIEW'){
                    this.appComponent.subMenu = {name:'Submitted Reports',action:'sr'};
                } else if(report.status.internalStatus==='CLOSED'){
                    this.appComponent.subMenu = {name:'Approved Reports',action:'ar'};
                }
              if(report.canManage ){
                  this.router.navigate(['report/report-header']);
              } else{
                  this.router.navigate(['report/report-preview']);
              }
             // this.router.navigate(['grants']);
          });
    }else{
        this.fetchDashboard(this.appComponent.loggedInUser.id);
    }
  }

  viewInProgressGrants(){
    this.router.navigate(['grants/draft']);
  }

  viewActiveGrants(){
      this.router.navigate(['grants/active']);
  }

  viewClosedGrants(){
      this.router.navigate(['grants/closed']);
  }

  getDashboardSummary(){
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
        })
    };

    this.appComponent.loggedIn = true;

    let url = '/api/users/' + this.appComponent.loggedInUser.id + '/dashboard/summary';

    this.http.get(url,httpOptions).subscribe((data:any) =>{
        console.log(data);
        this.totalGrantsIssued = data.summary.totalGrants;
        this.totalGrantees = data.summary.grantees;
        this.totalGrantAmount = '₹' + inf.format(Number(data.summary.totalGrantAmount),2);
        this.totalActiveUsers = data.summary.activeUsers;
        this.portfolioData = data.filters;
    });
  }
}
