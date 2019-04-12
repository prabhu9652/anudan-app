import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Grant, Tenants} from '../model/dahsboard';
import { Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ElementRef} from '@angular/core';
import { KpiSubmissionData} from '../model/KpiSubmissionData';

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
      for (const quantKpi of kpi.qunatitativeKpis) {
        if (quantKpi.flowAuthority) {
          const kpiData = {
            'kpiDataId': quantKpi.id,
            'kpiType': kpi.kpiType,
            'kpiDataTitle': kpi.title,
            'kpiDataGoal': quantKpi.goal,
            'kpiDataActuals': quantKpi.actuals,
            'kpiAction': quantKpi.flowAuthority[0].action,
            'kpiActionId': quantKpi.flowAuthority[0].toStateId
          }
          for ( const fa of quantKpi.flowAuthority) {
            if (!this._contains(this.actions, fa.action)) {
              this.actions.push({'action': fa.action, 'toStateId': fa.toStateId});
            }
          }
          this.quantitativeKpisToSubmit.push(kpiData);
        }
      }
      for (const qualKpi of kpi.qualitativeKpis) {
        if (qualKpi.flowAuthority) {
          const kpiData = {
            'kpiDataId': qualKpi.id,
            'kpiType': kpi.kpiType,
            'kpiDataTitle': kpi.title,
            'kpiDataGoal': qualKpi.goal,
            'kpiDataActuals': qualKpi.actuals,
            'kpiAction': qualKpi.flowAuthority[0].action,
            'kpiActionId': qualKpi.flowAuthority[0].toStateId
          }
          for ( const fa of qualKpi.flowAuthority) {
            if (!this._contains(this.actions, fa.action)) {
              this.actions.push({'action': fa.action, 'toStateId': fa.toStateId});
            }
          }
          this.qualitativeKpisToSubmit.push(kpiData);
        }
      }
    }
  }

  submitKpis(toStateId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN'),
        'USER-ID': localStorage.getItem('USER_ID')
      })
    };


    const elements = this.elem.nativeElement.querySelectorAll('[id^="data_id_"]');
    const submissionData: Array<KpiSubmissionData> = [];
    for ( const e of elements) {
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

