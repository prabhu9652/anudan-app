import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatBottomSheetRef,MatDialogRef} from '@angular/material';
import {Grant, AttachmentTemplates, Doc, Note, GrantNote, Template, GrantDiff,SectionDiff,AttributeDiff} from '../../model/dahsboard';
import {User} from "../../model/user";
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';


@Component({
    selector: 'app-grantnotes',
    templateUrl: './grantNotes.component.html',
    styleUrls: ['./grantNotes.component.scss']
})
export class GrantNotesComponent implements OnInit {

    passedNotesInfo: GrantNote;
    changes: any[] = [];
    grantDiff:GrantDiff;

    @ViewChild("scrollContainer") scrollContainer: ElementRef;
    @ViewChild("inputMessage") inputMessage: ElementRef;

    constructor(
        private _bottomSheetRef: MatDialogRef<GrantNotesComponent>
        , @Inject(MAT_DIALOG_DATA) public data: GrantNote) {
        this.passedNotesInfo = this.data;
       this._diff(data.currentGrant,data.originalGrant);
       //this._differences(data.currentGrant,data.originalGrant);
       //console.log(detailedDiff(data.currentGrant,data.originalGrant));
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
            this._getGrantDiff();
            resultHeader.push({'order':1,'category':'Grant Header', 'name':'Grant Name changed','change':[{'old': oldGrant.name,'new':newGrant.name}]});
            this.grantDiff.oldGrantName = oldGrant;
            this.grantDiff.newGrantName = newGrant;
        }
        if(oldGrant.startDate!==newGrant.startDate){
            this._getGrantDiff();
            resultHeader.push({'order':1,'category':'Grant Header','name':'Grant Start Date changed','change':[{'old': oldGrant.stDate,'new':newGrant.stDate}]});
            this.grantDiff.oldGrantStartDate = oldGrant;
            this.grantDiff.newGrantStartDate = newGrant;
        }
        if(oldGrant.endDate!==newGrant.endDate){
            resultHeader.push({'order':1,'category':'Grant Header','name':'Grant End Date changed','change':[{'old': oldGrant.enDate,'new':newGrant.enDate}]});
            this._getGrantDiff();
            this.grantDiff.oldGrantEndDate = oldGrant;
            this.grantDiff.newGrantEndDate = newGrant;
        }
        if(oldGrant.amount!==newGrant.amount){
            //resultHeader.push({'order':1,'category':'Grant Header','name':'Grant End Date changed','change':[{'old': oldGrant.enDate,'new':newGrant.enDate}]});
            this._getGrantDiff();
            this.grantDiff.oldGrantAmount = oldGrant;
            this.grantDiff.newGrantAmount = newGrant;
        }
        if(oldGrant.organization && newGrant.organization){
            if(oldGrant.organization.name!==newGrant.organization.name){
                resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee changed','change':[{'old': oldGrant.organization.name,'new':newGrant.organization.name}]});
                this._getGrantDiff();
                this.grantDiff.oldGrantee = oldGrant.organization;
                this.grantDiff.newGrantee = newGrant.organization;
            }
        }else if(!oldGrant.organization && newGrant.organization){
                this._getGrantDiff();
               resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee added','change':[{'old': '','new':newGrant.organization.name}]});
               this.grantDiff.newGrantee = newGrant.organization;
        }else if(oldGrant.organization && !newGrant.organization){
               resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee removed','change':[{'old': oldGrant.organization.name,'new':''}]});
               this._getGrantDiff();
               this.grantDiff.oldGrantee = oldGrant.organization;
        }
        if(oldGrant.representative!==newGrant.representative){
            resultHeader.push({'order':1,'category':'Grant Header','name':'Grantee Representative changed','change':[{'old': oldGrant.representative,'new':newGrant.representative}]});
            this._getGrantDiff();
            this.grantDiff.oldRep = oldGrant;
            this.grantDiff.newRep = newGrant;
        }


