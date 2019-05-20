import {Note} from './dahsboard';

export class KpiSubmissionData {
  submissionId: number;
  kpiDataId: number;
  type: string;
  value: string;
  fileName: string;
  fileType: string;
  toStatusId: number;
  notes: Array<string>;
  files: Array<UploadFile>;
}

export class SubmissionData {
  id: number;
  notes: string[];
  kpiSubmissionData: Array<KpiSubmissionData>;
}
export class UploadFile {
  fileName: string;
  fileType: string;
  value: string;
}
