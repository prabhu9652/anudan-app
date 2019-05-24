import {User} from './user';

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
  templates: Template[];
}

export class Template {
    description: string;
    id: number;
    location: string;
    name: string;
    type: string;
    version: number;
    fileType: string;
}

export class Note {
  id: number;
  message: string;
  postedOn: Date;
  postedBy: User;
}

export class QuantitiaveKpisubmission {
  id: number;
  goal: number;
  actuals: number;
  grantKpi: GrantKpi;
  note: string;
  notesHistory: Note[];
  submissionDocs: Doc[];
}

export class QualitativeKpiSubmission {
  id: number;
  goal: string;
  actuals: string;
  grantKpi: GrantKpi;
  note: string;
  notesHistory: Note[];
  submissionDocs: Doc[];
}

export class Doc {
  id: number;
  fileName: string;
  fileType: string;
  version: number;
}

export class DocumentKpiSubmission {
  id: number;
  goal: string;
  actuals: string;
  grantKpi: GrantKpi;
  type: string;
  note: string;
  notesHistory: Note[];
  submissionDocs: Doc[];
}

export class FlowAuthority {
  id: number;
  fromStateId: number;
  fromName: string;
  toStateId: number;
  toName: string;
  action: string;
  noteRequired: boolean;
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
  submissionNotes: Note[];

  getQuantitativeKpiById(id: number) {
    for (const q of this.quantitiaveKpisubmissions) {
      if (q.id === id) {
        return q;
      }
    }
  }
}

export class ActionAuthorities {
  permissions: string[];
  id: number;
}

export class Attribute {
  fieldName: string;
  fieldType: string;
  fieldValue: string;
}

export class Section {
  name: string;
  attribute: Attribute[];
}

export class GrantDetails {
  sections: Section[];
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
  grantDetails: GrantDetails;
}

export class Tenant {
  name: string;
  grants: Grant[];
}

export class Tenants {
  tenants: Tenant[];
}

