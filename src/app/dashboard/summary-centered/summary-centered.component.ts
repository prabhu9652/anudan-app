import {Component, OnInit,Input} from '@angular/core';


@Component({
  selector: 'app-summary-centered',
  templateUrl: './summary-centered.component.html',
  styleUrls: ['./summary-centered.component.css']
})
export class SummaryCenteredComponent implements OnInit {

     @Input() heading: string;
     @Input() caption: string;
     @Input() subCaption: string;
     @Input() disabled: boolean = false;

    constructor() {

    }

    ngOnInit() {

    }

}
