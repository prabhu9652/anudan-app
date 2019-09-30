import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {Grant, AttachmentTemplates, Doc, Note, GrantNote, Template} from '../../model/dahsboard';
import {User} from "../../model/user";

@Component({
    selector: 'app-grantnotes',
    templateUrl: './grantNotes.component.html',
    styleUrls: ['./grantNotes.component.scss']
})
export class GrantNotesComponent implements OnInit {

    passedNotesInfo: GrantNote;
    changes: any[];

    @ViewChild("scrollContainer") scrollContainer: ElementRef;
    @ViewChild("inputMessage") inputMessage: ElementRef;

    constructor(
        private _bottomSheetRef: MatBottomSheetRef<GrantNotesComponent>
        , @Inject(MAT_BOTTOM_SHEET_DATA) public data: GrantNote) {
        this.passedNotesInfo = this.data;
       this.changes = this._diff(data.currentGrant,data.originalGrant);
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

    _diff(newGrant: Grant, oldGrant:Grant):any[] {
        const result = [];
        if(oldGrant.name!==newGrant.name){
            result.push({'name':'Grant Name','change':{'old': oldGrant.name,'new':newGrant.name}});
        }
        if(oldGrant.startDate!==newGrant.startDate){
            result.push({'name':'Grant Start Date','change':{'old': oldGrant.startDate,'new':newGrant.startDate}});
        }
        if(oldGrant.endDate!==newGrant.endDate){
            result.push({'name':'Grant End Date','change':{'old': oldGrant.endDate,'new':newGrant.endDate}});
        }
        if(oldGrant.organization && newGrant.organization){
            if(oldGrant.organization.name!==newGrant.organization.name){
                result.push({'name':'Grantee','change':{'old': oldGrant.organization.name,'new':newGrant.organization.name}});
            }
        }else if(!oldGrant.organization && newGrant.organization){
               result.push({'name':'Grantee','change':{'old': 'New','new':newGrant.organization.name}});
        }else if(oldGrant.organization && !newGrant.organization){
               result.push({'name':'Grantee','change':{'old': oldGrant.organization.name,'new':'Deleted'}});
        }
        if(oldGrant.representative!==newGrant.representative){
            result.push({'name':'Grantee Representative','change':{'old': oldGrant.representative,'new':newGrant.representative}});
        }

        for(const section of oldGrant.grantDetails.sections){
            const currentSection = newGrant.grantDetails.sections.filter((sec) => sec.id===section.id);
            if(currentSection.length>0){
                if(currentSection[0].sectionName !== section.sectionName){
                    result.push({'name':'Grant Section','change':{'old': section.sectionName,'new':currentSection[0].sectionName}});
                }
                if(section.attributes){
                    for(const attr of section.attributes){
                        if(!currentSection[0].attributes){
                            currentSection[0].attributes = [];
                        }
                        const currentAttr = currentSection[0].attributes.filter((attr1 => attr.id===attr1.id));
                        if(currentAttr.length>0){
                            if(currentAttr[0].fieldName!==attr.fieldName){
                                result.push({'name':'Grant Section Attribute','change':{'old': attr.fieldName,'new':currentAttr[0].fieldName}});
                            }
                        }else{
                            result.push({'name':'Grant Section Attribute','change':{'old': attr.fieldName,'new':' -Deleted-'}});
                        }
                    }
                }
                if(currentSection[0].attributes){
                    for(const attr of currentSection[0].attributes){
                        if(!section.attributes){
                            section.attributes = [];
                        }
                        const currentAttr = section.attributes.filter((attr1 => attr.id===attr1.id));
                        if(currentAttr.length===0){

                            result.push({'name':'Grant Section Attribute','change':{'old': '-New-','new':attr.fieldName}});
                        }

                    }
                }
            }else{
                result.push({'name':'Grant Section','change':{'old': section.sectionName,'new':' -Deleted-'}});
            }
        }

        for(const section of newGrant.grantDetails.sections){
            const currentSection = oldGrant.grantDetails.sections.filter((sec) => sec.id===section.id);
            if(currentSection.length===0){
                    result.push({'name':'Grant Section','change':{'old': '-New-','new':section.sectionName}});
            }
         }

        return result;
    }
}
