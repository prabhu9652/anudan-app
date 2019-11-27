import {Grant, WorkflowStatus,Section,WorkflowAssignment,FlowAuthority,SectionDiff} from './dahsboard';
import {User} from './user';

export class Report{
    id: number;
    name: string;
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
    granteeUsers: User[];
    reportDetails: ReportDetails;
    workflowAssignments:ReportAssignment[];
    duration: string;
    grant: Grant;
    canEdit: boolean;
    canManage: boolean;
    flowAuthorities: FlowAuthority;
}

export class ReportDetails {
  sections: Section[];
}

export class ReportAssignment{
    id: number;
    reportId: number;
    stateId: number;
    assignmentId: number;
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

export class ReportWorkflowAssignmentModel{
 users: User[];
 workflowStatuses: WorkflowStatus[];
 workflowAssignments: ReportAssignment[];
 type:string;
 granteeUsers: User[];
 report: Report;
 canManage: boolean;
 constructor(){}
}

export class ReportWorkflowAssignment{
    id: number;
    reportId: number;
    stateName: WorkflowStatus;
    stateId: number;
    assignmentId: number;
    assignmentUser: User;
    anchor: boolean;
    constructor(){}
}

export class ReportNote{
    currentReport: Report;
    originalReport: Report;
    canManage: boolean;
}

export class ReportDiff{
    oldReportName: string;
    newReportName: string;
    oldReportStartDate: Date;
    newReportStartDate: Date;
    oldReportEndDate: Date;
    newReportEndDate: Date;
    oldReportDueDate: Date;
    newReportDueDate: Date;
    sectionDiffs: SectionDiff[];
}

export class ReportSnapshot {
  id: number;
  assignedToId: number;
  reportId: number;
  stringAttributes: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  dueDate: Date;
  statusId: number;
  reportDetails: ReportDetails;
}