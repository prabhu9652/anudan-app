import {User} from './user';
import * as moment from 'moment';
import _date = moment.unitOfTime._date;

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
    data: string;
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
  toReport: boolean;
  submission: Submission;
}

export class QualitativeKpiSubmission {
  id: number;
  goal: string;
  actuals: string;
  grantKpi: GrantKpi;
  note: string;
  notesHistory: Note[];
  submissionDocs: Doc[];
  toReport: boolean;
  submission: Submission;
}

export class Doc {
  id: number;
  fileName: string;
  fileType: string;
  version: number;
  data: string;
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
  toReport: boolean;
  submission: Submission;
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
  submitDateStr: string
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
  id: number;
  fieldName: string;
  fieldType: string;
  fieldValue: string;
}

export class Section {
  id: number;
  sectionName: string;
  attributes: Attribute[];
}

export class GrantDetails {
  sections: Section[];
}

export class Kpi {
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
  stDate: string;
  endDate: Date;
  enDate: String;
  submissions: Submission[];
  actionAuthorities: ActionAuthorities;
  flowAuthorities: FlowAuthority[];
  grantDetails: GrantDetails;
  kpis: Kpi[];
}

export class Tenant {
  name: string;
  grants: Grant[];
}

export class Tenants {
  tenants: Tenant[];
}

export class FileTemplates {
  kpiId: number;
  title: string;
  subTitle: string;
  templates: Template[];
  type: string;
  canManage: boolean;
}

export class AttachmentTemplates {
  kpiDataId: number;
  kpiDataType: string;
  title: string;
  subTitle: string;
  docs: Doc[];
  type: string;
  canManage: boolean;
}

export class SerializationHelper {
  static toInstance<T>(obj: T, json: string): T {
    const jsonObj = JSON.parse(json);

    if (typeof obj['fromJSON'] === 'function') {
      obj['fromJSON'](jsonObj);
    } else {
      for (const propName of jsonObj) {
        obj[propName] = jsonObj[propName]
      }
    }

    return obj;
  }
}
