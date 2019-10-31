import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {AppComponent} from '../../app.component';
import {Router, ActivatedRoute} from '@angular/router';
import {GrantDataService} from '../../grant.data.service';
import {Grant, Notifications} from '../../model/dahsboard';
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import {CdkDragDrop,CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material';
import {NotificationspopupComponent} from '../../components/notificationspopup/notificationspopup.component';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';



declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/organization', title: 'Organization',  icon: 'organization.svg', class: '' },
  { path: '/rfps', title: 'RFPs',  icon: 'rfp.svg', class: '' },
  { path: '/applications', title: 'Applications',  icon: 'proposal.svg', class: '' },
  { path: '/grants', title: 'Grants',  icon: 'grant.svg', class: '' },
  { path: '/reports', title: 'Reports',  icon: 'report.svg', class: '' },
  { path: '/disbursements', title: 'Disbursements',  icon: 'disbursement.svg', class: '' },
  /*,
  { path: '/user-profile', title: 'Administration',  icon:'person', class: '' },
  { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
  { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
  { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
  { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
  { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
  { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },*/
];

export const GRANT_ROUTES: RouteInfo[] = [
    { path: '/grant/basic-details', title: 'Grant Header',  icon: 'grant.svg', class: '' },
    { path: '/grant/sections', title: 'Grant Details',  icon: 'view_agenda', class: '' },
    { path: '/grant/preview', title: 'Preview & Submit',  icon: 'preview.svg', class: '' }
];

export const PLATFORM_ROUTES: RouteInfo[] = [
    { path: '/admin/tenants', title: 'Tenants',  icon: 'grant.svg', class: '' }
];


export const ORGANIZATION_ROUTES: RouteInfo[] = [
  { path: '/organization/details', title: 'Details',  icon: 'stop', class: '' },
  { path: '/organization/administration', title: 'Administration',  icon: 'stop', class: '' },
];
export let SECTION_ROUTES: RouteInfo[] = [];

