import { Component, OnInit } from '@angular/core';
import {SingleReportDataService} from '../../../single.report.data.service'
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import {Report,ReportSectionInfo,ReportWorkflowAssignmentModel,ReportWorkflowAssignment} from '../../../model/report'
import {ReportNotesComponent} from '../../../components/reportNotes/reportNotes.component';
import {MatDialog} from '@angular/material';
import {FieldDialogComponent} from '../../../components/field-dialog/field-dialog.component';
import {AppComponent} from '../../../app.component';
import {TemplateDialogComponent} from '../../../components/template-dialog/template-dialog.component';
import {WfassignmentComponent} from '../../../components/wfassignment/wfassignment.component';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ToastrService,IndividualConfig} from 'ngx-toastr';
import {ActivatedRoute, Router, NavigationStart,NavigationEnd, ActivationEnd,RouterEvent} from '@angular/router';

@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss']
})
export class ReportPreviewComponent implements OnInit {

    currentReport: Report;
    originalReport: Report;
    langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
    humanizer: HumanizeDuration = new HumanizeDuration(this.langService);
    logoUrl: string;

    constructor(private singleReportDataService: SingleReportDataService,
        private dialog: MatDialog,
        private appComp: AppComponent,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router
        ) { }

    ngOnInit() {

        this.singleReportDataService.currentMessage.subscribe((report) => {
            this.currentReport = report;
            this.setDateDuration();
            console.log(this.currentReport);
        });
        this.originalReport = JSON.parse(JSON.stringify(this.currentReport));

        const tenantCode = localStorage.getItem('X-TENANT-CODE');
          this.logoUrl = "/api/public/images/"+tenantCode+"/logo";
    }

    setDateDuration(){
        if(this.currentReport.startDate && this.currentReport.endDate){
            var time = new Date(this.currentReport.endDate).getTime() - new Date(this.currentReport.startDate).getTime();
            time = time + 86400001;
            this.currentReport.duration = this.humanizer.humanize(time, { largest: 2, units: ['y', 'mo'], round: true});
        }else{
            this.currentReport.duration = 'No end date';
        }
    }

    submitReport(toStateId: number) {

        for(let assignment of this.currentReport.workflowAssignments){
            const status1 = this.appComp.appConfig.reportWorkflowStatuses.filter((status) => status.id===assignment.stateId);
            if(assignment.assignmentId === null || assignment.assignmentId === undefined || assignment.assignmentId === 0 && !status1[0].terminal){
                const dialogRef = this.dialog.open(FieldDialogComponent, {
                    data: "Would you like to carry out workflow assignments?"
                });
                dialogRef.afterClosed().subscribe(result => {
                    if(result){
                        this.showWorkflowAssigments(toStateId);
                    }
                });
                return;
            }
        }

        const statusTransition = this.appComp.appConfig.reportTransitions.filter((transition) => transition.fromStateId===this.currentReport.status.id && transition.toStateId===toStateId);

        if(statusTransition && statusTransition[0].noteRequired){
            this.openBottomSheetForReportNotes(toStateId);
            return;
        }
    }

    openBottomSheetForReportNotes(toStateId: number): void {

        const _bSheet = this.dialog.open(ReportNotesComponent, {
          hasBackdrop: false,
          data: {canManage:true,currentReport: this.currentReport, originalReport: this.appComp.originalReport},
          panelClass: 'grant-notes-class'
        });

        _bSheet.afterClosed().subscribe(result => {
          if(result.result){
            this.submitAndSaveReport(toStateId,result.message);
          }
        });
      }

