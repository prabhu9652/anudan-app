import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {SingleReportDataService} from '../../../single.report.data.service'
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import {Report,ReportSectionInfo,ReportWorkflowAssignmentModel,ReportWorkflowAssignment} from '../../../model/report'
import {ReportNotesComponent} from '../../../components/reportNotes/reportNotes.component';
import {MatDialog} from '@angular/material';
import {Section,WorkflowStatus} from '../../../model/dahsboard';
import {Configuration} from '../../../model/app-config';
import {User} from '../../../model/user';
import {FieldDialogComponent} from '../../../components/field-dialog/field-dialog.component';
import {AppComponent} from '../../../app.component';
import {TemplateDialogComponent} from '../../../components/template-dialog/template-dialog.component';
import {WfassignmentComponent} from '../../../components/wfassignment/wfassignment.component';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ToastrService,IndividualConfig} from 'ngx-toastr';
import {ActivatedRoute, Router, NavigationStart,NavigationEnd, ActivationEnd,RouterEvent} from '@angular/router';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export'
import { PDFMarginComponent } from '@progress/kendo-angular-pdf-export'
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {AdminLayoutComponent} from '../../../layouts/admin-layout/admin-layout.component'
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss'],
  providers: [PDFExportComponent, SidebarComponent],
  styles:[`
    ::ng-deep .wf-assignment-class .mat-dialog-container{
        overflow: hidden !important;
    }
  `]
})
export class ReportPreviewComponent implements OnInit {

    currentReport: Report;
    originalReport: Report;
    langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
    humanizer: HumanizeDuration = new HumanizeDuration(this.langService);
    logoUrl: string;
    reportWorkflowStatuses:WorkflowStatus[];
    tenantUsers: User[]

    @ViewChild('pdf') pdf;
    @ViewChild('createSectionModal') createSectionModal: ElementRef;

    constructor(private singleReportDataService: SingleReportDataService,
        private dialog: MatDialog,
        public appComp: AppComponent,
        private http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        public adminComp: AdminLayoutComponent,
        private sidebar: SidebarComponent
        ) {

        this.singleReportDataService.currentMessage.subscribe((report) => {
            this.currentReport = report;
            this.setDateDuration();
            console.log(this.currentReport);
        });
         const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };
        let url = '/api/app/config/report/'+this.currentReport.id;

        this.http.get(url,httpOptions).subscribe((config:Configuration) =>{
            this.reportWorkflowStatuses = config.reportWorkflowStatuses;
            this.appComp.reportWorkflowStatuses = config.reportWorkflowStatuses;
            this.tenantUsers = config.tenantUsers;
            this.appComp.tenantUsers = config.tenantUsers;
            this.appComp.reportTransitions=config.reportTransitions;
        });
}



    ngOnInit() {

        this.originalReport = JSON.parse(JSON.stringify(this.currentReport));

        const tenantCode = localStorage.getItem('X-TENANT-CODE');
        this.logoUrl = "/api/public/images/"+tenantCode+"/logo";

        this.appComp.createNewReportSection.subscribe((val) =>{
            if(val){
                $('.modal-backdrop').remove();

                this.addNewSection();
                this.appComp.createNewReportSection.next(false);
            }
        });
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
            const status1 = this.reportWorkflowStatuses.filter((status) => status.id===assignment.stateId);
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

        const statusTransition = this.appComp.reportTransitions.filter((transition) => transition.fromStateId===this.currentReport.status.id && transition.toStateId===toStateId);

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
         wfModel.users = this.tenantUsers;
         wfModel.granteeUsers = this.currentReport.granteeUsers;
          wfModel.workflowStatuses = this.reportWorkflowStatuses;
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
                      wa.customAssignments = data.customAssignments;
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

    saveAs(filename){
        this.pdf.saveAs(filename);
    }

    saveSection() {
        const sectionName = $('#sectionTitleInput');
        if (sectionName.val().trim() === '') {
            this.toastr.warning('Section name cannot be left blank', 'Warning');
            sectionName.focus();
            return;
        }

        const createSectionModal = this.createSectionModal.nativeElement;

        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const url = '/api/user/' + this.appComp.loggedInUser.id + '/report/' + this.currentReport.id + '/template/'+this.currentReport.template.id+'/section/'+sectionName.val();

        this.http.post<ReportSectionInfo>(url,this.currentReport, httpOptions).subscribe((info: ReportSectionInfo) => {
            this.singleReportDataService.changeMessage(info.report);

            sectionName.val('');
            //$('#section_' + newSection.id).css('display', 'block');
            $(createSectionModal).modal('hide');
            this.appComp.sectionAdded = true;
            this.sidebar.buildSectionsSideNav(null);
            this.appComp.sectionInModification = false;
            //  this.appComp.selectedTemplate = info.report.template;
            this.router.navigate(['report/section/' + this.getCleanText(info.report.reportDetails.sections.filter((a) => a.id===info.sectionId)[0])]);
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

    addNewSection() {
        this.appComp.sectionInModification = true;
        const createSectionModal = this.createSectionModal.nativeElement;
        const titleElem = $(createSectionModal).find('#createSectionLabel');
        $(titleElem).html('Add new section');
        $(createSectionModal).modal('show');
    }

    getCleanText(section:Section): string{
        if(section.sectionName === ''){
            return String(section.id);
        }
        return section.sectionName.replace(/[^_0-9a-z]/gi, '');
    }

    showHistory(type,obj){
        this.adminComp.showHistory(type,obj);
    }

    showWFAssigments(){
        this.adminComp.showWorkflowAssigments();
    }

    getDocumentName(val: string): any[] {
        let obj;
        if(val!==undefined && val!==""){
            obj = JSON.parse(val);
        }
        return obj;
    }

    downloadAttachment(reportId:number,fileId:number, docName:string,docType:string){

        const httpOptions = {
            responseType: 'blob' as 'json',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        let url = '/api/user/' + this.appComp.loggedInUser.id + '/report/'
                        + reportId + '/file/'+fileId;

        this.http.get(url,httpOptions).subscribe((data) =>{
            saveAs(data,docName+"."+docType);
        });

    }
}
