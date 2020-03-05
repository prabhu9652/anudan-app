import { Component, OnInit, ViewChild, AfterViewInit, HostListener,ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import {WfassignmentComponent} from '../../components/wfassignment/wfassignment.component';
import {GranthistoryComponent} from '../../components/granthistory/granthistory.component';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import {MatDialog} from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import { CarouselComponent} from 'angular-bootstrap-md';
import {GrantDataService} from '../../grant.data.service';
import {DataService} from '../../data.service';
import {GrantUpdateService} from '../../grant.update.service';
import {Grant, Notifications,WorkflowAssignmentModel,WorkflowAssignment} from '../../model/dahsboard';
import {Report,ReportWorkflowAssignmentModel, ReportWorkflowAssignment} from '../../model/report';
import {GrantComponent} from '../../grant/grant.component';
import {AppComponent} from '../../app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {interval} from 'rxjs';
import {ToastrService,IndividualConfig} from 'ngx-toastr';
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import {NotificationspopupComponent} from '../../components/notificationspopup/notificationspopup.component';
import {SingleReportDataService} from '../../single.report.data.service'



@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  providers: [GrantComponent],
  styles: [`
    ::ng-deep .notifications-panel > .mat-expansion-panel-content > .mat-expansion-panel-body{
        background:#f5f9ff !important;
        padding: 5px 20px !important;
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  currentGrant: Grant;
  currentReport: Report;
  grantToUpdate: Grant;
  private yScrollStack: number[] = [];
  action: any;
  currentGrantId: number;
  subscription: any;
  intervalSubscription: any;
  msgCount: number = 0;
  langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
  humanizer: HumanizeDuration = new HumanizeDuration(this.langService);

  constructor(private grantData: GrantDataService
    , public appComponent: AppComponent
    , public location: Location
    , private router: Router
    , private activatedRoute: ActivatedRoute
    , private dataService: DataService
    , private grantUpdateService: GrantUpdateService
    , private http: HttpClient
    , private toastr:ToastrService
    , grantComponent: GrantComponent
    , private dialog: MatDialog
    , private singleReportDataService: SingleReportDataService) {
    
  }

  ngOnInit() {
  this.dataService.currentMessage.subscribe(id => this.currentGrantId = id);
  this.singleReportDataService.currentMessage.subscribe((report) => {
      this.currentReport = report;
  });

      this.grantData.currentMessage.subscribe(grant => this.currentGrant = grant);

      const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

      if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
          // if we are on windows OS we activate the perfectScrollbar function

          document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      } else {
          document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      }
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

      this.location.subscribe((ev:PopStateEvent) => {
          this.lastPoppedUrl = ev.url;
      });
       this.router.events.subscribe((event:any) => {
          if (event instanceof NavigationStart) {
             if (event.url != this.lastPoppedUrl)
                 this.yScrollStack.push(window.scrollY);
         } else if (event instanceof NavigationEnd) {
             if (event.url == this.lastPoppedUrl) {
                 this.lastPoppedUrl = undefined;
                 window.scrollTo(0, this.yScrollStack.pop());
             } else
                 window.scrollTo(0, 0);
         }
      });
      this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
           elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;
      });
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
          let ps = new PerfectScrollbar(elemMainPanel);
          ps = new PerfectScrollbar(elemSidebar);
      }

      this.appComponent.initAppUI();
      /*interval(30000).subscribe(t => {
            this.appComponent.initAppUI();
          });*/

      this.intervalSubscription = interval(1000).subscribe(t => {
           if($("#messagepopover").css('display')==='block'){
            return;
           }

            if(localStorage.getItem('USER')) {
                const url = '/api/user/' + this.appComponent.loggedInUser.id + '/notifications/';
                  const httpOptions = {
                    headers: new HttpHeaders({
                      'Content-Type': 'application/json',
                      'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                      'Authorization': localStorage.getItem('AUTH_TOKEN')
                    })
                  };


                  this.http.get<Notifications[]>(url, httpOptions).subscribe((notifications: Notifications[]) => {
                    this.appComponent.notifications = notifications;
                    this.appComponent.unreadMessages = 0;
                    for(let notice of this.appComponent.notifications){
                        if(!notice.read){
                            this.appComponent.unreadMessages += 1;
                        }
                    }
                    if(!JSON.parse(localStorage.getItem("MESSAGE_COUNT")) || JSON.parse(localStorage.getItem("MESSAGE_COUNT"))!==this.appComponent.unreadMessages){
                        localStorage.setItem("MESSAGE_COUNT",String(this.appComponent.unreadMessages));
                        this.appComponent.hasUnreadMessages = true;
                    }
                    if(localStorage.getItem('TM')===undefined && localStorage.getItem('CM')===undefined){
                        localStorage.setItem('TM','0');
                        localStorage.setItem('CM','0');
                    }

                    const urmVal = notifications.length;
                    let tmVal = Number(JSON.parse(localStorage.getItem('TM')));
                    let cmVal = Number(JSON.parse(localStorage.getItem('CM')));
                    localStorage.setItem('CM',String(urmVal-tmVal+cmVal));
                    localStorage.setItem('TM',String(urmVal));
                    this.msgCount = cmVal
                    this.grantUpdateService.changeMessage(true);
                  },
                     error => {
                       const errorMsg = error as HttpErrorResponse;
                       const x = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-full-width','progressBar':true} as Partial<IndividualConfig>;
                       const y = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-right','progressBar':true} as Partial<IndividualConfig>;
                       const errorconfig: Partial<IndividualConfig> = x;
                       const config: Partial<IndividualConfig> = y;
                       if(errorMsg.error && errorMsg.error.message==='Token Expired'){
                       this.intervalSubscription.unsubscribe();
                        //this.toastr.error('Logging you out now...',"Your session has expired", errorconfig);
                        alert("Your session has timed out. Please sign in again.")
                        this.appComponent.logout();
                       } else {
                        this.toastr.error(errorMsg.error && errorMsg.error.message,"17 We encountered an error", config);
                       }


                     });
                  }
                  }
      );
  }

  ngAfterViewInit() {
      this.runOnRouteChange();
  }

  isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }

  showAllGrants(grant: Grant) {

    //this.subscription.unsubscribe();
    //this.dataService.changeMessage(0);
     this.appComponent.reportSaved = true;

    if(this.currentGrant !== null && this.currentGrant.name !== undefined){
      this.grantToUpdate = JSON.parse(JSON.stringify(this.currentGrant));
      this.grantToUpdate.id = this.currentGrantId;
      //this.grantComponent.saveGrant(this.currentGrant);
    }

    this.appComponent.currentView = 'grants';
    this.router.navigate(['grants/draft']);
  }

  showHistory(historyOf,what2Show){
    const dialogRef = this.dialog.open(GranthistoryComponent, {
      data: {type:historyOf,data:what2Show},
      panelClass: 'grant-notes-class',
      disableClose: false
      });
  }


  showWorkflowAssigments(){
    if(this.appComponent.currentView==='grant'){
        const wfModel = new WorkflowAssignmentModel();
        wfModel.users = this.appComponent.tenantUsers;
        wfModel.workflowStatuses = this.appComponent.grantWorkflowStatuses;
        wfModel.workflowAssignment = this.currentGrant.workflowAssignment;
        wfModel.type=this.appComponent.currentView;
        wfModel.grant = this.currentGrant;
        wfModel.canManage = this.appComponent.loggedInUser.organization.organizationType==='GRANTEE'?false:this.currentGrant.workflowAssignment.filter(wf => wf.stateId===this.currentGrant.grantStatus.id && wf.assignments===this.appComponent.loggedInUser.id).length>0 && this.appComponent.loggedInUser.organization.organizationType!=='GRANTEE'
        const dialogRef = this.dialog.open(WfassignmentComponent, {
            data: {model:wfModel,userId: this.appComponent.loggedInUser.id},
            panelClass: 'wf-assignment-class'
        });

        dialogRef.afterClosed().subscribe(result => {
        if (result.result) {
            const ass:WorkflowAssignment[] = [];
        for(let data of result.data){
            const wa = new WorkflowAssignment();
            wa.id=data.id;
            wa.stateId = data.stateId;
            wa.assignments = data.userId;
            wa.grantId = data.grantId;
            ass.push(wa);
        }

        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        let url = '/api/user/' + this.appComponent.loggedInUser.id + '/grant/'
        + this.currentGrant.id + '/assignment';
        this.http.post(url, {grant:this.currentGrant,assignments:ass}, httpOptions).subscribe((grant: Grant) => {
            this.grantData.changeMessage(grant,this.appComponent.loggedInUser.id);
            this.setDateDuration();
            this.currentGrant = grant;
        },error => {
                         const errorMsg = error as HttpErrorResponse;
                         const x = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-full-width','progressBar':true} as Partial<IndividualConfig>;
                         const y = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-right','progressBar':true} as Partial<IndividualConfig>;
                         const errorconfig: Partial<IndividualConfig> = x;
                         const config: Partial<IndividualConfig> = y;
                         if(errorMsg.error.message==='Token Expired'){
                          //this.toastr.error('Logging you out now...',"Your session has expired", errorconfig);
                          alert("Your session has timed out. Please sign in again.")
                          this.appComponent.logout();
                         } else {
                          this.toastr.error(errorMsg.error.message,"18 We encountered an error", config);
                         }


                    });
        } else {
            dialogRef.close();
        }
        });
    }else if(this.appComponent.currentView==='report'){
                  const wfModel = new ReportWorkflowAssignmentModel();
                  wfModel.users = this.appComponent.tenantUsers;
                  wfModel.granteeUsers = this.currentReport.granteeUsers;
                  wfModel.workflowStatuses = this.appComponent.reportWorkflowStatuses;
                  wfModel.workflowAssignments = this.currentReport.workflowAssignments;
                  wfModel.type=this.appComponent.currentView;
                  wfModel.report = this.currentReport;
                  wfModel.canManage = this.appComponent.loggedInUser.organization.organizationType==='GRANTEE'?false:this.currentReport.flowAuthorities && this.currentReport.canManage;
                  const dialogRef = this.dialog.open(WfassignmentComponent, {
                      data: {model:wfModel,userId: this.appComponent.loggedInUser.id},
                      panelClass: 'wf-assignment-class'
                  });

                  dialogRef.afterClosed().subscribe(result => {
                      if (result.result) {
                          const ass:ReportWorkflowAssignment[] = [];
                          for(let data of result.data){
                              const wa = new ReportWorkflowAssignment();
                              wa.id=data.id;
                              wa.stateId = data.stateId;
                              wa.assignmentId = data.userId;
                              wa.reportId = data.reportId;
                              wa.customAssignments = data.customAssignments;
                              ass.push(wa);
                          }

                          const httpOptions = {
                              headers: new HttpHeaders({
                              'Content-Type': 'application/json',
                              'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                              'Authorization': localStorage.getItem('AUTH_TOKEN')
                              })
                          };

                          let url = '/api/user/' + this.appComponent.loggedInUser.id + '/report/'
                          + this.currentReport.id + '/assignment';
                          this.http.post(url, {report:this.currentReport,assignments:ass}, httpOptions).subscribe((report: Report) => {
                              this.singleReportDataService.changeMessage(report);
                              this.currentReport = report;
                              this.setReportDateDuration();
                          },error => {
                                           const errorMsg = error as HttpErrorResponse;
                                           const x = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-full-width','progressBar':true} as Partial<IndividualConfig>;
                                           const y = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-right','progressBar':true} as Partial<IndividualConfig>;
                                           const errorconfig: Partial<IndividualConfig> = x;
                                           const config: Partial<IndividualConfig> = y;
                                           if(errorMsg.error.message==='Token Expired'){
                                            //this.toastr.error('Logging you out now...',"Your session has expired", errorconfig);
                                            alert("Your session has timed out. Please sign in again.")
                                            this.appComponent.logout();
                                           } else {
                                            this.toastr.error(errorMsg.error.message,"19 We encountered an error", config);
                                           }
                                      });
                      } else {
                          dialogRef.close();
                      }
                  });
    }
  }

  setDateDuration(){
    if(this.currentGrant.startDate && this.currentGrant.endDate){
        var time = new Date(this.currentGrant.endDate).getTime() - new Date(this.currentGrant.startDate).getTime();
        time = time + 86400001;
        this.currentGrant.duration = this.humanizer.humanize(time, { largest: 2, units: ['y', 'mo'], round: true});
      }else{
        this.currentGrant.duration = 'No end date';
      }
    }

    setReportDateDuration(){
        if(this.currentReport.startDate && this.currentReport.endDate){
            var time = new Date(this.currentReport.endDate).getTime() - new Date(this.currentReport.startDate).getTime();
            time = time + 86400001;
            this.currentReport.duration = this.humanizer.humanize(time, { largest: 2, units: ['y', 'mo'], round: true});
        }else{
            this.currentReport.duration = 'No end date';
        }
    }


    manageGrant(notification: Notifications, grantId: number) {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const url = '/api/user/' + this.appComponent.loggedInUser.id + '/grant/' + grantId;
        this.http.get(url,httpOptions).subscribe((grant:Grant) =>{
        let localgrant = this.appComponent.currentTenant.grants.filter(g => g.id=grantId)[0];
        if(localgrant){
        localgrant = grant;
        }else{
            this.appComponent.currentTenant.grants.push(grant);
        }
          this.grantData.changeMessage(grant,this.appComponent.loggedInUser.id);
          this.appComponent.originalGrant = JSON.parse(JSON.stringify(grant));;
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
          $("#messagepopover").css('display','none');
        });

    }

manageReport(notification: Notifications, reportId: number) {

    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
        })
    };

    const url = '/api/user/' + this.appComponent.loggedInUser.id + '/report/' + reportId;
    this.http.get(url,httpOptions).subscribe((report:Report) =>{

      this.singleReportDataService.changeMessage(report);
      this.appComponent.currentView = 'report';

        if(report.canManage && report.status.internalStatus!='CLOSED'){
            this.appComponent.action = 'report';
            this.router.navigate(['report/report-header']);
        } else{
            this.appComponent.action = 'report';
            this.router.navigate(['report/report-preview']);
        }

      $("#messagepopover").css('display','none');
    });

}

getHumanTime(notification): string{
    var time = new Date().getTime() - new Date(notification.postedOn).getTime();
    return this.humanizer.humanize(time, { largest: 1, round: true})
    }

closeMessagePopup(){
    $("#messagepopover").css('display','none');
}


showMessages(){
   let notifs: Notifications[] = [];
   localStorage.setItem('CM','0');
   for(let i=0; i<this.appComponent.notifications.length;i++){
    if(i<15){
        notifs.push(this.appComponent.notifications[i]);
    }
   }
  this.appComponent.notifications = notifs;
  const dialogRef = this.dialog.open(NotificationspopupComponent, {
           data: {notifs:this.appComponent.notifications,user:this.appComponent.loggedInUser},
           panelClass: 'notifications-class'
        });

        dialogRef.afterClosed().subscribe(result => {
                  if(!result){
                    return;
                  }
                  if (result.result) {
                    if(result.notificationFor==='GRANT'){
                        this.manageGrant(result.data,result.data.grantId);
                    }else if(result.notificationFor==='REPORT'){
                        this.manageReport(result.data,result.data.reportId);
                    }

                  }
                  });
  }


  showUpcomingReports(){
  this.appComponent.currentView = 'upcoming';
    this.router.navigate(['reports/upcoming']);
  }

  showProfile(){
    this.appComponent.currentView = 'user-profile';
    this.router.navigate(['user-profile']);
  }

  logout(){
    this.appComponent.logout();
  }

}
