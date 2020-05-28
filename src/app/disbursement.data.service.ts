import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Disbursement } from "./model/disbursement";
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
      
      if(message.assignments.filter(a => a.owner===this.user.id && a.stateId==message.status.id)){
          message.canManage=true;
      }else{
          message.canManage=false;
      }
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

    return this.httpClient.get(this.url+'/',this.httpOptions)
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
    if(disbursement.assignments.filter(a => a.owner===this.user.id && a.stateId==disbursement.status.id)){
        disbursement.canManage=true;
    }else{
        disbursement.canManage=false;
    }
    return disbursement;
  }

}