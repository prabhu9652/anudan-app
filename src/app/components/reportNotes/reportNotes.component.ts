import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatBottomSheetRef,MatDialogRef} from '@angular/material';
import {Grant, AttachmentTemplates, Doc, Note, GrantNote, Template, GrantDiff,SectionDiff,AttributeDiff,GrantSnapshot} from '../../model/dahsboard';
import {Report, ReportNote,ReportDiff,ReportSnapshot} from '../../model/report';
import {User} from "../../model/user";
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';


@Component({
    selector: 'app-reportnotes',
    templateUrl: './reportNotes.component.html',
    styleUrls: ['./reportNotes.component.scss']
})
export class ReportNotesComponent implements OnInit {

    passedNotesInfo: ReportNote;
    changes: any[] = [];
    reportDiff:ReportDiff;
    reportSnapshot: ReportSnapshot;

    @ViewChild("scrollContainer") scrollContainer: ElementRef;
    @ViewChild("inputMessage") inputMessage: ElementRef;

    constructor(
        private _bottomSheetRef: MatDialogRef<ReportNotesComponent>
        , @Inject(MAT_DIALOG_DATA) public data: ReportNote,private http: HttpClient) {

const httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                  'Authorization': localStorage.getItem('AUTH_TOKEN')
              })
          };

          const url = '/api/user/' + JSON.parse(localStorage.getItem('USER')).id+ '/report/'+data.currentReport.id+'/changeHistory';

          this.http.get<ReportSnapshot>(url, httpOptions).subscribe((snapshot: ReportSnapshot) => {
            this.reportSnapshot = snapshot;
            if(this.reportSnapshot){
                this.reportSnapshot.reportDetails = JSON.parse(this.reportSnapshot.stringAttributes);
                this.passedNotesInfo = this.data;
                this._diff(data.currentReport,this.reportSnapshot);
            }

          });


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

    _diff(newReport: Report, oldReport:ReportSnapshot):any[] {
        const resultHeader = [];
        const resultSections = [];

        if(oldReport.name!==newReport.name){
            this._getReportDiff();
            resultHeader.push({'order':1,'category':'Report Header', 'name':'Report Name changed','change':[{'old': oldReport.name,'new':newReport.name}]});
            this.reportDiff.oldReportName = oldReport.name;
            this.reportDiff.newReportName = newReport.name;
        }
        if(oldReport.startDate!==newReport.startDate){
            this._getReportDiff();
            //resultHeader.push({'order':1,'category':'Grant Header','name':'Grant Start Date changed','change':[{'old': oldGrant.stDate,'new':newGrant.stDate}]});
            this.reportDiff.oldReportStartDate = oldReport.startDate;
            this.reportDiff.newReportStartDate = newReport.startDate;
        }
        if(oldReport.endDate!==newReport.endDate){
            //resultHeader.push({'order':1,'category':'Grant Header','name':'Grant End Date changed','change':[{'old': oldGrant.enDate,'new':newGrant.enDate}]});
            this._getReportDiff();
            this.reportDiff.oldReportEndDate = oldReport.endDate;
            this.reportDiff.newReportEndDate = newReport.endDate;
        }

        if(oldReport.dueDate!==newReport.dueDate){
            //resultHeader.push({'order':1,'category':'Grant Header','name':'Grant End Date changed','change':[{'old': oldGrant.enDate,'new':newGrant.enDate}]});
            this._getReportDiff();
            this.reportDiff.oldReportDueDate = oldReport.dueDate;
            this.reportDiff.newReportDueDate = newReport.dueDate;
        }


        for(const section of newReport.reportDetails.sections){
            const oldSection = oldReport.reportDetails.sections.filter((sec) => sec.id===section.id)[0];
            if(oldSection){

                if(section.attributes){
                    for(let attr of section.attributes){
                        let oldAttr = null;
                         if(oldSection.attributes){
                            oldAttr = oldSection.attributes.filter((a) => a.id===attr.id)[0];
                         }
                        if(oldAttr && (oldAttr.fieldName!==attr.fieldName || (attr.actualTarget && attr.actualTarget!==oldAttr.actualTarget) || (attr.fieldValue && attr.fieldValue!==oldAttr.fieldValue) || (attr.fieldType && attr.fieldType!==oldAttr.fieldType) || (attr.fieldType && attr.fieldType==='table' && oldAttr.fieldType==='table' && (attr.fieldValue!==JSON.stringify(oldAttr.fieldTableValue))) )){
                            this._getReportDiffSections();
                            const attrDiff = new AttributeDiff();
                            attrDiff.section = section.sectionName;
                            attrDiff.oldAttribute = oldAttr;
                            attrDiff.newAttribute = attr;
                            const sectionDiff = new SectionDiff();
                            sectionDiff.oldSection = oldSection;
                            sectionDiff.newSection = section;
                            sectionDiff.attributesDiffs = [];
                            sectionDiff.order = section.order
                            sectionDiff.attributesDiffs.push(attrDiff);
                            this.reportDiff.sectionDiffs.push(sectionDiff);
                        } else if(!oldAttr){
                            this._getReportDiffSections();
                            const attrDiff = new AttributeDiff();
                            attrDiff.section = section.sectionName;
                            attrDiff.newAttribute = attr;
                            const sectionDiff = new SectionDiff();
                            sectionDiff.oldSection = oldSection;
                            sectionDiff.newSection = section;
                            sectionDiff.attributesDiffs = [];
                            sectionDiff.order = section.order
                            sectionDiff.attributesDiffs.push(attrDiff);
                            this.reportDiff.sectionDiffs.push(sectionDiff);
                        }
                    }

                    if(oldSection.attributes){
                        for(let attr of oldSection.attributes){
                            let oldAttr = null;

                            oldAttr = section.attributes.filter((a) => a.id===attr.id)[0];
                            if(!oldAttr){
                                this._getReportDiffSections();
                                const attrDiff = new AttributeDiff();
                                attrDiff.section = section.sectionName;
                                attrDiff.oldAttribute = attr;
                                attrDiff.newAttribute = null;
                                const sectionDiff = new SectionDiff();
                                sectionDiff.oldSection = oldSection;
                                sectionDiff.newSection = section;
                                sectionDiff.order = section.order
                                sectionDiff.attributesDiffs = [];
                                sectionDiff.attributesDiffs.push(attrDiff);
                                this.reportDiff.sectionDiffs.push(sectionDiff);
                            }
                        }
                    }
                }
                if(oldSection.sectionName !== section.sectionName){
                    this._getReportDiffSections();
                    //resultSections.push({'order':2,'category':'Grant Details','name':'Section name changed','change':[{'old': section.sectionName,'new':currentSection.sectionName}]});
                    let secDiff = new SectionDiff();
                    secDiff.oldSection = oldSection;
                    secDiff.newSection = section;
                    secDiff.order = section.order
                    secDiff.hasSectionLevelChanges = true;
                    this.reportDiff.sectionDiffs.push(secDiff);
                }
            }else{
                //resultSections.push({'order':2,'category':'Grant Details','name':'Section deleted','change':[{'old': section.sectionName,'new':''}]});
                 this._getReportDiffSections();
                let secDiff = new SectionDiff();
                secDiff.oldSection = null;
                secDiff.newSection = section;
                secDiff.order = section.order;
                secDiff.hasSectionLevelChanges = true;
                this.reportDiff.sectionDiffs.push(secDiff);
            }
        }

        for(const section of oldReport.reportDetails.sections){
            const currentSection = newReport.reportDetails.sections.filter((sec) => sec.id===section.id)[0];
            if(!currentSection){
                    //resultSections.push({'order':2,'category':'Grant Details','name':'New section created','change':[{'old': '','new':section.sectionName}]});
                    this._getReportDiffSections();
                    let secDiff = new SectionDiff();
                    secDiff.oldSection = section;
                    secDiff.newSection = null;
                    secDiff.order = section.order;
                    secDiff.hasSectionLevelChanges = true
                    this.reportDiff.sectionDiffs.push(secDiff);
            }
         }

         this.changes.push(resultHeader);
         this.changes.push(resultSections);
         if(this.reportDiff && this.reportDiff.sectionDiffs){
            this.reportDiff.sectionDiffs.sort((a,b) => a.order>=b.order?1:-1);
         }
        return this.changes;
    }

    _getReportDiff(){
        if(!this.reportDiff){
            this.reportDiff = new ReportDiff();
        }
    }
    _getReportDiffSections(){
            this._getReportDiff();
            if(!this.reportDiff.sectionDiffs){
                this.reportDiff.sectionDiffs = [];
            }

    }
    /* _getGrantDiffAttributes(){
                this._getGrantDiffSections();
                if(!this.grantDiff.sectionDiffs.attributesDiffs){
                    this.grantDiff.sectionDiffs.attributesDiffs = [];
                }

        } */
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
    if(val!==undefined && val!==""){
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


getType(type: String){
    if(type==='multiline'){
        return 'Descriptive';
    } else if(type==='table'){
        return 'Tabular';
    } else if(type === 'document'){
        return 'Document';
    } else if (type === 'kpi'){
        return 'Measurement/KPI';
    }
}
}
