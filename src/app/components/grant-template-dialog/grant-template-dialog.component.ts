import {Component, Inject, OnInit} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';

@Component({
  selector: 'app-grant-template-dialog',
  templateUrl: './grant-template-dialog.component.html',
  styleUrls: ['./grant-template-dialog.component.scss']
})
export class GrantTemplateDialogComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<GrantTemplateDialogComponent>
      , @Inject(MAT_DIALOG_DATA) public message: string) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
