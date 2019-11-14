import { Component, OnInit } from '@angular/core';
import {ReportDataService} from '../../report.data.service'
import {Report} from '../../model/report'
import {AppComponent} from '../../app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-upcoming-reports',
  templateUrl: './upcoming-reports.component.html',
  styleUrls: ['./upcoming-reports.component.scss']
})
export class UpcomingReportsComponent implements OnInit {
    reports: Report[];
    reportStartDate: Date;
    reportEndDate: Date;
    reportsToSetup: Report[];
    futureReportsToSetup: Report[];

    constructor(
        private reportService: ReportDataService,
        private http: HttpClient,
        private appComp: AppComponent){}

  ngOnInit() {
    this.reportService.currentMessage.subscribe(r => {
        this.reports = r;
     });

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
        this.reportsToSetup = this.reports.filter(a => (new Date(a.endDate).getTime() < reportStartDate.getTime() || (new Date(a.endDate).getTime() >= reportStartDate.getTime() && new Date(a.endDate).getTime()<=reportEndDate.getTime())) && (a.status.internalStatus!=='ACTIVE' && a.status.internalStatus!=='CLOSED'));
        this.futureReportsToSetup = this.reports.filter(a => new Date(a.endDate).getTime() > reportEndDate.getTime() && (a.status.internalStatus!=='ACTIVE' && a.status.internalStatus!=='CLOSED'));

        console.log(this.reportStartDate + "    " + this.reportEndDate);
    });
  }

}
