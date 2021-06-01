import { UiUtilService } from './../../ui-util.service';
import { Grant } from './../../model/dahsboard';
import { FieldDialogComponent } from './../../components/field-dialog/field-dialog.component';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Disbursement } from 'app/model/disbursement';
import { AppComponent } from 'app/app.component';
import { DisbursementDataService } from 'app/disbursement.data.service';
import { Router } from '@angular/router';
import { CurrencyService } from 'app/currency-service';


@Component({
  selector: 'approved-disbursements-dashboard',
  templateUrl: './approved-disbursements.component.html',
  styleUrls: ['./approved-disbursements.component.css']
})
export class ApprovedDisbursementsComponent implements OnInit {

  disbursements: Disbursement[];
  filteredDisbursements: Disbursement[];

  constructor(
    public appComponent: AppComponent,
    public disbursementDataService: DisbursementDataService,
    private router: Router,
    public currencyService: CurrencyService,
    private dialog: MatDialog,
    public uiService: UiUtilService
  ) { }

  ngOnInit() {
    this.appComponent.currentView = 'disbursements';
    this.appComponent.subMenu = { name: 'Approvals Active', action: 'ad' };
    this.fetchActiveDisbursements();
  }

  fetchActiveDisbursements() {
    this.disbursementDataService.fetchActiveDisbursements().then(list => {
      this.disbursements = list;
      this.filteredDisbursements = this.disbursements;
      console.log(this.disbursements)
    });
  }

  manageDisbursement(disbursement: Disbursement) {
    this.disbursementDataService.changeMessage(disbursement);
    this.router.navigate(['disbursement/preview']);
  }

  deleteDisbursement(disbursement: Disbursement) {


    const dialogRef = this.dialog.open(FieldDialogComponent, {
      data: { title: 'Are you sure you want to delete this disbursement?', btnMain: "Delete Disbursement", btnSecondary: "Not Now" },
      panelClass: 'center-class'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.disbursementDataService.deleteDisbursement(disbursement)
          .then(disbs => {
            this.disbursements = disbs;
          })
      } else {
        dialogRef.close();
      }
    });
  }

  public getGrantTypeName(typeId): string {
    return this.appComponent.grantTypes.filter(t => t.id === typeId)[0].name;
  }

  public getGrantTypeColor(typeId): any {
    return this.appComponent.grantTypes.filter(t => t.id === typeId)[0].colorCode;
  }

  isExternalGrant(grant: Grant): boolean {

    if (this.appComponent.loggedInUser.organization.organizationType === 'GRANTEE') {
      return true;
    }

    const grantType = this.appComponent.grantTypes.filter(gt => gt.id === grant.grantTypeId)[0];
    if (!grantType.internal) {
      return true;
    } else {
      return false;
    }
  }

  startFilter(val) {
    this.filteredDisbursements = this.disbursements.filter(g => ((g.grant.name.toLowerCase().includes(val)) || (g.grant.organization && g.grant.organization.name && g.grant.organization.name.toLowerCase().includes(val))));
  }
}
