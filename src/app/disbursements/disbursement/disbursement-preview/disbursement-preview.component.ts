import {Component, OnInit, ViewChild} from '@angular/core';
import { Disbursement } from 'app/model/disbursement';
import { DisbursementDataService } from 'app/disbursement.data.service';
import { AppComponent } from 'app/app.component';
import * as indianCurrencyInWords from 'indian-currency-in-words';
import { TitleCasePipe } from '@angular/common';
import * as inf from 'indian-number-format';
import { Attribute, TableData } from 'app/model/dahsboard';
import { AdminLayoutComponent } from 'app/layouts/admin-layout/admin-layout.component';
import { Router, NavigationStart } from '@angular/router';


@Component({
  selector: 'disbursement-preview-dashboard',
  templateUrl: './disbursement-preview.component.html',
  styleUrls: ['./disbursement-preview.component.css'],
  providers: [TitleCasePipe]
})
export class DisbursementPreviewComponent implements OnInit {

  currentDisbursement:Disbursement
  logoUrl: string;
  subscribers: any = {};

  @ViewChild('pdf') pdf;

  constructor(
    private disbursementService: DisbursementDataService,
    private appComponent: AppComponent,
    private titlecasePipe: TitleCasePipe,
    private adminComp: AdminLayoutComponent,
    private router: Router
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
    if(this.currentDisbursement===undefined || this.currentDisbursement===null){
      this.router.navigate(['dashboard']);
    }
    this.logoUrl = "/api/public/images/"+this.currentDisbursement.grant.grantorOrganization.code+"/logo";

    console.log(this.currentDisbursement);
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

  
  saveAs(filename){
    this.pdf.saveAs(filename);
  }

  showHistory(type,obj){
    this.adminComp.showHistory(type,obj);
}
}
