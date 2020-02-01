import { Component, OnInit } from '@angular/core';
import {ReportDataService} from '../../report.data.service'
import {SingleReportDataService} from '../../single.report.data.service'
import {Report} from '../../model/report'
import {AppComponent} from '../../app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-approved-reports',
  templateUrl: './approved-reports.component.html',
  styleUrls: ['./approved-reports.component.scss']
})
export class ApprovedReportsComponent implements OnInit {
    reports: Report[];
    approvedReports: Report[];
    subscribers: any = {};

    constructor(
        private reportService: ReportDataService,
        private singleReportService: SingleReportDataService,
        private http: HttpClient,
        private router: Router,
        private appComp: AppComponent,
        private spinner: NgxSpinnerService){
        }

  ngOnInit() {
    this.reportService.currentMessage.subscribe(r => {
        this.reports = r;
     });

     this.spinner.show();

     this.getReports();
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
        this.reportService.changeMessage(reports);
        this.approvedReports = this.reports.filter(a => a.status.internalStatus=='CLOSED');

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
}
