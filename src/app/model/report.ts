import {Grant, WorkflowStatus,Section} from './dahsboard';
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
    template: any;
    reportDetails: ReportDetails;
    assignments:ReportAssignment[];
    duration: string;
    grant: Grant;
    canEdit: boolean;
}

export class ReportDetails {
  sections: Section[];
}

export class ReportAssignment{
    id: number;
    reportId: number;
    stateId: number;
    assignment: number;
    anchor: boolean;
    constructor(){}
}

export class ReportFieldInfo{
    attributeId: number;
    stringAttributeId: number;
    report: Report;
}

export class ReportDocInfo{
    attachmentId: number;
    report: Report;
}

export class ReportSectionInfo{
    sectionId: number;
    sectionName: string;
    report: Report;
}