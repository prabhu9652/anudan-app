import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {WorkflowAssignmentModel} from '../../model/dahsboard';

declare var $: any;


@Component({
  selector: 'app-wfassignment-dialog',
  templateUrl: './wfassignment.component.html',
  styleUrls: ['./wfassignment.component.scss']
})
export class WfassignmentComponent implements OnInit {

    assignmentData: any;

  constructor(public dialogRef: MatDialogRef<WfassignmentComponent>
      , @Inject(MAT_DIALOG_DATA) public message: WorkflowAssignmentModel) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
  //console.log(message);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    const assignmentElems = $('[id^="assignment_"]');
    const assignMentResult=[];
     for(let i=0; i< assignmentElems.length;i++){
         assignMentResult.push({'id':$(assignmentElems[i]).attr('id').split('_')[1],'userId':$(assignmentElems[i]).val()});
     }
    this.dialogRef.close({'result':true,data:assignMentResult});
  }

  getRoles(user): string{
    return ' [' + user.userRoles.map(ur => ur.role.name).join(', ') + ']';
  }
}