    showWorkflowAssigments(toStateId){
        const wfModel = new ReportWorkflowAssignmentModel();
         wfModel.users = this.appComp.appConfig.tenantUsers;
         wfModel.granteeUsers = this.currentReport.granteeUsers;
          wfModel.workflowStatuses = this.appComp.appConfig.reportWorkflowStatuses;
          wfModel.workflowAssignments = this.currentReport.workflowAssignments;
          wfModel.type=this.appComp.currentView;
          wfModel.report = this.currentReport;
          wfModel.canManage = this.currentReport.flowAuthorities && this.currentReport.canManage;
          const dialogRef = this.dialog.open(WfassignmentComponent, {
              data: {model:wfModel,userId: this.appComp.loggedInUser.id},
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
                      ass.push(wa);
                  }

                  const httpOptions = {
                      headers: new HttpHeaders({
                      'Content-Type': 'application/json',
                      'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                      'Authorization': localStorage.getItem('AUTH_TOKEN')
                      })
                  };

                  let url = '/api/user/' + this.appComp.loggedInUser.id + '/report/'
                  + this.currentReport.id + '/assignment';
                  this.http.post(url, {report:this.currentReport,assignments:ass}, httpOptions).subscribe((report: Report) => {
                      this.singleReportDataService.changeMessage(report);
                      this.currentReport = report;
                      this.submitReport(toStateId);
                  },error => {
                                   const errorMsg = error as HttpErrorResponse;
                                   const x = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-full-width','progressBar':true} as Partial<IndividualConfig>;
                                   const y = {'enableHtml': true,'preventDuplicates': true,'positionClass':'toast-top-right','progressBar':true} as Partial<IndividualConfig>;
                                   const errorconfig: Partial<IndividualConfig> = x;
                                   const config: Partial<IndividualConfig> = y;
                                   if(errorMsg.error.message==='Token Expired'){
                                    //this.toastr.error('Logging you out now...',"Your session has expired", errorconfig);
                                    alert("Your session has timed out. Please sign in again.")
                                    this.appComp.logout();
                                   } else {
                                    this.toastr.error(errorMsg.error.message,"We encountered an error", config);
                                   }
                              });
              } else {
                  dialogRef.close();
              }
          });
    }

    submitAndSaveReport(toStateId:number, message:String){

        if(!message){
            message='';
        }
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const origStatus = this.currentReport.status.name;
        let url = '/api/user/' + this.appComp.loggedInUser.id + '/report/'
        + this.currentReport.id + '/flow/'
        + this.currentReport.status.id + '/' + toStateId;
        this.http.post(url, {grant: this.currentReport,note:message}, httpOptions).subscribe((report: Report) => {

            this.singleReportDataService.changeMessage(report);

            if(!report.template.published){
                const dialogRef = this.dialog.open(TemplateDialogComponent, {
                data: this.currentReport.template.name,
                panelClass: 'grant-notes-class'
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result.result) {
                    let url = '/api/user/' + this.appComp.loggedInUser.id + '/report/'+this.currentReport.id+'/template/'+this.currentReport.template.id+'/'+result.name;
                    this.http.put(url, {description:result.desc,publish:true,privateToGrant:false}, httpOptions).subscribe((report: Report) => {
                        this.singleReportDataService.changeMessage(report);
                        //this.appComp.selectedTemplate = grant.grantTemplate;
                        this.fetchCurrentReport();
                    });

                } else {
                    let url = '/api/user/' + this.appComp.loggedInUser.id + '/report/'+this.currentReport.id+'/template/'+this.currentReport.template.id+'/'+result.name;
                    this.http.put(url, {description:result.desc,publish:true,privateToGrant:true}, httpOptions).subscribe((report: Report) => {
                    this.singleReportDataService.changeMessage(report);
                        //this.appComp.selectedTemplate = grant.grantTemplate;
                        dialogRef.close();
                        this.fetchCurrentReport();
                    });

                }
            });
            }else{
                this.fetchCurrentReport();
            }

            },error => {
            const errorMsg = error as HttpErrorResponse;
            console.log(error);
            const x = {'enableHtml': true,'preventDuplicates': true} as Partial<IndividualConfig>;
            const config: Partial<IndividualConfig> = x;
            if(errorMsg.error.message==='Token Expired'){
                this.toastr.error("Your session has expired", 'Logging you out now...', config);
            setTimeout( () => { this.appComp.logout(); }, 4000 );
            } else {
                this.toastr.error(errorMsg.error.message,"We encountered an error", config);
            }
        });
      }


    fetchCurrentReport(){

        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const url = '/api/user/' + this.appComp.loggedInUser.id + '/report/' + this.currentReport.id;
        this.http.get(url, httpOptions).subscribe((updatedReport: Report) => {
            this.singleReportDataService.changeMessage(updatedReport);
            this.currentReport = updatedReport;

            if(this.currentReport.workflowAssignments.filter((a) => a.assignmentId===this.appComp.loggedInUser.id && a.anchor).length===0){
                this.appComp.currentView = 'upcoming';
                this.router.navigate(['reports/upcoming']);
            }
        });
    }
}
