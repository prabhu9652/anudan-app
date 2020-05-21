import {Component, OnInit} from '@angular/core';
import { AppComponent } from 'app/app.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Grant } from 'app/model/dahsboard';
import { MatDialog } from '@angular/material';
import { GrantSelectionDialogComponent } from 'app/components/grant-selection-dialog/grant-selection-dialog.component';
import { Disbursement } from 'app/model/disbursement';
import { DisbursementDataService } from 'app/disbursement.data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'inprogress-disbursements-dashboard',
  templateUrl: './inprogress-disbursements.component.html',
  styleUrls: ['./inprogress-disbursements.component.css']
})
export class InprogressDisbursementsComponent implements OnInit {

  disbursements: Disbursement[];
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
      'Authorization': localStorage.getItem('AUTH_TOKEN')
    })
  };

  public constructor(
    private appComponent: AppComponent,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private disbursementDataService: DisbursementDataService,
    private router: Router
  ){};


  ngOnInit() {
    this.appComponent.currentView = 'disbursements';
  }

  showOwnedActiveGrants(){

    const url = '/api/user/'+this.appComponent.loggedInUser.id+'/disbursements/active-grants';
    this.httpClient.get(url,this.httpOptions).subscribe((ownedGrants:Grant[])=>{
      const dialogRef = this.dialog.open(GrantSelectionDialogComponent, {
        data: ownedGrants,
        panelClass: 'grant-template-class'
      });

      dialogRef.afterClosed().subscribe((result)=>{
        if(result.result){
          this.createDisbursement(result.selectedGrant);
        }else{
          dialogRef.close();
        }
      })

    },error =>{
      console.log(error)
    });
  }
  createDisbursement(selectedGrant: Grant) {
    const url = '/api/user/'+this.appComponent.loggedInUser.id+'/disbursements/grant/'+selectedGrant.id;
    const disbursement:Disbursement=new Disbursement();
    this.httpClient.post<Disbursement>(url, disbursement,this.httpOptions).subscribe((d: Disbursement) => {
      this.disbursementDataService.changeMessage(d);
      this.router.navigate(['disbursement/approval-request'])

    },error =>{
      console.error('Failed to create disbursement');
      
    });
  }

}
