import {Grant, WorkflowStatus} from './dahsboard';
import {User} from './user';

export class Report{
    id: number;
    name: String;
     startDate: Date;
     endDate: Date;
     dueDate: Date;
     type: String;
    status: WorkflowStatus;
    createdAt: Date;
    createdBy: User
    updatedAt: Date;
    updatedBy: User;
    assignments:ReportAssignment[];
    grant: Grant
}

export class ReportAssignment{
    id: number;
    reportId: number;
    stateId: number;
    assignment: number;
    anchor: boolean;
    constructor(){}
}