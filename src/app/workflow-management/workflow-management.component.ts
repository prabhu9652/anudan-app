import {Component, OnInit, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {WorkflowTransition} from "../model/workflow-transition";
import {WorkflowLinks, WorkflowNode} from '../model/graph';


@Component({
    selector: 'app-workflow-management',
    templateUrl: './workflow-management.component.html',
    styleUrls: ['./workflow-management.component.scss']
})
export class WorkflowManagementComponent implements OnInit {



    constructor(
        private http: HttpClient) {
    }

    ngOnInit() {


    }



}
