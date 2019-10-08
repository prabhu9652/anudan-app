import {Component, Inject, OnInit, ViewChild, ElementRef, Renderer2, HostListener} from '@angular/core';
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
    scrollListener;
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
                this.renderer.addClass(node,this.getColorCodeByStatus(this.message.workflowStatuses.filter((status) => status.id===transition.fromStateId)[0].internalStatus))
                const nodeStateName = this.renderer.createText(transition._from);
                this.renderer.appendChild(node, nodeStateName);

                const nodeOwner = this.renderer.createElement('select');
                const currentUserAssignment = this.message.workflowAssignment.filter((assignment) => assignment.assignments===JSON.parse(localStorage.getItem('USER')).id);
                if(currentUserAssignment.length>0 && !currentUserAssignment[0].anchor){
                    this.renderer.setAttribute(nodeOwner,'disabled','disabled');
                }
                this.renderer.addClass(nodeOwner,'ml-3');
                this.renderer.addClass(nodeOwner,'px-2');
                const assignment = this.message.workflowAssignment.filter((assignment) => assignment.stateId===transition.fromStateId);
                if(assignment.length>0){
                    this.renderer.setAttribute(nodeOwner,'value',assignment[0].assignmentUser?String(assignment[0].assignmentUser.id):String(0));
                    this.renderer.setAttribute(nodeOwner,'id','assignment_' + assignment[0].id  + '_' + transition.fromStateId + '_' + this.message.grant.id);
                }else{
                    this.renderer.setAttribute(nodeOwner,'id','assignment_'+transition.fromStateId+'_'+this.message.grant.id);
                }
                const nodeOwnerOptions = this.renderer.createElement('option');
                this.renderer.setAttribute(nodeOwnerOptions,'value','0');
                this.renderer.appendChild(nodeOwnerOptions,document.createTextNode('Select an owner'));
                this.renderer.appendChild(nodeOwner,nodeOwnerOptions);
                for(let option of this.message.users){
                    const nodeOwnerOptions = this.renderer.createElement('option');
                    this.renderer.setAttribute(nodeOwnerOptions,'value',String(option.id));
                    if(assignment.length > 0 && (assignment[0].assignmentUser?Number(assignment[0].assignmentUser.id):0) === Number(option.id)){
                        this.renderer.setAttribute(nodeOwnerOptions,'selected','selected');
                    }
                    let username = option.firstName + ' '  + option.lastName + this.getRoles(option);

                    this.renderer.appendChild(nodeOwnerOptions,document.createTextNode(username));
                    this.renderer.appendChild(nodeOwner,nodeOwnerOptions);

                }

                //this.renderer.addClass(nodeOwner,'anu-input');
                this.renderer.appendChild(node,nodeOwner);




                this.renderer.setAttribute(node, 'id', nodeId);
                this.renderer.addClass(node,'state-node');
                if(transition.fromStateId === this.message.grant.grantStatus.id){
                    const indicator = this.renderer.createElement('i');
                    this.renderer.addClass(indicator,'fa');
                    this.renderer.addClass(indicator,'fa-arrow-circle-right');
                    this.renderer.addClass(indicator,'status-indicator');
                    this.renderer.appendChild(node,indicator);
                }
                this.renderer.addClass(node,'my-5');
                this.renderer.appendChild(this.flowContainer.nativeElement,node);
            }

          }
          for(let transition of transitions){
          const nodeId = 'state_' + transition.toStateId;
          if(this.elemRef.nativeElement.querySelector('#' + nodeId) === null){
              const node = this.renderer.createElement('div');
              const nodeStateName = this.renderer.createText(transition._to);
              this.renderer.addClass(node,this.getColorCodeByStatus(this.message.workflowStatuses.filter((status) => status.id===transition.toStateId)[0].internalStatus));
              this.renderer.appendChild(node, nodeStateName);
              this.renderer.setAttribute(node, 'id', nodeId);
              this.renderer.addClass(node,'state-node');
              this.renderer.addClass(node,'my-5');
              this.renderer.appendChild(this.flowContainer.nativeElement,node);

              if(transition.toStateId === this.message.grant.grantStatus.id){
                  const indicator = this.renderer.createElement('i');
                  this.renderer.addClass(indicator,'fa');
                  this.renderer.addClass(indicator,'fa-arrow-circle-right');
                  this.renderer.addClass(indicator,'status-indicator');
                  this.renderer.appendChild(node,indicator);
              }
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
const labelPositions = [0.5, 0.25,0.5, 0.25,0.5, 0.25];
let curvesCnt = 0;
let posCnt = 0;
jsPlumb.Defaults.Endpoint = "Blank";
this.jsPlumbInstance = jsPlumb.getInstance(jsPlumb.Defaults);
    this.jsPlumbInstance.Defaults.Overlays = [];
    for(let transition of transitions){

        if(Number(transition.fromStateId) < Number(transition.toStateId)){
        setTimeout(() => {
            this.jsPlumbInstance.connect({
                    connector:[ "Flowchart"],
                    overlays:[
                        [ "Arrow", { width:8, length:8, location:1} ],
                        [ 'Label', { label: transition.action, location: 0.5, cssClass: 'connectorLabel' } ]
                      ],
                    source: 'state_' + transition.fromStateId, // it is the id of source div
                    target: 'state_' + transition.toStateId, // it is the id of target div
                    anchors: [ "Bottom", "Top"]
                  });
        },150);


        }else {
        setTimeout(() => {
            this.jsPlumbInstance.connect({
                                    connector:[ "Bezier", { curviness: curves[curvesCnt++]} ],
                                    overlays:[
                                        [ "Arrow", { width:8, length:8, location:1} ],
                                        [ 'Label', { label: transition.action, location: labelPositions[posCnt++], cssClass: 'connectorLabel' } ]
                                      ],
                                    source: 'state_' + transition.fromStateId, // it is the id of source div
                                    target: 'state_' + transition.toStateId, // it is the id of target div
                                    anchors: [ "Right", "Right"]
                                  });
        },150);
        }


    }
this.jsPlumbInstance.repaintEverything();
    $(window).resize(function(){
          //jsPlumbInstance.repaintEverything();
      });
}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    const assignmentElems = $('[id^="assignment_"]');
    const assignMentResult=[];
     for(let i=0; i< assignmentElems.length;i++){
         var assignmentTokens = $(assignmentElems[i]).attr('id').split('_');
         if(assignmentTokens.length===4){
            assignMentResult.push({'id':assignmentTokens[1],'stateId':assignmentTokens[2],'userId':$(assignmentElems[i]).val(), 'grantId':assignmentTokens[3]});
         }else{
            assignMentResult.push({'id':'','stateId':assignmentTokens[1],'userId':$(assignmentElems[i]).val(),'grantId':assignmentTokens[2]});
         }
     }
    this.dialogRef.close({'result':true,data:assignMentResult});
  }

  getRoles(user): string{
    return ' [' + user.userRoles.map(ur => ur.role.name).join(', ') + ']';
  }

   scroll() {
        console.log('scrolled');
      }

      getColorCodeByStatus(status): string{
        if(status === 'DRAFT'){
        return 'state-draft';
        }else if(status === 'ACTIVE'){
         return'state-active';
        }
        return 'state-closed';
      }
}
