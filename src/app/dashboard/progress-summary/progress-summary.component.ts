import {Component, OnInit,Input,OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import * as inf from 'indian-number-format';


@Component({
  selector: 'app-progress-summary',
  templateUrl: './progress-summary.component.html',
  styleUrls: ['./progress-summary.component.css'],
  styles: [`
         ::ng-deep .progress-summary-class .mat-progress-bar-fill::after {
               background:#4DC252 !important;
         }
    `]
})
export class ProgressSummaryComponent implements OnInit,OnChanges {

     @Input() data:any;
     @Input() display: boolean = false;

     heading: string;
     caption: string;
     actual: string;
     planned: string;
     isCurrency: boolean = true;
     percent: number;


    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property === 'data') {
                console.log('data changed');
                if(this.data){
                    this.display = true;
                    this.heading = "Disbursed";
                    this.caption = "Committed";
                    this.planned = inf.format(Number(this.data.committedAmount),2);
                    this.actual = '₹' + inf.format(Number(this.data.disbursedAmount),2);
                   this.percent = Math.round(Number(this.data.disbursedAmount)/Number(this.data.committedAmount)*100);
                }
            }
        }
    }

}
