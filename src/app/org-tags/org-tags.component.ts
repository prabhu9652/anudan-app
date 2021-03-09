import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MessagingComponent } from './../components/messaging/messaging.component';
import { MatDialog } from '@angular/material';
import { Tag } from './../model/dahsboard';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-org-tags',
  templateUrl: './org-tags.component.html',
  styleUrls: ['./org-tags.component.scss']
})
export class OrgTagsComponent implements OnInit {

  @Input('tags') tags: Tag[] = [];

  constructor(private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
  }

  addTag(ev) {
    if (this.tags.filter(t => t.name === ev.currentTarget.value).length > 0) {
      const dg = this.dialog.open(MessagingComponent, {
        data: "Tag already exists"
      });

      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };

    this.http.post("api/admin/tags/" + ev.currentTarget.value, {}, httpOptions).subscribe((result: Tag) => {

      this.tags.push(result);
      ev.currentTarget.value = null;
    });


  }

}
