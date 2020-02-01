import { Component, OnInit } from '@angular/core';
import {Report,ReportTemplate} from '../../model/report'
import {Grant} from '../../model/dahsboard'
import {HttpClient, HttpErrorResponse, HttpHeaders,HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {SingleReportDataService} from '../../single.report.data.service'
import {Router} from '@angular/router';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  currentReport: Report;

  constructor(
        private http: HttpClient,
        public appCom: AppComponent,
        private appComp:AppComponent,
        private singleReportService: SingleReportDataService,
        private router: Router) { }

  ngOnInit() {

  }

  createReport(template: ReportTemplate, grant:Grant){
            this.appComp.selectedTemplate = template;
            this.appComp.currentView = 'grant';

            const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const url = '/api/user/' + this.appComp.loggedInUser.id + '/report/create/grant/'+ grant.id + '/template/' + template.id;

        this.http.get<Report>(url, httpOptions).subscribe((report: Report) => {

            this.currentReport = report;
            this.singleReportService.changeMessage(report);
            this.appComp.currentView = 'report';

            this.router.navigate(['report/report-header']);
        });
  }

}
