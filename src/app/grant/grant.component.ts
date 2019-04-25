import { Component, OnInit } from '@angular/core';
import { GrantDataService } from '../grant.data.service';
import {Grant} from '../model/dahsboard'
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {SubmissionDataService} from '../submission.data.service';


@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss']
})
export class GrantComponent implements OnInit {

  hasKpisToSubmit: boolean;
  kpiSubmissionTitle: string;
  currentGrant: Grant;
  constructor(private data: GrantDataService, private route: ActivatedRoute, private router: Router, private submissionDataService: SubmissionDataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(grant => this.currentGrant = grant);

    for (const submission of this.currentGrant.submissions){
      if (submission.flowAuthorities) {
        this.hasKpisToSubmit = true;
        this.kpiSubmissionTitle = submission.title;
        break;
      }
    }
  }

  viewKpisToSubmit(submissionId: number) {
    for ( const submission of this.currentGrant.submissions) {
        if (submission.id === submissionId){
          this.submissionDataService.changeMessage(submission);
          break;
        }
    }
    this.router.navigate(['kpisubmission']);
  }

  goToHome() {
    this.router.navigate(['dashboard']);
  }
}
