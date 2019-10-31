import {Component, Inject, OnInit, ViewChild, ElementRef, Renderer2, HostListener} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {Grant, GrantHistory,Notifications} from '../../model/dahsboard';
import {WorkflowTransition} from '../../model/workflow-transition';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';

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

  constructor(
    public dialogRef: MatDialogRef<NotificationspopupComponent>
     , @Inject(MAT_DIALOG_DATA) public notifications: Notifications[]
     , private http: HttpClient
     , private renderer: Renderer2
     , @Inject(ElementRef)er: ElementRef
     ) {
    this.dialogRef.disableClose = false;
    this.messages = notifications;
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

}
