import { Component, OnInit } from '@angular/core';
import {ReportDataService} from '../../report.data.service'
import {SingleReportDataService} from '../../single.report.data.service'
import {Report} from '../../model/report'
import {AppComponent} from '../../app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders,HttpParams} from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import {TitleCasePipe} from '@angular/common';
import * as indianCurrencyInWords from 'indian-currency-in-words';
import * as inf from 'indian-number-format';


@Component({
  selector: 'app-approved-reports',
  templateUrl: './approved-reports.component.html',
  styleUrls: ['./approved-reports.component.scss'],
                                                    providers: [TitleCasePipe]
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
        private spinner: NgxSpinnerService,
        private titlecasePipe: TitleCasePipe){
        }

  ngOnInit() {
    this.appComp.subMenu = {name:'Approved Reports',action:'ar'};
    this.reportService.currentMessage.subscribe(r => {
        this.reports = r;
     });

     this.spinner.show();

     this.getReports();
  }

  getReports(){
    const queryParams = new HttpParams().set('q', 'approved');
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
        }),
        params: queryParams
        };

    const user = JSON.parse(localStorage.getItem('USER'));
    const url = '/api/user/' + user.id + '/report/';
    this.http.get<Report[]>(url, httpOptions).subscribe((reports: Report[]) => {
        //reports.sort((a,b) => a.endDate>b.endDate?1:-1);
        this.reportService.changeMessage(reports);
        this.approvedReports = reports

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

    getGrantAmountInWords(amount:number){
        let amtInWords = '-';
        if(amount){
            amtInWords = indianCurrencyInWords(amount).replace("Rupees","").replace("Paisa","");
            return 'Rs. ' + this.titlecasePipe.transform(amtInWords);
        }
        return amtInWords;
    }

    getFormattedGrantAmount(amount: number):string{
        return inf.format(amount,2);
    }
}
