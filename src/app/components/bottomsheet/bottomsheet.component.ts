import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {FileTemplates, Template} from '../../model/dahsboard';

@Component({
  selector: 'app-bottomsheet',
  templateUrl: './bottomsheet.component.html',
  styleUrls: ['./bottomsheet.component.scss']
})
export class BottomsheetComponent implements OnInit {

  passedTemplatesInfo: FileTemplates;

  constructor(
      private _bottomSheetRef: MatBottomSheetRef<BottomsheetComponent>
  , @Inject(MAT_BOTTOM_SHEET_DATA) public data: FileTemplates) {
    this.passedTemplatesInfo = this.data;
  }

  ngOnInit() {
    this._bottomSheetRef.afterOpened().subscribe(result => {
      console.log(this.data);
    })
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

      const newTemplate = new Template();
      const id = 0 - Math.round(Math.random() * 10000000000);
      newTemplate.id = id;
      reader.constructor(id);
      newTemplate.name = file.name;
      newTemplate.fileType = file.name.substr(file.name.lastIndexOf('.') + 1);
      newTemplate.type = this.data.type;
      this.passedTemplatesInfo.templates.push(newTemplate);

      reader.onloadend = () => {
        console.log('>>>>>>>>  ' + newTemplate.id);
        for (const tmplt of this.passedTemplatesInfo.templates) {
          if (tmplt.id === newTemplate.id) {
            tmplt.data = reader.result.toString();
          }
        }
      }

      reader.readAsDataURL(file);
    }
  }

}
