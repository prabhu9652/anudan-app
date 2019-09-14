import {Component, Inject, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {WorkflowAssignmentModel} from '../../model/dahsboard';
import {WorkflowTransition} from '../../model/workflow-transition';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';


declare var $: any;


@Component({
  selector: 'app-wfassignment-dialog',
  templateUrl: './wfassignment.component.html',
  styleUrls: ['./wfassignment.component.scss']
})
export class WfassignmentComponent implements OnInit {

    assignmentData: any;
    transitions: WorkflowTransition[];
    elemRef: ElementRef;

    @ViewChild("flowContainer") flowContainer: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<WfassignmentComponent>
     , @Inject(MAT_DIALOG_DATA) public message: WorkflowAssignmentModel
     , private http: HttpClient
     , private renderer: Renderer2
     , @Inject(ElementRef)er: ElementRef
     ) {
    this.dialogRef.disableClose = true;
    this.elemRef = er;
  }

  ngOnInit() {
  const httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                  'Authorization': localStorage.getItem('AUTH_TOKEN')
              })
          };
          const url = '/api/admin/workflow/grant';

          this.http.get<WorkflowTransition[]>(url, httpOptions).subscribe((transitions: WorkflowTransition[]) => {
          this.transitions = transitions;

          });
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
