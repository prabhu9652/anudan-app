import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';


@Component({
  selector: 'rfps-dashboard',
  templateUrl: './rfps.component.html',
  styleUrls: ['./rfps.component.css']
})
export class RfpsComponent implements OnInit {

    constructor(
        public appComp: AppComponent
    ){}

    ngOnInit() {
        this.appComp.subMenu = {name:''};
    }


}
