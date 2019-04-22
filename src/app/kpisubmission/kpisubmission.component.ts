import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Grant, Tenants} from '../model/dahsboard';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ElementRef} from '@angular/core';
import {KpiSubmissionData} from '../model/KpiSubmissionData';

@Component({
  selector: 'app-kpisubmission',
  templateUrl: './kpisubmission.component.html',
  styleUrls: ['./kpisubmission.component.scss']
})

export class KpisubmissionComponent implements OnInit {
  currentGrant: Grant;
  quantitativeKpisToSubmit: Array<any> = [];
  qualitativeKpisToSubmit: Array<any> = [];
  actions: Array<any> = [];


  constructor(private http: HttpClient, private data: DataService, private router: Router, private elem: ElementRef) {
  }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(grant => this.currentGrant = grant);


    for (const kpi of this.currentGrant.kpis) {
      for (const submission of kpi.submissions) {
        if (submission.flowAuthority) {
          for (const quantKpi of submission.grantQuantitativeKpiData) {
            const kpiData = {
              'kpiDataId': quantKpi.id,
              'kpiType': kpi.kpiType,
              'kpiDataTitle': kpi.title,
              'kpiDataGoal': quantKpi.goal,
              'kpiDataActuals': quantKpi.actuals,
              'kpiAction': submission.flowAuthority[0].action,
              'kpiActionId': submission.flowAuthority[0].toStateId
            }
            for (const fa of submission.flowAuthority) {
              if (!this._contains(this.actions, fa.action)) {
                this.actions.push({'action': fa.action, 'toStateId': fa.toStateId});
              }
            }
            this.quantitativeKpisToSubmit.push(kpiData);
          }

          for (const qualKpi of submission.grantQualitativeKpiData) {
              const kpiData = {
                'kpiDataId': qualKpi.id,
                'kpiType': kpi.kpiType,
                'kpiDataTitle': kpi.title,
                'kpiDataGoal': qualKpi.goal,
                'kpiDataActuals': qualKpi.actuals,
                'kpiAction': submission.flowAuthority[0].action,
                'kpiActionId': submission.flowAuthority[0].toStateId
              }
              for (const fa of submission.flowAuthority) {
                if (!this._contains(this.actions, fa.action)) {
                  this.actions.push({'action': fa.action, 'toStateId': fa.toStateId});
                }
              }
              this.qualitativeKpisToSubmit.push(kpiData);
          }
        }
      }
    }
  }

  submitKpis(toStateId: string) {
    const user = JSON.parse(localStorage.getItem('USER'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN'),
        'USER-ID': user.id
      })
    };


    const elements = this.elem.nativeElement.querySelectorAll('[id^="data_id_"]');
    const submissionData: Array<KpiSubmissionData> = [];
    for (const e of elements) {
      const idComponents = e.id.split('_');
      const data = new KpiSubmissionData();
      data.id = idComponents[3];
      data.type = idComponents[2];
      data.value = e.value;
      data.toStatusId = Number(toStateId);
      submissionData.push(data);
    }
    const url = '/api/grant/kpi';
    this.http.put(url, submissionData, httpOptions).subscribe((grant: Grant) => {
      this.data.changeMessage(grant);
      this.router.navigate(['grant']);
    });
  }


  private _contains(a, obj) {
    for (let i = 0; i < a.length; i++) {
      if (a[i].action === obj) {
        return true;
      }
    }
    return false;
  }
}

