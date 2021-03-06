import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap, NavigationEnd} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {



  constructor(private router: Router) {
    this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          console.log(e.url);
        }
    });
  }

  ngOnInit() {

    console.log('here');

  }

}
