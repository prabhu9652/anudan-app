import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule } from '@angular/material';

@Component({
  selector: 'owners-popup-dialog',
  templateUrl: './owners-popup.component.html',
  styleUrls: ['./owners-popup.component.scss']
})
export class OwnersPopupComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<OwnersPopupComponent>
    , @Inject(MAT_DIALOG_DATA) public message: any) {
    this.dialogRef.disableClose = false;
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
