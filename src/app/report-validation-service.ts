import { Injectable } from "@angular/core";
import { Report } from "./model/report";

@Injectable(
   {providedIn: 'root'}
)
export class ReportValidationService{

    checkIfHeaderHasMissingEntries(report:Report):boolean{
        if(report.name.trim()==='' || (report.startDate===null || report.startDate===undefined) || (report.endDate===null || report.endDate===undefined) || (report.dueDate===null || report.dueDate===undefined) ){
            return true;
        }else{
            return false;
        }

    }
}