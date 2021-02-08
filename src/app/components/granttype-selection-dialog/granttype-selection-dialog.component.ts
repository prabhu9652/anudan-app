import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Grant, GrantType } from '../../model/dahsboard';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule } from '@angular/material';

@Component({
  selector: 'app-granttype-selection-dialog',
  templateUrl: './granttype-selection-dialog.component.html',
  styleUrls: ['./granttype-selection-dialog.component.scss']
})

export class GranttypeSelectionDialogComponent implements OnInit {

  @ViewChild('templateHolder') templateHolder: ElementRef;
  selected: number = 0;
  selectedGrantType: GrantType;
  grantTypes1: any[];

  constructor(public dialogRef: MatDialogRef<GranttypeSelectionDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public grantTypes: GrantType[]) {
    this.dialogRef.disableClose = true;

  }

  ngOnInit() {
    this.grantTypes1 = this.grantTypes;
    //this.selected = this.grantTypes1[0].id;
    //this.selectedGrantType = this.grantTypes1[0];
    //this.selectedGrant = this.grants[0];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    let selectedGrantType;
    for (let grant of this.grantTypes1) {
      if (grant.id === Number(this.selected)) {
        selectedGrantType = grant;
        break;
      }
    }
    this.dialogRef.close({ result: true, selectedGrantType: selectedGrantType });
  }

  showDesc() {
    console.log('here');
  }

  setSelectedGrant(id, ev: MatCheckboxChange) {
    if (ev.checked) {
      this.selected = id;
      this.selectedGrantType = this.grantTypes1.filter(g => g.id === id)[0];
    } else {
      this.selected = 0;
      this.selectedGrantType = null;
    }

  }
}
