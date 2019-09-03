import {Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {GrantTemplate} from '../../model/dahsboard';

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';

@Component({
  selector: 'app-grant-template-dialog',
  templateUrl: './grant-template-dialog.component.html',
  styleUrls: ['./grant-template-dialog.component.scss']
})
export class GrantTemplateDialogComponent implements OnInit {

  @ViewChild('templateHolder') templateHolder: ElementRef;

  constructor(public dialogRef: MatDialogRef<GrantTemplateDialogComponent>
      , @Inject(MAT_DIALOG_DATA) public templates: GrantTemplate[]) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
  const selectedTemplateId = this.templateHolder.nativeElement;
  let selectedTemplate;
    for(let template of this.templates){
        if(template.id === Number(selectedTemplateId.value)){
            selectedTemplate = template;
            break;
        }
    }
    this.dialogRef.close({result:true,selectedTemplate:selectedTemplate});
  }
}
