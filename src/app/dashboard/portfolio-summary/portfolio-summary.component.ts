import {Component, OnInit,Input,OnChanges, SimpleChanges, SimpleChange } from '@angular/core';


@Component({
  selector: 'app-portfolio-summary',
  templateUrl: './portfolio-summary.component.html',
  styleUrls: ['./portfolio-summary.component.css']
})
export class PortfolioSummaryComponent implements OnInit, OnChanges  {

     @Input() data: any;
     @Input() name: string;
     @Input() display:boolean;

     selected:any={name:'Loading...'};
     portfolioData:any;
     portfolioProgessData:any;
     portfolioDetailData:any;


    constructor() {

    }

    ngOnInit() {
        console.log('here');
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property === 'data') {
                console.log('data changed');
                if(this.data){
                    this.display = true;
                    this.selected = this.data[0];
                    this.portfolioData = this.data[0];
                    this.portfolioProgessData = this.data[0];
                    this.portfolioDetailData = this.data[0].details;
                }
            }
        }
    }

}
