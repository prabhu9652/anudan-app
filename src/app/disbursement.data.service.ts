import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Disbursement, DisbursementWorkflowAssignment, DisbursementSnapshot } from "./model/disbursement";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Grant } from "./model/dahsboard";

@Injectable({
    providedIn:'root'
})
export class DisbursementDataService{
    private messageSource = new BehaviorSubject<Disbursement>(null);
    user = JSON.parse(localStorage.getItem('USER'));
    url = '/api/user/'+ this.user.id+'/disbursements';
    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
      'Authorization': localStorage.getItem('AUTH_TOKEN')
    })
  };

    currentMessage = this.messageSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  changeMessage(message: Disbursement) {
      
      this.setPermission(message);
      this.messageSource.next(message);
  }

  saveDisbursement(currentDisbursement: Disbursement):Promise<Disbursement> {
    return this.httpClient.post(this.url + "/",currentDisbursement,this.httpOptions)
    .toPromise()
    .then<Disbursement>()
    .catch(err => {
        return Promise.reject<Disbursement>('Error creating the disbursement');
    })
  }

  fetchInprogressDisbursements():Promise<Disbursement[]>{

    return this.httpClient.get(this.url+'/status/DRAFT',this.httpOptions)
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

    return this.httpClient.get(this.url+'/status/ACTIVE',this.httpOptions)
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

    return this.httpClient.get(this.url+'/status/CLOSED',this.httpOptions)
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
    return this.httpClient.get(this.url+'/active-grants',this.httpOptions)
    .toPromise()
    .then<Grant[]>().catch(err =>{
        return Promise.reject<Grant[]>('Could not retrieve Active grants');
    });
  }

    createNewDisbursement(selectedGrant:Grant):Promise<Disbursement> {
        
        const disbursement:Disbursement=new Disbursement();
        return this.httpClient.post<Disbursement>(this.url+'/grant/'+selectedGrant.id, disbursement,this.httpOptions)
        .toPromise()
        .then<Disbursement>()
        .catch(err =>{
            return Promise.reject<Disbursement>();
        });
    }

    deleteDisbursement(disbursement:Disbursement):Promise<Disbursement[]>{
        return this.httpClient.delete(this.url+'/'+disbursement.id,this.httpOptions)
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
      const disb = disbursement.assignments.filter(a => a.owner===this.user.id && a.stateId==disbursement.status.id);
    if(disb && disb.length > 0 && disbursement.status.internalStatus!=='ACTIVE' && disbursement.status.internalStatus!=='CLOSED'){
        disbursement.canManage=true;
    }else{
        disbursement.canManage=false;
    }
    return disbursement;
  }

  saveAssignments(disbursement:Disbursement,assignment:DisbursementWorkflowAssignment[]):Promise<Disbursement>{
     return this.httpClient.post(this.url+'/'+disbursement.id + '/assignment',{disbursement:disbursement,assignments:assignment},this.httpOptions)
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
      return this.httpClient.get(this.url+'/'+disbursementId,this.httpOptions)
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
      return this.httpClient.get(this.url+'/'+disbursement.id+'/changeHistory',this.httpOptions)
      .toPromise()
      .then<DisbursementSnapshot>()
      .catch(err => {
          return Promise.reject<DisbursementSnapshot>("Could not retieve Disbursement snapshot");
      });
  }

  submitDisbursement(disbursement:Disbursement,message:string,fromStateId:number,toStateId:number):Promise<Disbursement>{
    
    return this.httpClient.post(this.url+'/'+disbursement.id+'/flow/'+fromStateId+'/'+toStateId,{disbursement:disbursement,note:message}, this.httpOptions)
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