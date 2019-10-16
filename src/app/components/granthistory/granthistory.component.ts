import {Component, Inject, OnInit, ViewChild, ElementRef, Renderer2, HostListener} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {Grant, GrantHistory} from '../../model/dahsboard';
import {WorkflowTransition} from '../../model/workflow-transition';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

declare var $: any;
declare var jsPlumb: any;


@Component({
  selector: 'app-granthistory-dialog',
  templateUrl: './granthistory.component.html',
  styleUrls: ['./granthistory.component.scss']
})
export class GranthistoryComponent implements OnInit {

    history: GrantHistory[]=[];

  constructor(
    public dialogRef: MatDialogRef<GranthistoryComponent>
     , @Inject(MAT_DIALOG_DATA) public grant: Grant
     , private http: HttpClient
     , private renderer: Renderer2
     , @Inject(ElementRef)er: ElementRef
     ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
  const httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                  'Authorization': localStorage.getItem('AUTH_TOKEN')
              })
          };
          const url = '/api/user/' + JSON.parse(localStorage.getItem('USER')).id+ '/grant/'+this.grant.id+'/history/';

          this.http.get<GrantHistory[]>(url, httpOptions).subscribe((history: GrantHistory[]) => {
            this.history = history;
          });


  }

 onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(false);
  }
  ngAfterViewInit(){
    //this.showFlow(this.transitions);
  }

}
