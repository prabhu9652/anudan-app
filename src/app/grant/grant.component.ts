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
  kpiSubmissionTitle: string;
  currentGrant: Grant;
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(grant => this.currentGrant = grant);
    for (const singleKpi of this.currentGrant.kpis) {
        for (const singleSubmission of singleKpi.submissions) {
          if (singleSubmission.flowAuthority) {
            this.hasKpisToSubmit = true;
            this.kpiSubmissionTitle = singleSubmission.title;
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

  goToHome() {
    this.router.navigate(['dashboard']);
  }
}
