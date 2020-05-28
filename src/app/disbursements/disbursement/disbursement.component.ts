import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Disbursement } from 'app/model/disbursement';
import { DisbursementDataService } from 'app/disbursement.data.service';
import { AppComponent } from 'app/app.component';
import * as indianCurrencyInWords from 'indian-currency-in-words';
import { TitleCasePipe } from '@angular/common';
import * as inf from 'indian-number-format';
import { Attribute, TableData } from 'app/model/dahsboard';
import { Router, NavigationStart } from '@angular/router';
import { CurrencyService } from 'app/currency-service';


@Component({
  selector: 'disbursement-dashboard',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.css'],
  providers: [TitleCasePipe]
})
export class DisbursementComponent implements OnInit {

  currentDisbursement:Disbursement;
  subscribers: any = {};

  @ViewChild('disbursementAmountFormatted') disbursementAmountFormatted:ElementRef;
  @ViewChild('disbursementAmount') disbursementAmount:ElementRef;


  constructor(
    private disbursementService: DisbursementDataService,
    private appComponent: AppComponent,
    private titlecasePipe: TitleCasePipe,
    private router: Router,
    public currencyService: CurrencyService,
    ){
      this.subscribers.name = this.router.events.subscribe((val) => {
        if(val instanceof NavigationStart && this.currentDisbursement){
            this.disbursementService.saveDisbursement(this.currentDisbursement)
            .then(d => {
              this.disbursementService.changeMessage(d);
            });
        }
      });
    }

  ngOnInit() {
    this.appComponent.currentView = 'disbursement';
    this.appComponent.subMenu = {name:'In-progress Disbursements',action:'id'};

    this.disbursementService.currentMessage.subscribe( disbursement => this.currentDisbursement = disbursement);
  }
  

  getGrantDisbursementAttribute():Attribute{
    for(let section of this.currentDisbursement.grant.grantDetails.sections){
        if(section.attributes){
            for(let attr of section.attributes){
                if(attr.fieldType==='disbursement'){
                    return attr;
                }
            }
        }
    }
    return null;
  }

  getTotals(idx:number,fieldTableValue:TableData[]):string{
    let total = 0;
    for(let row of fieldTableValue){
        let i=0;
        for(let col of row.columns){
            if(i===idx){
                total+=Number(col.value);
            }
            i++;
        }
    }
    return this.currencyService.getFormattedAmount(total);
  }


  showAmountInput(evt: any){
    evt.currentTarget.style.visibility='hidden';
    this.disbursementAmount.nativeElement.style.visibility='visible';
  }

  showFormattedAmount(evt:any){
    evt.currentTarget.style.visibility='hidden';
    this.disbursementAmountFormatted.nativeElement.style.visibility='visible';
  }
}
