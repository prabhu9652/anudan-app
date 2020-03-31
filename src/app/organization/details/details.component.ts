import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';


@Component({
  selector: 'organization-details-dashboard',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {


    constructor(
        public appComp: AppComponent
    ){}

    ngOnInit() {
        this.appComp.subMenu = {name:'Organization Details'};
    }

}
