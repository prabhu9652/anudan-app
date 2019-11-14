import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule} from '@angular/material';
import {Section} from '../../model/dahsboard';


@Component({
  selector: 'app-section-edit',
  templateUrl: './section-edit.component.html',
  styleUrls: ['./section-edit.component.scss']
})
export class SectionEditComponent implements OnInit {

    currentSection: Section;

    @ViewChild("sectionNameField") sectionNameField: ElementRef;

  constructor(
        public dialogRef: MatDialogRef<SectionEditComponent>,
        @Inject(MAT_DIALOG_DATA) public section: Section) {
            this.currentSection = section;
        }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
  const val = this.sectionNameField.nativeElement.value;
  console.log(val);
    this.dialogRef.close(val);
  }
}
