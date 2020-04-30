import {Component, OnInit,Input,OnChanges, SimpleChanges, SimpleChange} from '@angular/core';


@Component({
  selector: 'app-summary-centered',
  templateUrl: './summary-centered.component.html',
  styleUrls: ['./summary-centered.component.css']
})
export class SummaryCenteredComponent implements OnInit,OnChanges {

     @Input() data: any;
     @Input() display: boolean = false;

     heading:string;
     caption:string;
     subCaption:string;

    constructor() {

    }

    ngOnInit() {
        console.log("summary centered");
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if(property === 'data'){
                if(this.data){
                    this.display = true;
                    this.heading = this.data.totalGrants;
                    this.caption = this.data.name;
                    this.subCaption = this.data.period;
                }
            }
        }
    }

}
