import { Injectable } from "@angular/core";
import { AppComponent } from "./app.component";
import { WorkflowStatus } from "./model/dahsboard";

@Injectable({
    providedIn: 'root'
})
export class WorkflowValidationService{

    constructor(){}

    getStatusByStatusIdForGrant(statusId:number, appComp:AppComponent):WorkflowStatus{
        return appComp.grantWorkflowStatuses.filter(ws => ws.id===statusId)[0];
    }

    getStatusByStatusIdForReport(statusId:number, appComp:AppComponent):WorkflowStatus{
        return appComp.reportWorkflowStatuses.filter(ws => ws.id===statusId)[0];
    }
}