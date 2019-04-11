import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {Grant, Kpi} from '../model/dahsboard'
import {Router, ActivatedRoute, ParamMap} from '@angular/router';


@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss']
})
export class GrantComponent implements OnInit {

  hasKpisToSubmit: boolean;
  currentGrant: Grant;
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(grant => this.currentGrant = grant);
    for (const singleKpi of this.currentGrant.kpis) {
        for (const singleQuantKpi of singleKpi.qunatitativeKpis) {
          if (singleQuantKpi.flowAuthority) {
            this.hasKpisToSubmit = true;
            break;
          }
        }
      for (const singleQualKpi of singleKpi.qualitativeKpis) {
        if (singleQualKpi.flowAuthority) {
          this.hasKpisToSubmit = true;
          break;
        }
      }
        if (this.hasKpisToSubmit) {
          break;
        }
    }
  }

  viewKpisToSubmit() {
    this.router.navigate(['kpisubmission']);
  }
}
