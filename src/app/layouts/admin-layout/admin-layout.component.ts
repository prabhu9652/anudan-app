import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import { CarouselComponent} from 'angular-bootstrap-md';
import {GrantDataService} from '../../grant.data.service';
import {DataService} from '../../data.service';
import {GrantUpdateService} from '../../grant.update.service';
import {Grant, Notifications} from '../../model/dahsboard';
import {AppComponent} from '../../app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {interval} from 'rxjs';
import {ToastrService,IndividualConfig} from 'ngx-toastr';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  currentGrant: Grant;
  grantToUpdate: Grant;
  private yScrollStack: number[] = [];
  action: any;
  currentGrantId: number;
  subscription: any;
  

  constructor(private grantData: GrantDataService
    , public appComponent: AppComponent
    , public location: Location
    , private router: Router
    , private activatedRoute: ActivatedRoute
    , private dataService: DataService
    , private grantUpdateService: GrantUpdateService
    , private http: HttpClient
    , private toastr:ToastrService) {
    
  }

  ngOnInit() {
  this.dataService.currentMessage.subscribe(id => this.currentGrantId = id);

      this.grantData.currentMessage.subscribe(grant => this.currentGrant = grant);

      const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

      if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
          // if we are on windows OS we activate the perfectScrollbar function

          document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      } else {
          document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      }
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

      this.location.subscribe((ev:PopStateEvent) => {
          this.lastPoppedUrl = ev.url;
      });
       this.router.events.subscribe((event:any) => {
          if (event instanceof NavigationStart) {
             if (event.url != this.lastPoppedUrl)
                 this.yScrollStack.push(window.scrollY);
         } else if (event instanceof NavigationEnd) {
             if (event.url == this.lastPoppedUrl) {
                 this.lastPoppedUrl = undefined;
                 window.scrollTo(0, this.yScrollStack.pop());
             } else
                 window.scrollTo(0, 0);
         }
      });
      this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
           elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;
      });
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
          let ps = new PerfectScrollbar(elemMainPanel);
          ps = new PerfectScrollbar(elemSidebar);
      }


      interval(5000).subscribe(t => {

            if(localStorage.getItem('USER')){
                const url = '/api/user/' + this.appComponent.loggedInUser.id + '/notifications/';
                  const httpOptions = {
                    headers: new HttpHeaders({
                      'Content-Type': 'application/json',
                      'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                      'Authorization': localStorage.getItem('AUTH_TOKEN')
                    })
                  };



                  this.http.get<Notifications[]>(url, httpOptions).subscribe((notifications: Notifications[]) => {
                    this.appComponent.notifications = notifications;
                    this.grantUpdateService.changeMessage(true);
                  },
                     error => {
                       const errorMsg = error as HttpErrorResponse;
                       console.log(error);
                       const x = {'enableHtml': true,'preventDuplicates': true} as Partial<IndividualConfig>;
                       const config: Partial<IndividualConfig> = x;
                       if(errorMsg.error.message==='Token Expired'){
                        this.toastr.error("Your session has expired", 'Logging you out now...', config);
                        setTimeout( () => { this.appComponent.logout(); }, 4000 );
                       } else {
                        this.toastr.error("Oops! We encountered an error.", errorMsg.error.message, config);
                       }


                     });
                  }
                  });
  }

  ngAfterViewInit() {
      this.runOnRouteChange();
  }
  isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }

  showAllGrants() {

    //this.subscription.unsubscribe();
    //this.dataService.changeMessage(0);

    if(this.currentGrant !== null && this.currentGrant.name !== undefined){
      this.grantToUpdate = JSON.parse(JSON.stringify(this.currentGrant));
      this.grantToUpdate.id = this.currentGrantId;
      //this.grantComponent.saveGrant(this.grantToUpdate);
    }

    this.appComponent.currentView = 'grants';
    this.router.navigate(['grants']);
  }

  

}
