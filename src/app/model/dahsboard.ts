export class Organization {
    id: number;
    name: string;
    code: string;
    createdAt: Date;
    createdBy: string;
    type: string;
  }

  export class GrantorOrganization {
    id: number;
    name: string;
    code: string;
    createdAt: Date;
    createdBy: string;
    hostUrl: string;
    imageName: string;
    navbarColor: string;
    navbarTextColor: string;
    rfps: any[];
    type: string;
  }

  export class StatePermission {
    id: number;
    permission: string;
    createdAt: Date;
    createdBy: string;
  }

  export class WorkflowStatus {
    id: number;
    name: string;
    displayName: string;
    terminal: boolean;
    statePermissions: StatePermission[];
    createdAt: Date;
    createdBy: string;
  }

  export class SubmissionStatus {
    id: number;
    name: string;
    displayName: string;
    terminal: boolean;
    statePermissions: any[];
    createdAt: Date;
    createdBy: string;
  }

  export class GrantKpi {
    id: number;
    title: string;
    description: string;
    scheduled: boolean;
    periodicity: number;
    frequency: string;
    kpiType: string;
    createdAt: Date;
    createdBy: string;
  }

  export class QuantitiaveKpisubmission {
    id: number;
    goal: number;
    actuals: number;
    grantKpi: GrantKpi;
    note: string
  }

  export class QualitativeKpiSubmission {
    id: number;
    goal: string;
    actuals: string;
    grantKpi: GrantKpi;
    note: string;
  }

export class DocumentKpiSubmission {
  id: number;
  goal: string;
  actuals: string;
  grantKpi: GrantKpi;
  type: string;
  note: string;
}

  export class FlowAuthority {
    id: number;
    fromStateId: number;
    fromName: string;
    toStateId: number;
    toName: string;
    action: string;
  }

  export class Submission {
    id: number;
    grant: Grant;
    title: string;
    submitBy: Date;
    submissionStatus: SubmissionStatus;
    quantitiaveKpisubmissions: QuantitiaveKpisubmission[];
    qualitativeKpiSubmissions: QualitativeKpiSubmission[];
    documentKpiSubmissions: DocumentKpiSubmission[];
    createdAt: Date;
    createdBy: string;
    flowAuthorities: FlowAuthority[];
    actionAuthorities: ActionAuthorities;
  }

  export class ActionAuthorities {
    permissions: string[];
    id: number;
  }

  export class Grant {
    id: number;
    organization: Organization;
    grantorOrganization: GrantorOrganization;
    name: string;
    description: string;
    grantStatus: WorkflowStatus;
    substatus: WorkflowStatus
    statusName: string;
    startDate: Date;
    endDate: Date;
    submissions: Submission[];
    actionAuthorities: ActionAuthorities;
    flowAuthorities: any[];
  }

  export class Tenant {
    name: string;
    grants: Grant[];
  }

  export class Tenants {
    tenants: Tenant[];
  }

