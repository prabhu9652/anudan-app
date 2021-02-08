import { Grant } from './../../model/dahsboard';
import { Component, OnInit } from '@angular/core';
import { Disbursement } from 'app/model/disbursement';
import { AppComponent } from 'app/app.component';
import { DisbursementDataService } from 'app/disbursement.data.service';
import { Router } from '@angular/router';
import { CurrencyService } from 'app/currency-service';

@Component({
  selector: 'closed-disbursements-dashboard',
  templateUrl: './closed-disbursements.component.html',
  styleUrls: ['./closed-disbursements.component.css']
})
export class ClosedDisbursementsComponent implements OnInit {


  disbursements: Disbursement[];

  constructor(
    public appComponent: AppComponent,
    public disbursementDataService: DisbursementDataService,
    private router: Router,
    public currencyService: CurrencyService
  ) { }

  ngOnInit() {
    this.appComponent.currentView = 'disbursements';
    this.appComponent.subMenu = { name: 'Approvals Closed', action: 'cd' };
    this.fetchClosedDisbursements();
  }

  fetchClosedDisbursements() {
    this.disbursementDataService.fetchClosedDisbursements().then(list => {
      this.disbursements = list;
      console.log(this.disbursements)
    });
  }

  manageDisbursement(disbursement: Disbursement) {
    this.disbursementDataService.changeMessage(disbursement);
    this.router.navigate(['disbursement/preview']);
  }

  public getGrantTypeName(typeId): string {
    return this.appComponent.grantTypes.filter(t => t.id === typeId)[0].name;
  }

  public getGrantTypeColor(typeId): any {
    return this.appComponent.grantTypes.filter(t => t.id === typeId)[0].colorCode;
  }

  isExternalGrant(grant: Grant): boolean {
    const grantType = this.appComponent.grantTypes.filter(gt => gt.id === grant.grantTypeId)[0];
    if (!grantType.internal) {
      return true;
    } else {
      return false;
    }
  }
}
