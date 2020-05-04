import { Component, OnInit } from '@angular/core';
import {AppComponent} from'../../app.component'
declare var require: any

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test : Date = new Date();
  logoUrl = "/api/public/images/ANUDAN/logo";


  constructor(
    public appComp: AppComponent
  ) { }

  ngOnInit() {
  }

}
