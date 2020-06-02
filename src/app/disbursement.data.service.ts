import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Disbursement, DisbursementWorkflowAssignment, DisbursementSnapshot } from "./model/disbursement";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Grant } from "./model/dahsboard";
import { UserService } from "./user.service";
import { User } from "./model/user";

@Injectable({
    providedIn:'root'
})
export class DisbursementDataService{
    private messageSource = new BehaviorSubject<Disbursement>(null);
    url:string = '/api/user/%USERID%/disbursements';
    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
      'Authorization': localStorage.getItem('AUTH_TOKEN')
    })
  };

    currentMessage = this.messageSource.asObservable();

  constructor(private httpClient: HttpClient, public userService:UserService) { }

  changeMessage(message: Disbursement) {
      
      this.setPermission(message);
      this.messageSource.next(message);
  }

  private getUrl():string{
      const user = this.userService.getUser();
      return this.url.replace('%USERID%',user.id);
  }

  saveDisbursement(currentDisbursement: Disbursement):Promise<Disbursement> {
    return this.httpClient.post(this.getUrl() + "/",currentDisbursement,this.httpOptions)
    .toPromise()
    .then<Disbursement>()
    .catch(err => {
        return Promise.reject<Disbursement>('Error creating the disbursement');
    })
  }

  fetchInprogressDisbursements():Promise<Disbursement[]>{

    return this.httpClient.get(this.getUrl()+'/status/DRAFT',this.httpOptions)
    .toPromise().then<Disbursement[]>((d:Disbursement[]) =>{
        if(d && d.length>0){
            for(let disb of d){
                disb = this.setPermission(disb);
            }
        }
        return Promise.resolve<Disbursement[]>(d);
    })
    .catch(err =>{
        return Promise.reject<Disbursement[]>('Could not retrieve disbursements');
    });
    
  }

  fetchActiveDisbursements():Promise<Disbursement[]>{

    return this.httpClient.get(this.getUrl()+'/status/ACTIVE',this.httpOptions)
    .toPromise().then<Disbursement[]>((d:Disbursement[]) =>{
        if(d && d.length>0){
            for(let disb of d){
                disb = this.setPermission(disb);
            }
        }
        return Promise.resolve<Disbursement[]>(d);
    })
    .catch(err =>{
        return Promise.reject<Disbursement[]>('Could not retrieve disbursements');
    });
    
  }

  fetchClosedDisbursements():Promise<Disbursement[]>{

    return this.httpClient.get(this.getUrl()+'/status/CLOSED',this.httpOptions)
    .toPromise().then<Disbursement[]>((d:Disbursement[]) =>{
        if(d && d.length>0){
            for(let disb of d){
                disb = this.setPermission(disb);
            }
        }
        return Promise.resolve<Disbursement[]>(d);
    })
    .catch(err =>{
        return Promise.reject<Disbursement[]>('Could not retrieve disbursements');
    });
    
  }

  showOwnedActiveGrants():Promise<Grant[]>{
    return this.httpClient.get(this.getUrl()+'/active-grants',this.httpOptions)
    .toPromise()
    .then<Grant[]>().catch(err =>{
        return Promise.reject<Grant[]>('Could not retrieve Active grants');
    });
  }

    createNewDisbursement(selectedGrant:Grant):Promise<Disbursement> {
        
        const disbursement:Disbursement=new Disbursement();
        return this.httpClient.post<Disbursement>(this.getUrl()+'/grant/'+selectedGrant.id, disbursement,this.httpOptions)
        .toPromise()
        .then<Disbursement>()
        .catch(err =>{
            return Promise.reject<Disbursement>();
        });
    }

    deleteDisbursement(disbursement:Disbursement):Promise<Disbursement[]>{
        return this.httpClient.delete(this.getUrl()+'/'+disbursement.id,this.httpOptions)
        .toPromise()
        .then<Disbursement[]>((d:Disbursement[]) =>{
            if(d && d.length>0){
                for(let disb of d){
                    disb = this.setPermission(disb);
                }
            }
            return Promise.resolve<Disbursement[]>(d);
        })
        .catch(err =>{
            return Promise.reject<Disbursement[]>('Unable to delete the disbursement');
        });
    }

  setPermission(disbursement:Disbursement):Disbursement{
      const disb = disbursement.assignments.filter(a => a.owner===this.userService.getUser().id && a.stateId==disbursement.status.id);
    if(disb && disb.length > 0 && disbursement.status.internalStatus!=='ACTIVE' && disbursement.status.internalStatus!=='CLOSED'){
        disbursement.canManage=true;
    }else{
        disbursement.canManage=false;
    }
    return disbursement;
  }

  saveAssignments(disbursement:Disbursement,assignment:DisbursementWorkflowAssignment[]):Promise<Disbursement>{
     return this.httpClient.post(this.getUrl()+'/'+disbursement.id + '/assignment',{disbursement:disbursement,assignments:assignment},this.httpOptions)
      .toPromise()
      .then((d:Disbursement) => {
          this.setPermission(d);
          return Promise.resolve<Disbursement>(d);
      })
      .catch(err =>{
          return Promise.reject<Disbursement>('Could not save assignments');
      });
  }

  getDisbursement(disbursementId:Number):Promise<Disbursement>{
      return this.httpClient.get(this.getUrl()+'/'+disbursementId,this.httpOptions)
      .toPromise()
      .then((d:Disbursement) =>{
          this.setPermission(d);
          return Promise.resolve<Disbursement>(d)
      }).catch(err => {
        return Promise.reject<Disbursement>('Could not retrieve disbursement');
      });
  }

  checkIfHeaderHasMissingEntries(disbursement:Disbursement):boolean{
      if(!disbursement.requestedAmount || !disbursement.reason || disbursement.reason.trim()===''){
          return true;
      }else{
          return false;
      }
  }

  getHistory(disbursement:Disbursement):Promise<DisbursementSnapshot>{
      return this.httpClient.get(this.getUrl()+'/'+disbursement.id+'/changeHistory',this.httpOptions)
      .toPromise()
      .then<DisbursementSnapshot>()
      .catch(err => {
          return Promise.reject<DisbursementSnapshot>("Could not retieve Disbursement snapshot");
      });
  }

  submitDisbursement(disbursement:Disbursement,message:string,fromStateId:number,toStateId:number):Promise<Disbursement>{
    
    return this.httpClient.post(this.getUrl()+'/'+disbursement.id+'/flow/'+fromStateId+'/'+toStateId,{disbursement:disbursement,note:message}, this.httpOptions)
    .toPromise()
    .then( (d:Disbursement) => {
        this.setPermission(d);
        return Promise.resolve<Disbursement>(d);
    })
    .catch(err => {
        return Promise.reject<Disbursement>('Could not move disbursement');
    });
  }

         

}