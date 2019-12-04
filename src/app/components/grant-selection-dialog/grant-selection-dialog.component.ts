import {Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Grant} from '../../model/dahsboard';

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';

@Component({
  selector: 'app-grant-selection-dialog',
  templateUrl: './grant-selection-dialog.component.html',
  styleUrls: ['./grant-selection-dialog.component.scss']
})

export class GrantSelectionDialogComponent implements OnInit {

  @ViewChild('templateHolder') templateHolder: ElementRef;
  selected: number;

  constructor(public dialogRef: MatDialogRef<GrantSelectionDialogComponent>
      , @Inject(MAT_DIALOG_DATA) public grants: Grant[]) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.selected = this.grants[0].id;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
  let selectedGrant;
    for(let grant of this.grants){
        if(grant.id === Number(this.selected)){
            selectedGrant = grant;
            break;
        }
    }
    this.dialogRef.close({result:true,selectedGrant:selectedGrant});
  }

  showDesc(){
    console.log('here');
  }

  setSelectedGrant(id,ev: Event){
    this.selected = id;
  }
}
