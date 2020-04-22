import {Component, OnInit,Input} from '@angular/core';


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
export class ProgressSummaryComponent implements OnInit {

     @Input() heading: string;
     @Input() caption: string;
     @Input() actual: string;
     @Input() planned: string;
     @Input() isCurrency: boolean;
     @Input() disabled: boolean = false;
     @Input() percent: number;


    constructor() {

    }

    ngOnInit() {

    }

}
