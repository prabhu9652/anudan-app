import { Component, OnInit } from '@angular/core';
import {AppComponent} from'../../app.component'
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  test : Date = new Date();
  
  constructor(
    public appComp: AppComponent
  ) { }

  ngOnInit() {
  }

}
