import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {WorkflowTransition} from "../model/workflow-transition";
import {WorkflowLinks, WorkflowNode} from '../model/graph';

@Component({
    selector: 'app-workflow-management',
    templateUrl: './workflow-management.component.html',
    styleUrls: ['./workflow-management.component.scss']
})
export class WorkflowManagementComponent implements OnInit {

    transitions: WorkflowTransition[];
    nodes: WorkflowNode[];
    links: WorkflowLinks[];

    constructor(
        private http: HttpClient
    ) {
    }

    ngOnInit() {

        this.getWorkflows();
        this.nodes = new Array<WorkflowNode>();
        this.links = new Array<WorkflowLinks>();
    }

    private getWorkflows() {

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
            const localNodes = new Array<WorkflowNode>();
            const localLinks = new Array<WorkflowLinks>();
            for (const transition of transitions) {
                let index = localNodes.findIndex(trans => trans.id === String(transition.fromStateId));
                if (index === -1) {
                    localNodes.push(new WorkflowNode(String(transition.fromStateId), transition._from));
                }
                index = localNodes.findIndex(trans => trans.id === String(transition.toStateId));
                if (index === -1) {
                    localNodes.push(new WorkflowNode(String(transition.toStateId), transition._to));
                }

                localLinks.push(new WorkflowLinks('', String(transition.fromStateId), String(transition.toStateId), transition.action + '^' + transition._performedby))

            }

            this.nodes = localNodes;
            this.links = localLinks;
            console.log(JSON.stringify(this.nodes));
        });
    }

}
