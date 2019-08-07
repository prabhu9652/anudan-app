import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/grants', title: 'Grants',  icon: 'dashboard', class: '' }/*,
  { path: '/user-profile', title: 'Administration',  icon:'person', class: '' },
  { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
  { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
  { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
  { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
  { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
  { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },*/
];

export const GRANT_ROUTES: RouteInfo[] = [
    { path: '/grant/basic-details', title: 'Grant Basics',  icon: 'description', class: '' },
    { path: '/grant/sections', title: 'Sections',  icon: 'view_agenda', class: '' },
    { path: '/grant/reporting', title: 'Monitoring & Evaluation',  icon: 'assessment', class: '' },
    { path: '/grant/preview', title: 'Preview & Submit',  icon: 'done', class: '' }
];

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
  adminMenuItems: any[];

  constructor(public appComponent: AppComponent, private router: Router) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.grantMenuItems = GRANT_ROUTES.filter(menuItem => menuItem);
    this.adminMenuItems = ADMIN_ROUTES.filter(menuItem => menuItem);
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




