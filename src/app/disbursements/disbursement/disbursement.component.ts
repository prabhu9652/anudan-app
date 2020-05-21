import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Disbursement } from 'app/model/disbursement';
import { DisbursementDataService } from 'app/disbursement.data.service';
import { AppComponent } from 'app/app.component';
import * as indianCurrencyInWords from 'indian-currency-in-words';
import { TitleCasePipe } from '@angular/common';
import * as inf from 'indian-number-format';
import { Attribute, TableData } from 'app/model/dahsboard';


@Component({
  selector: 'disbursement-dashboard',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.css'],
  providers: [TitleCasePipe]
})
export class DisbursementComponent implements OnInit {

  currentDisbursement:Disbursement;

  @ViewChild('disbursementAmountFormatted') disbursementAmountFormatted:ElementRef;
  @ViewChild('disbursementAmount') disbursementAmount:ElementRef;


  constructor(
    private disbursementService: DisbursementDataService,
    private appComponent: AppComponent,
    private titlecasePipe: TitleCasePipe
    ){}

  ngOnInit() {
    this.appComponent.currentView = 'disbursement';
    this.appComponent.subMenu = {name:'In-progress Disbursements',action:'id'};

    this.disbursementService.currentMessage.subscribe( disbursement => this.currentDisbursement = disbursement);
  }


  getGrantAmountInWords(amount:number){
    let amtInWords = '-';
    if(amount){
        amtInWords = indianCurrencyInWords(amount).replace("Rupees","").replace("Paisa","");
        return 'Rs. ' + this.titlecasePipe.transform(amtInWords);
    }
    return amtInWords;
  }

  getFormattedGrantAmount(amount: number):string{
    return inf.format(amount,2);
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
    return String('₹ ' + inf.format(total,2));
  }

  getFormattedCurrency(amount: string):string{
    if(!amount || amount===''){
        return inf.format(Number("0"),2);
    }
    return inf.format(Number(amount),2);
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
