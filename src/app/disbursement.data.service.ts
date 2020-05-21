import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Disbursement } from "./model/disbursement";

@Injectable({
    providedIn:'root'
})
export class DisbursementDataService{
    private messageSource = new BehaviorSubject<Disbursement>(null);
    currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: Disbursement) {
      const user = JSON.parse(localStorage.getItem('USER'));
      if(message.assignments.filter(a => a.owner===user.id && a.stateId==message.status.id)){
          message.canManage=true;
      }else{
          message.canManage=false;
      }
      this.messageSource.next(message);
  }

}