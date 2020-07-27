import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nocookie',
  templateUrl: './nocookie.component.html',
  styleUrls: ['./nocookie.component.scss']
})
export class NocookieComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  goToLogin() {
    this.router.navigate(['/']);
  }

}
