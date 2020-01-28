import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Grant } from './model/dahsboard'
@Injectable({
  providedIn: 'root',
})
export class GrantDataService {

  private messageSource = new BehaviorSubject<Grant>(null);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: Grant, userId:number) {

  if(message!==null){
    if((message.workflowAssignment.filter(wf => wf.stateId===message.grantStatus.id && wf.assignments===userId).length>0 || message.grantStatus.internalStatus==='DRAFT')){
        message.canManage = true
    }else{
        message.canManage = false;
    }
   }
    this.messageSource.next(message)
  }

}
