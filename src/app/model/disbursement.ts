import { WorkflowStatus, Grant, FlowAuthority } from "./dahsboard";

export class Disbursement{
    id:number;
    requestedAmount:number;
    reason:string;
    status: WorkflowStatus;
    grant: Grant;
    assignments: DisbursementAssignment[];
    flowPermissions: FlowAuthority;
    canManage:boolean;
}

export class DisbursementAssignment{
    id: number;
    disbursementId: number;
    stateId: number;
    owner: number;
    anchor: boolean;
    
}