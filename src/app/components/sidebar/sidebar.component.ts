import { Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {AppComponent} from '../../app.component';
import {Router, ActivatedRoute} from '@angular/router';
import {GrantDataService} from '../../grant.data.service';
import {Grant} from '../../model/dahsboard';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/grants', title: 'Grants',  icon: 'list', class: '' }/*,
  { path: '/user-profile', title: 'Administration',  icon:'person', class: '' },
  { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
  { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
  { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
  { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
  { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
  { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },*/
];

export const GRANT_ROUTES: RouteInfo[] = [
    { path: '/grant/basic-details', title: 'Grant Header',  icon: 'description', class: '' },
    { path: '/grant/sections', title: 'Grant Details',  icon: 'view_agenda', class: '' },
    { path: '/grant/reporting', title: 'Monitoring & Evaluation',  icon: 'assessment', class: '' },
    { path: '/grant/preview', title: 'Preview & Submit',  icon: 'done', class: '' }
];


export let SECTION_ROUTES: RouteInfo[] = [];

export const ADMIN_ROUTES: RouteInfo[] = [
    { path: '/workflow-management', title: 'Manage Workflows',  icon:'person', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  grantMenuItems: any[];
  sectionMenuItems: any[];
  adminMenuItems: any[];
  currentGrant: Grant;

  action: number;
  sub: any;


  constructor(public appComponent: AppComponent, private router: Router, private activatedRoute: ActivatedRoute, private grantData: GrantDataService, private ref:ChangeDetectorRef) {

    
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.grantMenuItems = GRANT_ROUTES.filter(menuItem => menuItem);
    this.adminMenuItems = ADMIN_ROUTES.filter(menuItem => menuItem);
    this.ref.detectChanges();
    this.grantData.currentMessage.subscribe((grant) => {
      this.currentGrant = grant;
      this.buildSectionsSideNav();
    });
    
  }


  showMessages(){
  for(let i=0; i< this.appComponent.notifications.length;i++){
  $("#messagepopover").append('<p>'+this.appComponent.notifications[i].message+'</p>')
  }
  
  $("#messagepopover").css('display','block');
  }


  buildSectionsSideNav() {
  this.grantData.currentMessage.subscribe(grant => this.currentGrant = grant);
  SECTION_ROUTES = [];
  if(this.appComponent.currentView === 'grant' && this.currentGrant && (SECTION_ROUTES.length === 0 || this.appComponent.sectionAdded === true || this.appComponent.sectionUpdated === true)){
      this.sectionMenuItems = [];
      SECTION_ROUTES = [];
      for (let section of this.currentGrant.grantDetails.sections){
        SECTION_ROUTES.push({path: '/grant/section/' + section.sectionName.replace(/[^0-9a-z]/gi, ''),title: section.sectionName, icon: 'description', class:''});
      }
      
      this.sectionMenuItems = SECTION_ROUTES.filter(menuItem => menuItem);
      this.appComponent.sectionAdded = false;
    }
  }
  isMobileMenu() {
      if ($(window).width() > 6000) {
          return false;
      }
      return true;
  };

  showProfile() {
    this.router.navigate(['user-profile']);
  }
}




