import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatBottomSheetRef,MatDialogRef} from '@angular/material';
import {Grant, AttachmentTemplates, Doc, Note, GrantNote, Template} from '../../model/dahsboard';
import {User} from "../../model/user";

@Component({
    selector: 'app-grantnotes',
    templateUrl: './grantNotes.component.html',
    styleUrls: ['./grantNotes.component.scss']
})
export class GrantNotesComponent implements OnInit {

    passedNotesInfo: GrantNote;
    changes: any[] = [];

    @ViewChild("scrollContainer") scrollContainer: ElementRef;
    @ViewChild("inputMessage") inputMessage: ElementRef;

    constructor(
        private _bottomSheetRef: MatDialogRef<GrantNotesComponent>
        , @Inject(MAT_DIALOG_DATA) public data: GrantNote) {
        this.passedNotesInfo = this.data;
       this._diff(data.currentGrant,data.originalGrant);
    }

    ngOnInit() {
        console.log(this.data);
    }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.close();
        event.preventDefault();
    }

    close(status) {
        this._bottomSheetRef.close({'message':this.inputMessage.nativeElement.value, 'result':status});
    }

    _diff(newGrant: Grant, oldGrant:Grant):any[] {
        const resultHeader = [];
        const resultSections = [];
        if(oldGrant.name!==newGrant.name){
            resultHeader.push({'order':1,'category':'Grant Header', 'name':'Grant Name changed','change':[{'old': oldGrant.name,'new':newGrant.name}]});
        }
        if(oldGrant.startDate!==newGrant.startDate){
            resultHeader.push({'order':1,'category':'Grant Header','name':'Grant Start Date changed','change':[{'old': oldGrant.stDate,'new':newGrant.stDate}]});
        }
        if(oldGrant.endDate!==newGrant.endDate){
            resultHeader.push({'order':1,'category':'Grant Header','name':'Grant End Date changed','change':[{'old': oldGrant.enDate,'new':newGrant.enDate}]});
        }
        if(oldGrant.organization && newGrant.organization){
            if(oldGrant.organization.name!==newGrant.organization.name){
                resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee changed','change':[{'old': oldGrant.organization.name,'new':newGrant.organization.name}]});
            }
        }else if(!oldGrant.organization && newGrant.organization){
               resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee added','change':[{'old': '','new':newGrant.organization.name}]});
        }else if(oldGrant.organization && !newGrant.organization){
               resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee removed','change':[{'old': oldGrant.organization.name,'new':''}]});
        }
        if(oldGrant.representative!==newGrant.representative){
            resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee Representative changed','change':[{'old': oldGrant.representative,'new':newGrant.representative}]});
        }

        for(const section of oldGrant.grantDetails.sections){
            const currentSection = newGrant.grantDetails.sections.filter((sec) => sec.id===section.id);
            if(currentSection.length>0){
                if(currentSection[0].sectionName !== section.sectionName){
                    resultSections.push({'order':2,'category':'Grant Details','name':'Section name changed','change':[{'old': section.sectionName,'new':currentSection[0].sectionName}]});
                }
                if(section.attributes){
                    for(const attr of section.attributes){
                        if(!currentSection[0].attributes){
                            currentSection[0].attributes = [];
                        }
                        const currentAttr = currentSection[0].attributes.filter((attr1 => attr.id===attr1.id));
                        if(currentAttr.length>0){
                            if(currentAttr[0].fieldName!==attr.fieldName && (currentAttr[0].fieldValue===attr.fieldValue && JSON.stringify(currentAttr[0].fieldTableValue)===JSON.stringify(attr.fieldTableValue))){
                                resultSections.push({'order':2,'category':'Grant Details','name':'Field name changed (' + currentSection[0].sectionName+')','change':[{'old': attr.fieldName,'new':currentAttr[0].fieldName}]});
                            }else if(currentAttr[0].fieldName!==attr.fieldName && (currentAttr[0].fieldValue!==attr.fieldValue || JSON.stringify(currentAttr[0].fieldTableValue)!==JSON.stringify(attr.fieldTableValue))){
                                resultSections.push({'order':2,'category':'Grant Details','name':'Field name and value changed (' + currentSection[0].sectionName+')','change':[{'old': attr.fieldName,'new':currentAttr[0].fieldName},{'old': attr.fieldValue,'new':currentAttr[0].fieldValue}]});
                            }else if(currentAttr[0].fieldName===attr.fieldName && (currentAttr[0].fieldValue!==attr.fieldValue || JSON.stringify(currentAttr[0].fieldTableValue)!==JSON.stringify(attr.fieldTableValue))){
                                if(currentAttr[0].fieldType!=='table'){
                                    resultSections.push({'order':2,'category':'Grant Details','name':'Field value changed (' + currentSection[0].sectionName+')','change':[{'old': attr.fieldValue,'new':currentAttr[0].fieldValue}]});
                                }else if(currentAttr[0].fieldType==='table'){
                                    resultSections.push({'order':2,'category':'Grant Details','name':'Field value changed (' + currentSection[0].sectionName+')','change':[{'type':'table','old': this.getTabularData(JSON.stringify(attr.fieldTableValue)),'new':this.getTabularData(JSON.stringify(currentAttr[0].fieldTableValue))}]});
                                }
                            }
                        }else{
                            resultSections.push({'order':2,'category':'Grant Details','name':'Field deleted' + section.sectionName,'change':[{'old': attr.fieldName,'new':' '}]});
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

                            resultSections.push({'order':2,'category':'Grant Details','name':'Field added (' + currentSection[0].sectionName+')','change':[{'old': '','new':attr.fieldName}]});
                        }

                    }
                }
            }else{
                resultSections.push({'order':2,'category':'Grant Details','name':'Section deleted','change':[{'old': section.sectionName,'new':''}]});
            }
        }

        for(const section of newGrant.grantDetails.sections){
            const currentSection = oldGrant.grantDetails.sections.filter((sec) => sec.id===section.id);
            if(currentSection.length===0){
                    resultSections.push({'order':2,'category':'Grant Details','name':'New section created','change':[{'old': '','new':section.sectionName}]});

                    if(section.attributes && section.attributes.length>0){
                        for(let attr of section.attributes){
                            resultSections.push({'order':2,'category':'Grant Details','name':'Field added (' + section.sectionName + ')','change':[{'old': '','new':attr.fieldName}]});
                        }
                    }
            }
         }

         this.changes.push(resultHeader);
         this.changes.push(resultSections);

        return this.changes;
    }

    getTabularData(data: string){
                let html = '<table width="100%" border="1"><tr>';
                const tabData = JSON.parse(data);
                html += '<td>&nbsp;</td>';
                for(let i=0; i< tabData[0].columns.length;i++){


                    //if(tabData[0].columns[i].name.trim() !== ''){
                      html+='<td>' + tabData[0].columns[i].name + '</td>';
                    //}
                }
                html += '</tr>';
                for(let i=0; i< tabData.length;i++){

                    html += '<tr><td>' + tabData[i].name + '</td>';
                    for(let j=0; j < tabData[i].columns.length; j++){
                      //if(tabData[i].columns[j].name.trim() !== ''){
                        html+='<td>' + tabData[i].columns[j].value + '</td>';
                      //}
                    }
                    html += '</tr>';
                }

                html += '</table>'
                //document.getElementById('attribute_' + elemId).innerHTML = '';
                //document.getElementById('attribute_' + elemId).append('<H1>Hello</H1>');
                return html;
              }
}
