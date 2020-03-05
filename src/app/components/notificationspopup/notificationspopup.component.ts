import {Component, Inject, OnInit, ViewChild, ElementRef, Renderer2, HostListener} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {Grant, GrantHistory,Notifications} from '../../model/dahsboard';
import {WorkflowTransition} from '../../model/workflow-transition';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import { Router} from '@angular/router';
import {GrantDataService} from '../../grant.data.service';



declare var $: any;
declare var jsPlumb: any;


@Component({
  selector: 'app-notificationspopup-dialog',
  templateUrl: './notificationspopup.component.html',
  styleUrls: ['./notificationspopup.component.scss']
})
export class NotificationspopupComponent implements OnInit {

    messages: Notifications[]=[];
    langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
    humanizer: HumanizeDuration = new HumanizeDuration(this.langService);
    expanded: boolean = false;
    notifications: Notifications[];

  constructor(
    public dialogRef: MatDialogRef<NotificationspopupComponent>
     , @Inject(MAT_DIALOG_DATA) public notificationsData: any
     , private http: HttpClient
     , private renderer: Renderer2
     , @Inject(ElementRef)er: ElementRef
     , private router: Router
     , private grantData: GrantDataService
     ) {
     this.notifications = notificationsData.notifs;
    this.dialogRef.disableClose = false;
    this.messages = this.notifications;
  }


  ngOnInit() {

  }

 onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(false);
  }

getHumanTime(notification): string{
    var time = new Date().getTime() - new Date(notification.postedOn).getTime();
    return this.humanizer.humanize(time, { largest: 1, round: true})
    }

manageGrant(notification: Notifications){
    this.dialogRef.close({result:true, notificationFor:'GRANT', data: notification});
}

manageReport(notification: Notifications){
    this.dialogRef.close({result:true, notificationFor:'REPORT', data: notification});
}

    markAsRead(ev:any,notification:Notifications){
        this.expanded = !this.expanded;

        if(this.expanded){
            const httpOptions = {
                                    headers: new HttpHeaders({
                                        'Content-Type': 'application/json',
                                        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                                        'Authorization': localStorage.getItem('AUTH_TOKEN')
                                    })
                                };
                           let url = '/api/user/' + this.notificationsData.user.id + '/notifications/markread/'
                                                  + notification.id;

                            this.http.put<Notifications>(url,{},httpOptions).subscribe((notif: Notifications) => {
                                notification.read=true;// = notif;
                                });
        }
    }
}
