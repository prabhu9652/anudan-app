import {Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {Report,AdditionReportsModel} from '../../model/report';
import {Grant} from '../../model/dahsboard';
import {HttpClient, HttpErrorResponse, HttpHeaders,HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-addnlreports-dialog',
  templateUrl: './addnlreports-dialog.component.html',
  styleUrls: ['./addnlreports-dialog.component.scss']
})
export class AddnlreportsDialogComponent implements OnInit {

    grantId:number;
    reportId: number;
    grants: Grant[];
    futureReports: Report[];
    selectedReports: Report[];


  constructor(public dialogRef: MatDialogRef<AddnlreportsDialogComponent>
      , @Inject(MAT_DIALOG_DATA) public data: AdditionReportsModel
      ,private http: HttpClient) {
    this.dialogRef.disableClose = false;
    this.grantId = data.grant;
    this.reportId = data.report;
    this.grants = data.grants;
    this.futureReports = data.futureReports;
    //this.selectedReports = this.futureReports.filter(r => r.grant.id===this.grantId);
  }

  ngOnInit() {
    this.getReportsForSelectedGrant(this.reportId,this.grantId);
  }


  onNoClick(): void {
    this.dialogRef.close({result:false});
  }

  onYesClick(): void {
    this.dialogRef.close({result:false});
  }

  updateSelectedReports(evt){
  this.selectedReports = null;
    this.getReportsForSelectedGrant(this.reportId,evt)
  }

  manageReport(report: Report){
    this.dialogRef.close({result:true, selectedReport: report});
  }

  getReportsForSelectedGrant(reportId:number,grantId:number){
    const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
    })};


    const user = JSON.parse(localStorage.getItem('USER'));
    const url = '/api/user/' + user.id + '/report/'+reportId+'/'+grantId;

    this.http.get(url,httpOptions).subscribe((reports: Report[]) => {
        reports.sort((a,b) => a.endDate>b.endDate?1:-1)
        this.selectedReports = reports;
    });
  }
}
