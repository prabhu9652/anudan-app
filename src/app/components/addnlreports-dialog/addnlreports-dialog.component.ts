import { UpdateService } from './../../update.service';
import { AppComponent } from 'app/app.component';
import { ReportDataService } from './../../report.data.service';
import { FieldDialogComponent } from './../field-dialog/field-dialog.component';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule } from '@angular/material';
import { Report, AdditionReportsModel } from '../../model/report';
import { Grant } from '../../model/dahsboard';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { CurrencyService } from 'app/currency-service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-addnlreports-dialog',
  templateUrl: './addnlreports-dialog.component.html',
  styleUrls: ['./addnlreports-dialog.component.scss'],
  providers: [AppComponent, UpdateService]
})
export class AddnlreportsDialogComponent implements OnInit {

  grantId: number;
  reportId: number;
  grants: Grant[];
  futureReports: Report[];
  selectedReports: Report[];
  singleGrant: boolean;
  deletedReports: Report[] = [];
  type: string;
  data: AdditionReportsModel
  appComp: AppComponent

  constructor(private dialog: MatDialog, private reportService: ReportDataService, public dialogRef: MatDialogRef<AddnlreportsDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public reportsMetaData: any
    , private http: HttpClient, private currenyService: CurrencyService) {
    this.data = reportsMetaData.data;
    this.appComp = reportsMetaData.appComp;
    this.dialogRef.disableClose = false;
    this.grantId = reportsMetaData.data.grant;
    this.reportId = reportsMetaData.data.report;
    this.grants = reportsMetaData.data.grants;
    this.futureReports = reportsMetaData.data.futureReports;
    this.singleGrant = reportsMetaData.data.single;
    this.type = reportsMetaData.data.type;

    //this.selectedReports = this.futureReports.filter(r => r.grant.id===this.grantId);
  }

  ngOnInit() {
    if (!this.futureReports) {
      this.getReportsForSelectedGrant(this.reportId, this.grantId, this.type);
    } else {
      this.selectedReports = this.futureReports;
    }
  }


  onNoClick(): void {
    this.dialogRef.close({ result: false, deleted: this.deletedReports });
  }

  onYesClick(): void {
    this.dialogRef.close({ result: false });
  }

  updateSelectedReports(evt) {
    this.selectedReports = null;
    this.getReportsForSelectedGrant(this.reportId, evt, 'upcoming')
  }

  manageReport(report: Report) {
    this.dialogRef.close({ result: true, selectedReport: report });
  }

  getReportsForSelectedGrant(reportId: number, grantId: number, type: string) {

    const queryParams = new HttpParams().set('type', type);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      }),
      params: queryParams
    };


    const user = JSON.parse(localStorage.getItem('USER'));
    const url = '/api/user/' + user.id + '/report/' + reportId + '/' + grantId;

    this.http.get(url, httpOptions).subscribe((reports: Report[]) => {
      reports.sort((a, b) => a.endDate > b.endDate ? 1 : -1)
      this.selectedReports = reports;
    });
  }

  getFormattedGrantAmount(amount: number) {
    let amtInWords = '-';
    if (amount) {
      amtInWords = this.currenyService.getFormattedAmount(amount);
    }
    return amtInWords;
  }

  getGrantAmountInWords(amount: number) {
    let amtInWords = '-';
    if (amount) {
      amtInWords = this.currenyService.getAmountInWords(amount);
    }
    return amtInWords;
  }

  deleteReport(report: Report) {
    //this.deleteReportsClicked = true;
    const dialogRef = this.dialog.open(FieldDialogComponent, {
      data: { title: 'Are you sure you want to delete this report?', btnMain: "Delete Report", btnSecondary: "Not Now" },
      panelClass: 'center-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reportService.deleteReport(report)
          .then(() => {
            this.deletedReports.push(report);
            const index = this.selectedReports.findIndex(r => r.id === report.id);
            this.selectedReports.splice(index, 1);
            //this.deleteReportsClicked = false;
          })
      } else {
        //this.deleteReportsClicked = false;
        dialogRef.close();
      }
    });
  }

  public getGrantTypeName(typeId): string {
    return this.appComp.grantTypes.filter(t => t.id === typeId)[0].name;
  }

  public getGrantTypeColor(typeId): any {
    return this.appComp.grantTypes.filter(t => t.id === typeId)[0].colorCode;
  }

  isExternalGrant(grant: Grant): boolean {
    const grantType = this.appComp.grantTypes.filter(gt => gt.id === grant.grantTypeId)[0];
    if (!grantType.internal) {
      return true;
    } else {
      return false;
    }
  }
}
