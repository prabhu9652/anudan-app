import {Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {Report,AdditionReportsModel} from '../../model/report';
import {Grant} from '../../model/dahsboard';
@Component({
  selector: 'app-addnlreports-dialog',
  templateUrl: './addnlreports-dialog.component.html',
  styleUrls: ['./addnlreports-dialog.component.scss']
})
export class AddnlreportsDialogComponent implements OnInit {

    grantId:number;
    grants: Grant[];
    futureReports: Report[];
    selectedReports: Report[];


  constructor(public dialogRef: MatDialogRef<AddnlreportsDialogComponent>
      , @Inject(MAT_DIALOG_DATA) public data: AdditionReportsModel) {
    this.dialogRef.disableClose = true;
    this.grantId = data.grant;
    this.grants = data.grants;
    this.futureReports = data.futureReports;
    this.selectedReports = this.futureReports.filter(r => r.grant.id===this.grantId);
  }

  ngOnInit() {

  }


  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

  updateSelectedReports(evt){
    console.log();
    this.selectedReports = this.futureReports.filter(r => r.grant.id===Number(evt.currentTarget.value));
  }
}
