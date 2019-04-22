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

export class GrantStatus {
  id: number;
  name: string;
  terminal: boolean;
  statePermissions: StatePermission[];
  createdAt: Date;
  createdBy: string;
}

export class SubmissionStatus {
  id: number;
  name: string;
  terminal: boolean;
  statePermissions: any[];
  createdAt: Date;
  createdBy: string;
}

export class GrantQuantitativeKpiData {
  id: number;
  goal: number;
  actuals: number;
}

export class GrantQualitativeKpiData {
  id: number;
  goal: string;
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
  submitByDate: Date;
  submissionStatus: SubmissionStatus;
  grantQuantitativeKpiData: GrantQuantitativeKpiData[];
  grantQualitativeKpiData: GrantQualitativeKpiData[];
  title: string;
  statusName: string;
  createdAt: Date;
  createdBy: string;
  flowAuthority: FlowAuthority[];
  id: number;
}

export class Kpi {
  id: number;
  title: string;
  description: string;
  scheduled: boolean;
  periodicity: number;
  frequency: string;
  status: string;
  kpiType: string;
  createdAt: Date;
  createdBy: string;
  submissions: Submission[];
}

export class ActionAuthority {
  permissions: string[];
  id: number;
}

export class Grant {
  id: number;
  organization: Organization;
  grantorOrganization: GrantorOrganization;
  name: string;
  description: string;
  grantStatus: GrantStatus;
  statusName: string;
  substatus: '';
  startDate: Date;
  endDate: Date;
  kpis: Kpi[];
  flowAuthority: any[];
  actionAuthority: ActionAuthority;
}

export class Tenant {
  name: string;
  grants: Grant[];
}

export class Tenants {
  tenants: Tenant[];
}
