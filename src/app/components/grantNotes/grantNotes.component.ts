import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {AttachmentTemplates, Doc, Note, NoteTemplates, Template} from '../../model/dahsboard';
import {User} from "../../model/user";

@Component({
    selector: 'app-grantnotes',
    templateUrl: './grantNotes.component.html',
    styleUrls: ['./grantNotes.component.scss']
})
export class GrantNotesComponent implements OnInit {

    passedNotesInfo: NoteTemplates;

    @ViewChild("scrollContainer") scrollContainer: ElementRef;
    @ViewChild("inputMessage") inputMessage: ElementRef;

    constructor(
        private _bottomSheetRef: MatBottomSheetRef<GrantNotesComponent>
        , @Inject(MAT_BOTTOM_SHEET_DATA) public data: NoteTemplates) {
        this.passedNotesInfo = this.data;
    }

    ngOnInit() {
        console.log(this.data);
    }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    close(status) {
        this._bottomSheetRef.dismiss({'message':this.inputMessage.nativeElement.value, 'result':status});
    }
}
