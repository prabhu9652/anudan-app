import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Report } from './model/report'
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReportDataService {

  url: string = "/api/user/%USERID%/report";

  private messageSource = new BehaviorSubject<Report[]>(null);
  currentMessage = this.messageSource.asObservable();

  constructor(private httpClient: HttpClient, public userService: UserService) { }

  changeMessage(message: Report[]) {
    this.messageSource.next(message)
  }

  deleteReport(report: Report): Promise<void> {
    if (report !== undefined && report !== null) {
      return this.httpClient
        .delete(
          this.getUrl() + "/" + report.id,
          this.getHeader()
        )
        .toPromise()
        .then<void>(() => {
          return Promise.resolve();
        })
        .catch((err) => {
          return Promise.reject(
            "Unable to delete the disbursement"
          );
        });
    } else {
      return Promise.resolve(null);
    }
  }

  private getHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };
    return httpOptions;
  }
  private getUrl(): string {
    const user = this.userService.getUser();
    if (user !== undefined) {
      return this.url.replace("%USERID%", user.id);
    }
  }

}
