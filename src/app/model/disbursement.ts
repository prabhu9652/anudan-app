import { WorkflowStatus, Grant, FlowAuthority, SectionDiff } from "./dahsboard";
import { User } from "./user";

export class Disbursement {
  id: number;
  requestedAmount: number;
  reason: string;
  status: WorkflowStatus;
  grant: Grant;
  assignments: DisbursementAssignment[];
  flowPermissions: FlowAuthority;
  note: string;
  noteAddedByUser: User;
  noteAdded: Date;
  canManage: boolean;
  canRecordActuals: boolean;
  actualDisbursements: ActualDisbursement[];
  approvedActualsDibursements: ActualDisbursement[];
  disabledByAmendment: boolean;
}

export class ActualDisbursement {
  id: number;
  disbursementDate: Date;
  stDisbursementDate: string;
  actualAmount: number;
  note: string;
  disbursementId: number;
  otherSources: number;
}

export class DisbursementHistory {
  seqid: number;
  id: number;
  requestedAmount: number;
  reason: string;
  status: WorkflowStatus;
  grant: Grant;
  assignments: DisbursementAssignment[];
  flowPermissions: FlowAuthority;
  note: string;
  noteAddedByUser: User;
  noteAdded: Date;
  canManage: boolean;
}

export class DisbursementAssignment {
  id: number;
  disbursementId: number;
  stateId: number;
  owner: number;
  anchor: boolean;
  assignmentUser: User;
}

export class DisbursementWorkflowAssignmentModel {
  users: User[];
  workflowStatuses: WorkflowStatus[];
  workflowAssignments: DisbursementAssignment[];
  customAssignments: string;
  type: string;
  disbursement: Disbursement;
  canManage: boolean;
  constructor() { }
}

export class DisbursementWorkflowAssignment {
  id: number;
  disbursementId: number;
  stateName: WorkflowStatus;
  stateId: number;
  assignmentId: number;
  customAssignments: string;
  assignmentUser: User;
  anchor: boolean;
  constructor() { }
}

export class DisbursementNote {
  currentDisbursement: Disbursement;
  originalDisbursement: Disbursement;
  canManage: boolean;
  validationResult: any;
}

export class DisbursementDiff {
  oldRequestedAmount: number;
  newRequestedAmount: number;
  oldReason: string;
  newReason: string;
}

export class DisbursementSnapshot {
  id: number;
  assignedToId: number;
  DisbursementId: number;
  requestedAmount: number;
  reason: string;
  statusId: number;
}
