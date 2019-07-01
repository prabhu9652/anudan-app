import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {WorkflowTransition} from "../model/workflow-transition";

@Component({
    selector: 'app-workflow-management',
    templateUrl: './workflow-management.component.html',
    styleUrls: ['./workflow-management.component.scss']
})
export class WorkflowManagementComponent implements OnInit {

    private transitions: WorkflowTransition[];

    constructor(
        private http: HttpClient
    ) {
    }

    ngOnInit() {

        this.getWorkflows();
    }

    private getWorkflows() {

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };
        let url = '/api/admin/workflow/grant';

        this.http.get<WorkflowTransition>(url, httpOptions).subscribe((transitions: any) => {
            this.transitions = transitions;
            console.log(this.transitions);
        });
    }

}
