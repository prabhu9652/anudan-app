import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {AttachmentTemplates, Doc, Template} from '../../model/dahsboard';

@Component({
  selector: 'app-bottomsheetattachments',
  templateUrl: './bottomsheetAttachments.component.html',
  styleUrls: ['./bottomsheetAttachments.component.scss']
})
export class BottomsheetAttachmentsComponent implements OnInit {

  passedDocsInfo: AttachmentTemplates;

  constructor(
      private _bottomSheetRef: MatBottomSheetRef<BottomsheetAttachmentsComponent>
      , @Inject(MAT_BOTTOM_SHEET_DATA) public data: AttachmentTemplates) {
    this.passedDocsInfo = this.data;
  }

  ngOnInit() {
    console.log(this.data);
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  close() {
    this._bottomSheetRef.dismiss();
  }

  processFile(event) {
    const files = event.target.files;

    for (const file of files) {

      const reader: FileReader = new FileReader();

      const newDoc = new Doc();
      const id = 0 - Math.round(Math.random() * 10000000000);
      newDoc.id = id;
      newDoc.fileName = file.name;
      newDoc.fileType = file.name.substr(file.name.lastIndexOf('.') + 1);
      this.passedDocsInfo.docs.push(newDoc);

      reader.onloadend = () => {
        console.log('>>>>>>>>  ' + newDoc.id);
        for (const tmplt of this.passedDocsInfo.docs) {
          if (tmplt.id === newDoc.id) {
            tmplt.data = reader.result.toString();
          }
        }
      }

      reader.readAsDataURL(file);
    }
  }

}
