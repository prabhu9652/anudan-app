import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { Disbursement } from "app/model/disbursement";
import { DisbursementDataService } from "app/disbursement.data.service";
import { AppComponent } from "app/app.component";
import * as indianCurrencyInWords from "indian-currency-in-words";
import { TitleCasePipe } from "@angular/common";
import * as inf from "indian-number-format";
import { Attribute, TableData } from "app/model/dahsboard";
import { Router, NavigationStart } from "@angular/router";
import { CurrencyService } from "app/currency-service";
import { AdminLayoutComponent } from "app/layouts/admin-layout/admin-layout.component";
import { AmountValidator } from "app/amount-validator";

@Component({
  selector: "disbursement-dashboard",
  templateUrl: "./disbursement.component.html",
  styleUrls: ["./disbursement.component.css"],
  providers: [TitleCasePipe],
})
export class DisbursementComponent implements OnInit, OnDestroy {
  currentDisbursement: Disbursement;
  subscribers: any = {};

  @ViewChild("disbursementAmountFormatted")
  disbursementAmountFormatted: ElementRef;
  @ViewChild("disbursementAmount") disbursementAmount: ElementRef;

  constructor(
    public disbursementService: DisbursementDataService,
    private appComponent: AppComponent,
    private titlecasePipe: TitleCasePipe,
    private router: Router,
    public currencyService: CurrencyService,
    private adminComp: AdminLayoutComponent,
    public amountValidator: AmountValidator
  ) {
    this.subscribers = this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart && this.currentDisbursement) {
        this.disbursementService
          .saveDisbursement(this.currentDisbursement)
          .then((d) => {
            this.disbursementService.changeMessage(d);
          });
      }
    });
  }

  ngOnInit() {
    this.appComponent.currentView = "disbursement";

    this.disbursementService.currentMessage.subscribe(
      (disbursement) => (this.currentDisbursement = disbursement)
    );
    if (
      this.currentDisbursement === undefined ||
      this.currentDisbursement === null
    ) {
      this.router.navigate(["dashboard"]);
    }
  }

  ngOnDestroy() {
    this.subscribers.unsubscribe();
  }

  getGrantDisbursementAttribute(): Attribute {
    for (let section of this.currentDisbursement.grant.grantDetails.sections) {
      if (section.attributes) {
        for (let attr of section.attributes) {
          if (attr.fieldType === "disbursement") {
            return attr;
          }
        }
      }
    }
    return null;
  }

  getTotals(idx: number, fieldTableValue: TableData[]): string {
    let total = 0;
    for (let row of fieldTableValue) {
      let i = 0;
      for (let col of row.columns) {
        if (i === idx) {
          total += Number(col.value);
        }
        i++;
      }
    }
    return this.currencyService.getFormattedAmount(total);
  }

  showAmountInput(evt: any) {
    evt.currentTarget.style.visibility = "hidden";
    this.disbursementAmount.nativeElement.style.visibility = "visible";
  }

  showFormattedAmount(evt: any) {
    evt.currentTarget.style.visibility = "hidden";
    this.disbursementAmountFormatted.nativeElement.style.visibility = "visible";
  }

  showWorkflowAssigments() {
    this.adminComp.showWorkflowAssigments();
  }

  showHistory(type, obj) {
    this.adminComp.showHistory(type, obj);
  }

  manageGrant() {
    this.adminComp.manageGrant(null, this.currentDisbursement.grant.id);
  }
}
