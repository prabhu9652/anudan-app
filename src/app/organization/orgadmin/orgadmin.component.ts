import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';


@Component({
  selector: 'organization-admin-dashboard',
  templateUrl: './orgadmin.component.html',
  styleUrls: ['./orgadmin.component.css']
})
export class OrgadminComponent implements OnInit {

    constructor(
        public appComp: AppComponent
    ){}

    ngOnInit() {
        this.appComp.subMenu = {name:'Organization Admin'};
    }


}
