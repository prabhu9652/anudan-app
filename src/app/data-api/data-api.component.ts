import { AppComponent } from './../app.component';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-data-api',
  templateUrl: './data-api.component.html',
  styleUrls: ['./data-api.component.scss'],
  styles: [
    `
      ::ng-deep .mat-list-base .mat-list-item {
        height: 28px !important;
      }
    `,
  ],
})
export class DataApiComponent implements OnInit {

  constructor(private httpClient: HttpClient, private appComp: AppComponent) { }

  ngOnInit() {
  }

  downloadGrantsData() {

    this.httpClient.post('/api/user/' + this.appComp.loggedInUser.id + '/grant/data/', {}, this.getHeader()).subscribe((result) => {
      saveAs(
        result,
        this.appComp.loggedInUser.organization.name +
        "_Grant_data" +
        ".zip"
      );
    });
  }

  private getHeader() {
    const httpOptions = {
      responseType: "blob" as "json",
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),

    };
    return httpOptions;
  }
}