export const ADMIN_ROUTES: RouteInfo[] = [
    { path: '/workflow-management', title: 'Manage Workflows',  icon:'person', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  styles: [`
        ::ng-deep .profilearea > .mat-expansion-indicator:after {
          transform: rotate(225deg) !important;
          border-width: 0 1px 1px 0 !important;
        }

        ::ng-deep .cdk-global-overlay-wrapper{
            align-items: flex-start !important;
            justify-content: flex-start !important;
        }


        ::ng-deep .mat-expansion-indicator::after {
            color: #424652 !important;
        }
      `]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  grantMenuItems: any[];
  sectionMenuItems: any[];
  adminMenuItems: any[];
  platformMenuItems: any[];
  orgMenuItems: any[];
  currentGrant: Grant;
  hasUnreadMessages = false;
  unreadMessages = 0;
  langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
  humanizer: HumanizeDuration = new HumanizeDuration(this.langService);

  action: number;
  sub: any;


  constructor(public appComponent: AppComponent,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private grantData: GrantDataService,
  private ref:ChangeDetectorRef,
  private elRef: ElementRef,
  private dialog: MatDialog,
  private http: HttpClient) {
  }

drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sectionMenuItems, event.previousIndex, event.currentIndex);
    event.item.element.nativeElement.classList.remove('section-dragging');
    for(let i=0; i<this.sectionMenuItems.length;i++){
        for(let section of this.currentGrant.grantDetails.sections){
            if(section.sectionName === this.sectionMenuItems[i].title){
                section.order = i+1;
            }
        }
    }
    this.grantData.changeMessage(this.currentGrant);

  }
    dragStarted(event: CdkDragStart<String[]>){
       event.source.element.nativeElement.style.zIndex='1070';
    }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.grantMenuItems = GRANT_ROUTES.filter(menuItem => menuItem);
    this.adminMenuItems = ADMIN_ROUTES.filter(menuItem => menuItem);
    this.orgMenuItems = ORGANIZATION_ROUTES.filter(menuItem => menuItem);
    this.platformMenuItems = PLATFORM_ROUTES.filter(menuItem => menuItem);
    this.ref.detectChanges();
    this.grantData.currentMessage.subscribe((grant) => {
      this.currentGrant = grant;
      this.buildSectionsSideNav();
    });



    if(this.currentGrant && (this.currentGrant.grantStatus.internalStatus=='ACTIVE' || this.currentGrant.grantStatus.internalStatus=='CLOSED')){
      this.appComponent.action = 'preview';
    }
    
  }


  showMessages(){

  const dialogRef = this.dialog.open(NotificationspopupComponent, {
           data: this.appComponent.notifications,
           panelClass: 'notifications-class'
        });

        dialogRef.afterClosed().subscribe(result => {
                  if(!result){
                    return;
                  }
                  if (result.result) {
                    this.manageGrant(result.data,result.data.grantId);
                  }
                  });

  }

  messageRead() {
    console.log("Read");
  }

  manageGrant(notification: Notifications, grantId: number) {
          const httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                  'Authorization': localStorage.getItem('AUTH_TOKEN')
              })
          };
     let url = '/api/user/' + this.appComponent.loggedInUser.id + '/notifications/markread/'
                            + notification.id;

      this.http.put<Notifications>(url,{},httpOptions).subscribe((notif: Notifications) => {
          notification = notif;
          const httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                  'Authorization': localStorage.getItem('AUTH_TOKEN')
              })
          };

          url = '/api/user/' + this.appComponent.loggedInUser.id + '/grant/' + grantId;
          this.http.get(url,httpOptions).subscribe((grant:Grant) =>{
          let localgrant = this.appComponent.currentTenant.grants.filter(g => g.id=grantId)[0];
          if(localgrant){
          localgrant = grant;
          }else{
              this.appComponent.currentTenant.grants.push(grant);
          }
            this.grantData.changeMessage(grant);
            this.appComponent.originalGrant = JSON.parse(JSON.stringify(grant));;
            this.appComponent.currentView = 'grant';

                    this.appComponent.selectedTemplate = grant.grantTemplate;

            if(grant.grantStatus.internalStatus!='ACTIVE' && grant.grantStatus.internalStatus!='CLOSED'){
                this.router.navigate(['grant/basic-details']);
            } else{
                this.appComponent.action = 'preview';
                this.router.navigate(['grant/preview']);
            }
            $("#messagepopover").css('display','none');
          });
      });
}

  buildSectionsSideNav(): string {
  this.grantData.currentMessage.subscribe(grant => this.currentGrant = grant);
  SECTION_ROUTES = [];
  if(this.appComponent.currentView === 'grant' && this.currentGrant && (SECTION_ROUTES.length === 0 || this.appComponent.sectionAdded === true || this.appComponent.sectionUpdated === true)){
      this.sectionMenuItems = [];
      SECTION_ROUTES = [];
      this.currentGrant.grantDetails.sections.sort((a, b) => (a.order > b.order) ? 1 : -1)
      for (let section of this.currentGrant.grantDetails.sections){
        if(section.sectionName!=='' && section.sectionName!=='_'){
            SECTION_ROUTES.push({path: '/grant/section/' + section.sectionName.replace(/[^0-9a-z]/gi, ''),title: section.sectionName, icon: 'stop', class:''});
        }else{
            SECTION_ROUTES.push({path: '/grant/section/'+section.id,title: '_', icon: 'stop', class:''});
        }
      }

      this.sectionMenuItems = SECTION_ROUTES.filter(menuItem => menuItem);
      this.appComponent.sectionAdded = false;
      return SECTION_ROUTES[0].path;
    }
  }


  isMobileMenu() {
      if ($(window).width() > 6000) {
          return false;
      }
      return true;
  };

  showProfile() {
    this.appComponent.currentView = 'user-profile'
    this.router.navigate(['user-profile']);
  }

  createNewSection(){
    this.appComponent.createNewSection.next(true);
  }
}