        for(const section of oldGrant.grantDetails.sections){
            const currentSection = newGrant.grantDetails.sections.filter((sec) => sec.id===section.id)[0];
            if(currentSection){
                if(currentSection.sectionName !== section.sectionName){
                    this._getGrantDiffSections();
                    resultSections.push({'order':2,'category':'Grant Details','name':'Section name changed','change':[{'old': section.sectionName,'new':currentSection.sectionName}]});
                    let secDiff = new SectionDiff();
                    secDiff.oldSection = section;
                    secDiff.newSection = currentSection;
                    this.grantDiff.sectionDiffs.push(secDiff);
                }
                if(section.attributes){
                    for(let attr of section.attributes){
                        const currAttr = currentSection.attributes.filter((a) => a.id===attr.id)[0];
                        if(currAttr && (currAttr.fieldName!==attr.fieldName || attr.fieldValue!==currAttr.fieldValue)){
                            this._getGrantDiffAttributes();
                            const attrDiff = new AttributeDiff();
                            attrDiff.section = currentSection.sectionName;
                            attrDiff.oldAttribute = attr;
                            attrDiff.newAttribute = currAttr;
                            this.grantDiff.attributesDiffs.push(attrDiff);
                        }
                    }
                }
            }else{
                resultSections.push({'order':2,'category':'Grant Details','name':'Section deleted','change':[{'old': section.sectionName,'new':''}]});
                 this._getGrantDiffSections();
                let secDiff = new SectionDiff();
                secDiff.oldSection = section;
                secDiff.newSection = null;
                this.grantDiff.sectionDiffs.push(secDiff);
            }
        }

        for(const section of newGrant.grantDetails.sections){
            const currentSection = oldGrant.grantDetails.sections.filter((sec) => sec.id===section.id)[0];
            if(!currentSection){
                    resultSections.push({'order':2,'category':'Grant Details','name':'New section created','change':[{'old': '','new':section.sectionName}]});
                     this._getGrantDiffSections();
                    let secDiff = new SectionDiff();
                    secDiff.oldSection = null;
                    secDiff.newSection = section;
                    this.grantDiff.sectionDiffs.push(secDiff);
            }
         }

         this.changes.push(resultHeader);
         this.changes.push(resultSections);

        return this.changes;
    }

    _getGrantDiff(){
        if(!this.grantDiff){
            this.grantDiff = new GrantDiff();
        }
    }
    _getGrantDiffSections(){
            this._getGrantDiff();
            if(!this.grantDiff.sectionDiffs){
                this.grantDiff.sectionDiffs = [];
            }

    }
    _getGrantDiffAttributes(){
                this._getGrantDiff();
                if(!this.grantDiff.attributesDiffs){
                    this.grantDiff.attributesDiffs = [];
                }

        }
    getTabularData(data){
                let html = '<table width="100%" border="1"><tr>';
                const tabData = data;
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
getDocumentName(val: string): any[] {
    let obj;
    if(val!==""){
        obj = JSON.parse(val);
    }
    return obj;
}

_differences (obj1: Grant, obj2: Grant) {

    // Make sure an object to compare is provided
    if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
        return obj1;
    }

    //
    // Variables
    //

    var diffs = {};
    var key;


    //
    // Methods
    //

    /**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
    var arraysMatch = function (arr1, arr2) {

        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }

        // Otherwise, return true
        return true;

    };

    /**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */
    var compare = function (item1, item2, key) {

        // Get the object type
        var type1 = Object.prototype.toString.call(item1);
        var type2 = Object.prototype.toString.call(item2);

        // If type2 is undefined it has been removed
        if (type2 === '[object Undefined]') {
            diffs[key] = null;
            return;
        }

        // If items are different types
        if (type1 !== type2) {
            diffs[key] = item2;
            return;
        }

        // If an object, compare recursively
        if (type1 === '[object Object]') {
            var objDiff = this._differences(item1, item2);
            if (Object.keys(objDiff).length > 0) {
                diffs[key] = objDiff;
            }
            return;
        }

        // If an array, compare
        if (type1 === '[object Array]') {
            if (!arraysMatch(item1, item2)) {
                diffs[key] = item2;
            }
            return;
        }

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (type1 === '[object Function]') {
            if (item1.toString() !== item2.toString()) {
                diffs[key] = item2;
            }
        } else {
            if (item1 !== item2 ) {
                diffs[key] = item2;
            }
        }

    };


    //
    // Compare our objects
    //

    // Loop through the first object
    for (key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            compare(obj1[key], obj2[key], key);
        }
    }

    // Loop through the second object and find missing items
    for (key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (!obj1[key] && obj1[key] !== obj2[key] ) {
                diffs[key] = obj2[key];
            }
        }
    }

    // Return the object of differences
    return diffs;

};
}
