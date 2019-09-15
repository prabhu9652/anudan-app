import {Component, Inject, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {WorkflowAssignmentModel} from '../../model/dahsboard';
import {WorkflowTransition} from '../../model/workflow-transition';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';


declare var $: any;
declare var jsPlumb: any;


@Component({
  selector: 'app-wfassignment-dialog',
  templateUrl: './wfassignment.component.html',
  styleUrls: ['./wfassignment.component.scss']
})
export class WfassignmentComponent implements OnInit {

    assignmentData: any;
    transitions: WorkflowTransition[];
    elemRef: ElementRef;
    jsPlumbInstance;

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

          for(let transition of transitions){
            const nodeId = 'state_' + transition.fromStateId;
            if(this.elemRef.nativeElement.querySelector('#' + nodeId) === null){
                const node = this.renderer.createElement('div');
                const nodeStateName = this.renderer.createText(transition._from);

                this.renderer.appendChild(node, nodeStateName);

                const nodeOwner = this.renderer.createElement('input');
                this.renderer.setAttribute(nodeOwner,'value','');
                this.renderer.addClass(nodeOwner,'anu-input');
                this.renderer.appendChild(node,nodeOwner);

                this.renderer.setAttribute(node, 'id', nodeId);
                this.renderer.addClass(node,'state-node');
                this.renderer.addClass(node,'my-5');
                this.renderer.appendChild(this.flowContainer.nativeElement,node);
            }
          }
          for(let transition of transitions){
          const nodeId = 'state_' + transition.toStateId;
          if(this.elemRef.nativeElement.querySelector('#' + nodeId) === null){
              const node = this.renderer.createElement('div');
              const nodeStateName = this.renderer.createText(transition._to);
              this.renderer.appendChild(node, nodeStateName);
              this.renderer.setAttribute(node, 'id', nodeId);
              this.renderer.addClass(node,'state-node');
              this.renderer.addClass(node,'my-5');
              this.renderer.appendChild(this.flowContainer.nativeElement,node);
          }
        }

        this.showFlow(this.transitions);

          });

  }

  ngAfterViewInit(){
    //this.showFlow(this.transitions);
  }


showFlow(transitions){
const curves = [30, 40, 50, 60, 70, 80, 90, 100];
let curvesCnt = 0;
jsPlumb.Defaults.Endpoint = "Blank";
var jsPlumbInstance = jsPlumb.getInstance(jsPlumb.Defaults);
    jsPlumbInstance.Defaults.Overlays = [];
    for(let transition of transitions){

        if(Number(transition.fromStateId) < Number(transition.toStateId)){
        setTimeout(() => {
            jsPlumbInstance.connect({
                    connector:[ "Flowchart"],
                    overlays:[
                        [ "Arrow", { width:5, length:5, location:1} ],
                        [ 'Label', { label: transition.action, location: 0.5, cssClass: 'connectorLabel' } ]
                      ],
                    source: 'state_' + transition.fromStateId, // it is the id of source div
                    target: 'state_' + transition.toStateId, // it is the id of target div
                    anchors: [ "Bottom", "Top"]
                  });
        },150);


        }else {
        setTimeout(() => {
            jsPlumbInstance.connect({
                                    connector:[ "Bezier", { curviness: curves[curvesCnt++]} ],
                                    overlays:[
                                        [ "Arrow", { width:5, length:5, location:1} ],
                                        [ 'Label', { label: transition.action, location: 0.5, cssClass: 'connectorLabel' } ]
                                      ],
                                    source: 'state_' + transition.fromStateId, // it is the id of source div
                                    target: 'state_' + transition.toStateId, // it is the id of target div
                                    anchors: [ "Right", "Right"]
                                  });
        },150);
        }


    }
jsPlumbInstance.repaintEverything();
    $(window).resize(function(){
          jsPlumbInstance.repaintEverything();
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
