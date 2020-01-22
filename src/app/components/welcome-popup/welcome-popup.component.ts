import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
@Component({
  selector: 'app-welcome-popup',
  templateUrl: './welcome-popup.component.html',
  styleUrls: ['./welcome-popup.component.scss']
})
export class WelcomePopupComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<WelcomePopupComponent>
      , @Inject(MAT_DIALOG_DATA) public userName: string) {
    this.dialogRef.disableClose = true;

  }

  ngOnInit() {
  }

  navigateToOrg(){
    this.dialogRef.close(false);
  }

  navigate(){
    this.dialogRef.close(true);
  }

  onNoClick(): void {

  }

  onYesClick(): void {

  }
}
