import { AdminService } from './../../admin.service';
import { TemplateLibrary, AttachmentDownloadRequest } from './../../model/dahsboard';
import { FieldDialogComponent } from './../../components/field-dialog/field-dialog.component';
import { MatDialog } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from 'app/app.component';
import { Role } from './../../model/user';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-document-library',
  templateUrl: './document-library.component.html',
  styleUrls: ['./document-library.component.scss']
})
export class DocumentLibraryComponent implements OnInit {

  @Input('docs') docs: TemplateLibrary[];
  focusField: any;
  roleName: string;
  roleDescription: string;
  roleExists: boolean = false;
  existingRole: Role;
  docNameText: any;
  docName: string;
  docDescription: string;
  itemsSelected: boolean = false;
  @ViewChild("uploadFile") uploadFile: ElementRef;


  @ViewChild('createRoleBtn') createRoleBtn: ElementRef;

  constructor(private appComponent: AppComponent, private http: HttpClient, private dialog: MatDialog, private adminService: AdminService, private elem: ElementRef) { }

  ngOnInit() {
    console.log(this.docs);
  }
  handleSelection(doc) {
    const elems = this.elem.nativeElement.querySelectorAll(
      '[id^="attachment_"]'
    );
    if (elems.length > 0) {
      for (let singleElem of elems) {
        if (singleElem.checked) {
          this.elem.nativeElement.querySelector(
            '[id="attachments_download"]'
          ).disabled = false;
          this.elem.nativeElement.querySelector(
            '[id="attachments_delete"]'
          ).disabled = false;
          return;
        }
        this.elem.nativeElement.querySelector(
          '[id^="attachments_download"]'
        ).disabled = true;
        this.elem.nativeElement.querySelector(
          '[id^="attachments_delete"]'
        ).disabled = true;
      }
    }
  }


  downloadSelection() {
    const elems = this.elem.nativeElement.querySelectorAll(
      '[id^="attachment_"]'
    );
    const selectedAttachments = new AttachmentDownloadRequest();
    if (elems.length > 0) {
      selectedAttachments.attachmentIds = [];
      for (let singleElem of elems) {
        if (singleElem.checked) {
          selectedAttachments.attachmentIds.push(singleElem.id.split("_")[1]);
        }
      }

      this.adminService.downloadSelectedLibraryDocs(this.appComponent.loggedInUser, selectedAttachments).then((data) => {
        saveAs(data, "document-library.zip");
      });

    }
  }


  deleteSelection() {

    const dReg = this.dialog.open(FieldDialogComponent, {
      data: { title: 'Are you sure you want to delete the selected document(s)?' },
      panelClass: 'center-class'
    });

    dReg.afterClosed().subscribe(result => {
      if (result) {
        const elems = this.elem.nativeElement.querySelectorAll(
          '[id^="attachment_"]'
        );
        const selectedAttachments = new AttachmentDownloadRequest();
        if (elems.length > 0) {
          selectedAttachments.attachmentIds = [];
          for (let singleElem of elems) {
            if (singleElem.checked) {
              selectedAttachments.attachmentIds.push(singleElem.id.split("_")[1]);
            }
          }

          this.adminService.deleteSelectedLibraryDocs(this.appComponent.loggedInUser, selectedAttachments).then(() => {
            for (let a of selectedAttachments.attachmentIds) {
              const index = this.docs.findIndex(d => d.id === a);
              this.docs.splice(index, 1);
            }
          });
        }
      } else {
        dReg.close();
      }
    });


  }

  canCreateDoc() {
    if (this.docName && this.docName.trim() != "" && this.docNameText && this.docNameText.trim() != "") {
      return false;
    } else {
      return true;
    }
  }

  editDoc(doc: TemplateLibrary, $event) {
    doc.editMode = true;
    $('#role_' + doc.id).css('background', '#f6f6f6')
  }

  cancelEdit(doc: TemplateLibrary) {
    doc.editMode = false;
  }

  processSelectedFile(ev) {

    const file: File = ev.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.saveDoc(file);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

  }

  saveDoc(file: File) {
    const files = this.uploadFile.nativeElement.files;
    let formData = new FormData();
    formData.append("file", file);

    formData.append("docName", file.name);
    formData.append("docDescription", file.name);

    this.adminService.saveLibraryDoc(this.appComponent.loggedInUser, formData).then((result: TemplateLibrary) => {
      this.docs.unshift(result);
    });

  }
  /* canCreateRole() {
    if ((this.roleName !== undefined && this.roleName.trim() !== '') && !this.existingRole) {
      return false;
    } else {
      return true;
    }

  } */

  /* validateRole(ev) {
    const role = ev.target.value;
    if (role === undefined || role === null || (role !== null && role.trim() === '')) {
      return;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };
    const user = this.appComponent.loggedInUser;
    const url = 'api/admin/user/' + user.id + '/role/validate';

    this.http.post(url, { roleName: role }, httpOptions).subscribe((result: any) => {
      this.existingRole = result.exists;
    });
  } */
}
