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
  rfps: any[];
  type: string;
}

export class QunatitativeKpi {
  id: number;
  goal: number;
  actuals: number;
  statusName: string;
  submitByDate: Date;
  flowAuthority: FlowAuthority[];
  actionAuthority: ActionAuthority;
}

export class QualitativeKpi {
  id: number;
  goal: string;
  actuals: string;
  statusName: string;
  submitByDate: Date;
  flowAuthority: FlowAuthority[];
  actionAuthority: ActionAuthority;
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
  qunatitativeKpis: QunatitativeKpi[];
  qualitativeKpis: QualitativeKpi[];
}

export class FlowAuthority {
  id: number;
  fromStateId: number;
  fromName: string;
  toStateId: number;
  toName: string;
  action: string;
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
  statusName: string;
  startDate: Date;
  endDate: Date;
  kpis: Kpi[];
  flowAuthority: FlowAuthority[];
  actionAuthority: ActionAuthority;
}

export class Tenant {
  name: string;
  grants: Grant[];
}

export class Tenants {
  tenants: Tenant[];
}
