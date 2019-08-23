import { Component, OnInit, ViewChild, AfterViewInit,HostListener } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import 'rxjs/add/operator/filter';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import PerfectScrollbar from 'perfect-scrollbar';
import { CarouselComponent} from 'angular-bootstrap-md';
import {GrantDataService} from '../../grant.data.service';
import {DataService} from '../../data.service';
import {Grant} from '../../model/dahsboard';
import {AppComponent} from '../../app.component';
import {GrantComponent} from "../../grant/grant.component";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {interval, Subject} from 'rxjs';





@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  providers: [GrantComponent]
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
  userActivity;
  userInactive: Subject<any> = new Subject();

  constructor(private grantComponent: GrantComponent, private grantData: GrantDataService, public appComponent: AppComponent, public location: Location, private router: Router, private activatedRoute: ActivatedRoute, private dataService: DataService,private http: HttpClient,) {
    this.setTimeout();
    this.userInactive.subscribe(() => console.log('user has been inactive for 3s'));
  }

  ngOnInit() {
  this.dataService.currentMessage.subscribe(id => this.currentGrantId = id);

  
  /*this.subscription = interval(20000).subscribe(t => {

      
     
        this.grantToUpdate = JSON.parse(JSON.stringify(this.currentGrant));
        if(this.currentGrant !== null){
          this.grantComponent.checkGrantPermissions();
        }
        if(this.currentGrant !== null && this.currentGrant.name !== undefined){
          this.grantToUpdate.id = this.currentGrantId;
          this.grantComponent.saveGrant(this.grantToUpdate);
        }
        
      
    });*/

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
                console.log(this.appComponent.notifications);

              });
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
      this.grantComponent.saveGrant(this.grantToUpdate);
    }

    this.appComponent.currentView = 'grants';
    this.router.navigate(['grants']);
  }

  setTimeout() {
    this.userActivity = setTimeout(() => {
    this.userInactive.next(undefined);

        this.grantToUpdate = JSON.parse(JSON.stringify(this.currentGrant));
        if(this.currentGrant !== null){
          this.grantComponent.checkGrantPermissions();
        }
        if(this.currentGrant !== null && this.currentGrant.name !== undefined){
          this.grantToUpdate.id = this.currentGrantId;
          this.grantComponent.saveGrant(this.grantToUpdate);
        }
    }, 3000);
    
  }

  //@HostListener('window:mousemove')
  @HostListener('window:keyup', ['$event'])
  //@HostListener('window:scroll', ['$event'])
  @HostListener('document:click', ['$event'])
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

}
