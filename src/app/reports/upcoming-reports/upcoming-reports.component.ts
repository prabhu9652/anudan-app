import { Component, OnInit } from '@angular/core';
import {ReportDataService} from '../../report.data.service'
import {SingleReportDataService} from '../../single.report.data.service'
import {Report, ReportTemplate} from '../../model/report'
import {Grant} from '../../model/dahsboard';
import {AppComponent} from '../../app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ReportTemplateDialogComponent} from '../../components/report-template-dialog/report-template-dialog.component';
import {GrantSelectionDialogComponent} from '../../components/grant-selection-dialog/grant-selection-dialog.component';
import {AddnlreportsDialogComponent} from '../../components/addnlreports-dialog/addnlreports-dialog.component';
import {ReportComponent} from '../report/report.component'
@Component({
  selector: 'app-upcoming-reports',
  templateUrl: './upcoming-reports.component.html',
  styleUrls: ['./upcoming-reports.component.scss'],
  providers: [ReportComponent]
})
export class UpcomingReportsComponent implements OnInit {
    reports: Report[];
    reportStartDate: Date;
    reportEndDate: Date;
    reportsToSetup: Report[];
    reportsReadyToSubmit: Report[];
    addnlReports: Report[];
    futureReportsToSetup: Report[];
    subscribers: any = {};
    grants: Grant[] = [];

    constructor(
        private reportService: ReportDataService,
        private singleReportService: SingleReportDataService,
        private http: HttpClient,
        private router: Router,
        private appComp: AppComponent,
        private dialog: MatDialog,
        public reportComponent: ReportComponent){
        }

  ngOnInit() {
    this.reportService.currentMessage.subscribe(r => {
        this.reports = r;
     });

     if(!this.reports){
        this.getReports();
     }
  }

  getReports(){
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
        })};

    const user = JSON.parse(localStorage.getItem('USER'));
    const url = '/api/user/' + user.id + '/report/';
    this.http.get<Report[]>(url, httpOptions).subscribe((reports: Report[]) => {
        reports.sort((a,b) => a.endDate>b.endDate?1:-1);
        let reportStartDate = new Date();
        let reportEndDate = new Date();
        reportEndDate.setDate(reportEndDate.getDate()+this.appComp.appConfig.daysBeforePublishingReport);
        reportStartDate.setHours(0);
        reportStartDate.setMinutes(0);
        reportStartDate.setSeconds(0);
        reportEndDate.setHours(23);
        reportEndDate.setMinutes(59);
        reportEndDate.setSeconds(59);
        this.reportService.changeMessage(reports);
        this.reportsToSetup = this.reports.filter(a => (new Date(a.endDate).getTime() < reportStartDate.getTime() || (new Date(a.endDate).getTime() >= reportStartDate.getTime() && new Date(a.endDate).getTime()<=reportEndDate.getTime())) && (a.status.internalStatus!=='ACTIVE' && a.status.internalStatus!=='CLOSED' && a.status.internalStatus!=='REVIEW'));

        for(let i=0; i< this.reports.length;i++){
            if(this.grants.filter(g => g.id===this.reports[i].grant.id).length===0 ){
                this.grants.push(this.reports[i].grant);
            }
        }
        this.reportsReadyToSubmit = this.reports.filter(a => (new Date(a.endDate).getTime() < reportStartDate.getTime() || (new Date(a.endDate).getTime() >= reportStartDate.getTime() && new Date(a.endDate).getTime()<=reportEndDate.getTime())) && (a.status.internalStatus==='ACTIVE'));
        this.futureReportsToSetup = this.reports.filter(a => new Date(a.endDate).getTime() > reportEndDate.getTime() && (a.status.internalStatus!=='ACTIVE' && a.status.internalStatus!=='CLOSED' && a.status.internalStatus!=='REVIEW'));

        if(this.reportsToSetup && this.reportsToSetup.length>0){
            for(let i=0; i<this.reportsToSetup.length; i++){
                const linkedReports = this.futureReportsToSetup.filter(r => r.grant.id===this.reportsToSetup[i].grant.id);
                if(linkedReports && linkedReports.length>0){
                    this.reportsToSetup[i].linkedReports = linkedReports.length;
                }
            }
        }
        console.log(this.reportStartDate + "    " + this.reportEndDate);
    });
  }

  manageReport(report:Report){
    this.appComp.currentView = 'report';
    this.singleReportService.changeMessage(report);
    if(report.canManage && report.status.internalStatus!='CLOSED'){
        this.router.navigate(['report/report-header']);
    } else{
        this.appComp.action = 'report';
        this.router.navigate(['report/report-preview']);
    }
  }

    selectReportTemplate(){

        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const user = JSON.parse(localStorage.getItem('USER'));
        let url = '/api/user/' + user.id + '/report/templates';
        this.http.get<ReportTemplate[]>(url, httpOptions).subscribe((templates: ReportTemplate[]) => {
                let dialogRef = this.dialog.open(ReportTemplateDialogComponent, {
                data: templates,
                panelClass: 'grant-template-class'
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result.result) {
                    const template = result.selectedTemplate;

                    url = '/api/user/' + user.id + '/grant/active';
                    this.http.get<Grant[]>(url,httpOptions).subscribe((activeGrants:Grant[]) => {
                        let dialogRef1 = this.dialog.open(GrantSelectionDialogComponent, {
                            data: activeGrants,
                            panelClass: 'grant-template-class'
                        });

                        dialogRef1.afterClosed().subscribe(result => {
                            if(result.result){
                                this.reportComponent.createReport(template,result.selectedGrant);
                                this.appComp.selectedReportTemplate = result.selectedTemplate;
                            }
                        });
                    });




                } else {
                    dialogRef.close();
                }
            });
        });
    }

    viewAddnlReports(grantId: number){
        let dialogRef1 = this.dialog.open(AddnlreportsDialogComponent, {
            data: {grant:grantId,grants:this.grants,futureReports:this.futureReportsToSetup},
            panelClass: 'wf-assignment-class'
        });

        dialogRef1.afterClosed().subscribe(result => {
            if(result.result){
                console.log('done');
            }
        });
    }

}
