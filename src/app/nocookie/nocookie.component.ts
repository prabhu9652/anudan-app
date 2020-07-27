import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nocookie',
  templateUrl: './nocookie.component.html',
  styleUrls: ['./nocookie.component.scss']
})
export class NocookieComponent implements OnInit {

  logoUrl = "/api/public/images/ANUDAN/logo";
  constructor(private router: Router) { }

  ngOnInit() {

  }

  goToLogin() {
    //this.router.navigate(['/']);
    window.location.href = "/";
  }

}
