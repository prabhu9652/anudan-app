import { Injectable } from "@angular/core";
import { Grant } from "./model/dahsboard";

@Injectable(
   {providedIn: 'root'}
)
export class GrantValidationService{

    checkIfHeaderHasMissingEntries(grant:Grant):boolean{
        if(grant.name.trim()==='' || (grant.amount===undefined || grant.amount===null) || (grant.startDate===null || grant.startDate===undefined) || (grant.endDate===null || grant.endDate===undefined) || (grant.organization===null || grant.organization===undefined) || (grant.representative===null || grant.representative.trim()==='')){
            return true;
        }else{
            return false;
        }

    }
}