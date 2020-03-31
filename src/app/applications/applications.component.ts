import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';


@Component({
  selector: 'applications-dashboard',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

constructor(
        public appComp: AppComponent
    ){}

    ngOnInit() {
        this.appComp.subMenu = {name:''};
    }
}
