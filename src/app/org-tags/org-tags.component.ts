import { FieldDialogComponent } from './../components/field-dialog/field-dialog.component';
import { AppComponent } from 'app/app.component';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MessagingComponent } from './../components/messaging/messaging.component';
import { MatDialog } from '@angular/material';
import { OrgTag } from './../model/dahsboard';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-org-tags',
  templateUrl: './org-tags.component.html',
  styleUrls: ['./org-tags.component.scss']
})
export class OrgTagsComponent implements OnInit {

  @Input('tags') tags: OrgTag[] = [];
  tagBeingEdited = 0;

  constructor(private dialog: MatDialog, private http: HttpClient, private appComp: AppComponent) { }

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

    this.http.post("api/admin/tags/" + ev.currentTarget.value, {}, httpOptions).subscribe((result: OrgTag) => {

      this.tags.push(result);
      ev.target.value = null;
    });
  }

  disableTag(tag: OrgTag) {

    const dg = this.dialog.open(FieldDialogComponent, {
      data: { title: "Are you sure you want to disable the tag '" + tag.name + "'?", btnMain: "Disable Tag", btnSecondary: "Not Now" },
      panelClass: "grant-template-class",
    });

    dg.afterClosed().subscribe(result => {
      if (result) {
        tag.disabled = true;

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
            Authorization: localStorage.getItem("AUTH_TOKEN"),
          }),
        };

        this.http.put("api/admin/user/" + this.appComp.loggedInUser.id + "/tags", tag, httpOptions).subscribe((updatedTag: OrgTag) => {
          tag = updatedTag;
        });
      } else {
        dg.close();
      }
    });

  }

  enableTag(tag) {

    tag.disabled = false;

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };

    this.http.put("api/admin/user/" + this.appComp.loggedInUser.id + "/tags", tag, httpOptions).subscribe((updatedTag: OrgTag) => {
      tag = updatedTag;
    });
  }


  deleteTag(tag: OrgTag) {

    const dg = this.dialog.open(FieldDialogComponent, {
      data: { title: "Are you sure you want to delete the tag '" + tag.name + "'?", btnMain: "Delete Tag", btnSecondary: "Not Now" },
      panelClass: "grant-template-class",
    });

    dg.afterClosed().subscribe(result => {
      if (result) {
        tag.disabled = true;

        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
            Authorization: localStorage.getItem("AUTH_TOKEN"),
          }),
        };

        this.http.delete("api/admin/user/" + this.appComp.loggedInUser.id + "/tags/" + tag.id, httpOptions).subscribe((updatedTag: OrgTag) => {
          const idx = this.tags.findIndex(t => t.id === tag.id);
          if (idx > -1) {
            this.tags.splice(idx, 1);
          }
        });
      } else {
        dg.close();
      }
    });

  }

  editTag(tag: OrgTag, event) {
    this.tagBeingEdited = tag.id;
  }

  saveTag(tag) {

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };

    this.http.put("api/admin/user/" + this.appComp.loggedInUser.id + "/tags", tag, httpOptions).subscribe((updatedTag: OrgTag) => {
      tag = updatedTag;
      this.tagBeingEdited = 0;
    });
  }
}
