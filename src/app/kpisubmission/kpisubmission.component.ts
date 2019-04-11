import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Grant, QualitativeKpi, QunatitativeKpi} from '../model/dahsboard';

@Component({
  selector: 'app-kpisubmission',
  templateUrl: './kpisubmission.component.html',
  styleUrls: ['./kpisubmission.component.scss']
})

export class KpisubmissionComponent implements OnInit {
  currentGrant: Grant;
  quantitativeKpisToSubmit: Array<any> = [];
  qualitativeKpisToSubmit: Array<any> = [];


  constructor(private data: DataService) {
  }

  ngOnInit(): void {
    this.data.currentMessage.subscribe(grant => this.currentGrant = grant);


    for (const kpi of this.currentGrant.kpis) {
      for (const quantKpi of kpi.qunatitativeKpis) {
        if (quantKpi.flowAuthority) {
          const kpiData = {
            'kpiDataId': quantKpi.id,
            'kpiDataTitle': kpi.title,
            'kpiDataGoal': quantKpi.goal,
            'kpiAction': quantKpi.flowAuthority[0].action
          }
          this.quantitativeKpisToSubmit.push(kpiData);
        }
      }
    }
  }
}

