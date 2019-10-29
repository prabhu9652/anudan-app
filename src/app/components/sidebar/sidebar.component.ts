import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {AppComponent} from '../../app.component';
import {Router, ActivatedRoute} from '@angular/router';
import {GrantDataService} from '../../grant.data.service';
import {Grant} from '../../model/dahsboard';
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import {CdkDragDrop,CdkDragStart, moveItemInArray} from '@angular/cdk/drag-drop';

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
  private elRef: ElementRef
  ) {
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
  /* $("#messagepopover").html('');
  this.appComponent.hasUnreadMessages = false;
  this.appComponent.unreadMessages = 0;
  if(this.appComponent.notifications.length === 0){
    $("#messagepopover").append('<p>No messages</p>');
  }else{
    for(let i=0; i< this.appComponent.notifications.length;i++){
      
        const posted = this.appComponent.notifications[i].postedOn;
       
        var time = new Date().getTime() - new Date(posted).getTime();
        
        if(!this.appComponent.notifications[i].grantId){
            $("#messagepopover").append('<div class="row pb-3" style="border-bottom: 1px inset #727272;"><div class="col-12"><p class="m-0">'+this.appComponent.notifications[i].message+'</p><small>'+this.humanizer.humanize(time, { largest: 1, round: true}) + ' ago</small></div></div>');
        }else{
            $("#messagepopover").append('<div class="row pb-3" style="border-bottom: 1px inset #727272;"><div class="col-12"><a id="messageForGrant_'+this.appComponent.notifications[i].grantId+'" class="m-0 text-primary messageWithLink" data-grantId='+ this.appComponent.notifications[i].grantId + '><b>'+this.appComponent.notifications[i].message+'</b></a><small>'+this.humanizer.humanize(time, { largest: 1, round: true}) + ' ago</small></div></div>');
        }
    }
  } */
  
  
  if($("#messagepopover").css('display')==='none'){
    $("#messagepopover").css('display','block');
  }else{
    $("#messagepopover").css('display','none');
  }
  
  }

  messageRead() {
    console.log("Read");
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




