import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule } from '@angular/material';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DocInfo, AttachmentDownloadRequest } from 'app/model/dahsboard';
import { ProjectDoc } from 'app/model/project-doc';

@Component({
  selector: 'project-documents-dialog',
  templateUrl: './project-documents.component.html',
  styleUrls: ['./project-documents.component.scss']
})
export class ProjectDocumentsComponent implements OnInit {


  projectDocs: ProjectDoc[] = [];

  constructor(public dialogRef: MatDialogRef<ProjectDocumentsComponent>
    , @Inject(MAT_DIALOG_DATA) public message: any,
    private http: HttpClient,
    private elem: ElementRef) {
    this.dialogRef.disableClose = true;

    const endpoint =
      "/api/user/" +
      this.message.loggedInUser.id +
      "/grant/" +
      this.message.currentGrant.id +
      "/documents";

    const httpOptions = {
      headers: new HttpHeaders({
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };

    this.http
      .get(endpoint, httpOptions)
      .subscribe((info: ProjectDoc[]) => {
        this.projectDocs = info;
      });
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

  processSelectedFiles(ev) {
    const files = ev.target.files;

    const endpoint =
      "/api/user/" +
      this.message.loggedInUser.id +
      "/grant/" +
      this.message.currentGrant.id +
      "/documents/upload";
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files.item(i));
    }

    console.log(">>>>" + JSON.stringify(this.message.currentGrant));

    const httpOptions = {
      headers: new HttpHeaders({
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };

    this.http
      .post<ProjectDoc[]>(endpoint, formData, httpOptions)
      .subscribe((info: ProjectDoc[]) => {
        for (let pDoc of info) {
          this.projectDocs.push(pDoc);
        }
      });
  }


  handleSelection(attachmentId) {
    const elems = this.elem.nativeElement.querySelectorAll(
      '[id^="attachment_' + attachmentId + '"]'
    );
    if (elems.length > 0) {
      for (let singleElem of elems) {
        if (singleElem.checked) {
          this.elem.nativeElement.querySelector(
            '[id="downloadBtn"]'
          ).disabled = false;
          this.elem.nativeElement.querySelector(
            '[id="deleteBtn"]'
          ).disabled = false;
          return;
        }
        this.elem.nativeElement.querySelector(
          '[id="downloadBtn"]'
        ).disabled = true;
        this.elem.nativeElement.querySelector(
          '[id="deleteBtn"]'
        ).disabled = true;
      }
    }
  }

  /*downloadSelection() {
    const elems = this.elem.nativeElement.querySelectorAll(
      '[id^="attachment_"]'
    );
    const selectedAttachments = new AttachmentDownloadRequest();
    if (elems.length > 0) {
      selectedAttachments.attachmentIds = [];
      for (let singleElem of elems) {
        if (singleElem.checked) {
          selectedAttachments.attachmentIds.push(singleElem.id.split("_")[3]);
        }
      }
      const httpOptions = {
        responseType: "blob" as "json",
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
          Authorization: localStorage.getItem("AUTH_TOKEN"),
        }),
      };

      let url =
        "/api/user/" +
        this.appComp.loggedInUser.id +
        "/grant/" +
        this.currentGrant.id +
        "/attachments";
      this.http
        .post(url, selectedAttachments, httpOptions)
        .subscribe((data) => {
          //saveAs(data, this.currentGrant.name + ".zip");
        });
    }
  }*/

  /*deleteSelection(attribId) {

    const dReg = this.dialog.open(FieldDialogComponent, {
      data: { title: 'Are you sure you want to delete the selected document(s)?' },
      panelClass: 'center-class'
    });

    dReg.afterClosed().subscribe(result => {
      if (result) {
        const elems = this.elem.nativeElement.querySelectorAll(
          '[id^="attriute_' + attribId + '_attachment_"]'
        );
        const selectedAttachments = new AttachmentDownloadRequest();
        if (elems.length > 0) {
          selectedAttachments.attachmentIds = [];
          for (let singleElem of elems) {
            if (singleElem.checked) {
              selectedAttachments.attachmentIds.push(singleElem.id.split("_")[3]);
            }
          }
        }
        for (let item of selectedAttachments.attachmentIds) {
          this.deleteAttachment(attribId, item);
        }
      } else {
        dReg.close();
      }
    });

  }*/

  /*deleteAttachment(attributeId, attachmentId) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
        Authorization: localStorage.getItem("AUTH_TOKEN"),
      }),
    };

    const url =
      "/api/user/" +
      this.appComp.loggedInUser.id +
      "/grant/" +
      this.currentGrant.id +
      "/attribute/" +
      attributeId +
      "/attachment/" +
      attachmentId;
    this.http
      .post<Grant>(url, this.currentGrant, httpOptions)
      .subscribe((grant: Grant) => {
        this.grantData.changeMessage(grant, this.appComp.loggedInUser.id);
        this.currentGrant = grant;
        for (let section of this.currentGrant.grantDetails.sections) {
          if (section && section.attributes) {
            for (let attr of section.attributes) {
              if (attributeId === attr.id) {
                if (attr.attachments && attr.attachments.length > 0) {
                  this.newField =
                    "attriute_" +
                    attributeId +
                    "_attachment_" +
                    attr.attachments[attr.attachments.length - 1].id;
                }
              }
            }
          }
        }
      });
  }*/

}
