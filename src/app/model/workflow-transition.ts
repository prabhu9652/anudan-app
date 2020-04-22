export class WorkflowTransition {
    id: number;
    action: string;
    _from: string;
    fromStateId: number;
    _to: string;
    toStateId: number;
    _performedby: string;
    roleId: number;
    noteRequired: boolean;
    seqOrder:number;
}