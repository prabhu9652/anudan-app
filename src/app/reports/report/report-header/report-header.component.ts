import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {SingleReportDataService} from '../../../single.report.data.service'
import {Report,ReportSectionInfo} from '../../../model/report'
import {CustomDateAdapter,Section} from '../../../model/dahsboard'
import {MatBottomSheet, MatDatepicker, MatDatepickerInputEvent, MatDialog, MAT_DATE_FORMATS, DateAdapter} from '@angular/material';
import { HumanizeDurationLanguage, HumanizeDuration } from 'humanize-duration-ts';
import {ActivatedRoute, Router, NavigationStart,NavigationEnd, ActivationEnd,RouterEvent} from '@angular/router';
import {AppComponent} from '../../../app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ToastrService,IndividualConfig} from 'ngx-toastr';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {AdminLayoutComponent} from '../../../layouts/admin-layout/admin-layout.component'


export const APP_DATE_FORMATS = {
   parse: {
      dateInput: {month: 'short', year: 'numeric', day: 'numeric'}
   },
   display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'},
   }
};

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss'],
  providers: [SidebarComponent,{
                provide: DateAdapter, useClass: CustomDateAdapter
              },{
                provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
             }]
})
export class ReportHeaderComponent implements OnInit {

  currentReport: Report;
  action: string;
  langService: HumanizeDurationLanguage = new HumanizeDurationLanguage();
  humanizer: HumanizeDuration = new HumanizeDuration(this.langService);
  subscribers: any = {};

  @ViewChild('pickerStart') pickerStart: MatDatepicker<Date>;
  @ViewChild('pickerEnd') pickerEnd: MatDatepicker<Date>;
  @ViewChild('pickerDue') pickerDue: MatDatepicker<Date>;
  @ViewChild('createSectionModal') createSectionModal: ElementRef;

  constructor(private singleReportDataService: SingleReportDataService,
    private route: ActivatedRoute,
    private appComp: AppComponent,
    private router: Router,
    private adminComp: AdminLayoutComponent,
    private http: HttpClient,
    private toastr: ToastrService,
    private sidebar: SidebarComponent) {
    this.route.params.subscribe( (p) => {
        this.action = p['action'];
        this.appComp.action = this.action;
    });

    this.subscribers = this.router.events.subscribe((val) => {
        if(val instanceof NavigationStart && val.url ==='/report/report-preview'){
            this.appComp.action='report-preview';
        } else if(val instanceof NavigationStart && val.url !=='/report/report-preview'){
            this.appComp.action='';
        }

        if(val instanceof NavigationStart){
            this.saveReport();
            if(val.url==='/grants'){
                this.subscribers.unsubscribe();
            }
            console.log(']]]]]]]]]]]]]]]]]]]]]]]]] ' + val.url);
        }
    });
  }

    ngOnInit() {
        this.appComp.reportSaved = false;
        this.singleReportDataService.currentMessage.subscribe((report) => {
            this.currentReport = report;
            this.setDateDuration();
            console.log(this.currentReport);
        });

        this.appComp.createNewReportSection.subscribe((val) =>{
            if(val){
                $('.modal-backdrop').remove();

                this.addNewSection();
                this.appComp.createNewReportSection.next(false);
            }
        });
    }

    openStartDate(){
        const stDateElem = this.pickerStart;
        if(!stDateElem.opened){
            stDateElem.open();
        } else{
            stDateElem.close();
        }
    }

    openEndDate(){
        const enDateElem = this.pickerEnd;
        if(!enDateElem.opened){
            enDateElem.open();
        } else{
            enDateElem.close();
        }
    }

    openDueDate(){
        const dDateElem = this.pickerDue;
        if(!dDateElem.opened){
            dDateElem.open();
        } else{
            dDateElem.close();
        }
    }
    datePickerSelected(event:Event){
        //Fo nothing
    }

    manageDate(type: string, ev: Event, dt: string){
    if(type==='start'){
      this.currentReport.startDate=new Date(ev.toString());
    }else if(type==='end'){
      this.currentReport.endDate=new Date(ev.toString());
    }else if(type==='due'){
        this.currentReport.dueDate=new Date(ev.toString());
    }
    this.setDateDuration();
    }

    setDateDuration(){
        if(this.currentReport.startDate && this.currentReport.endDate){
            var time = new Date(this.currentReport.endDate).getTime() - new Date(this.currentReport.startDate).getTime();
            time = time + 86400001;
            this.currentReport.duration = this.humanizer.humanize(time, { largest: 2, units: ['y', 'mo'], round: true});
        }else{
            this.currentReport.duration = 'No end date';
        }
    }

    saveReport(){
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const url = '/api/user/' + this.appComp.loggedInUser.id + '/report/'+this.currentReport.id;

        this.http.put(url, this.currentReport, httpOptions).subscribe((report: Report) => {
            this.singleReportDataService.changeMessage(report);
        });
    }

    addNewSection() {
        this.appComp.sectionInModification = true;
        const createSectionModal = this.createSectionModal.nativeElement;
        const titleElem = $(createSectionModal).find('#createSectionLabel');
        $(titleElem).html('Add new section');
        $(createSectionModal).modal('show');
    }


    saveSection() {
        const sectionName = $('#sectionTitleInput');
        if (sectionName.val().trim() === '') {
            this.toastr.warning('Section name cannot be left blank', 'Warning');
            sectionName.focus();
            return;
        }

        const createSectionModal = this.createSectionModal.nativeElement;

        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
        };

        const url = '/api/user/' + this.appComp.loggedInUser.id + '/report/' + this.currentReport.id + '/template/'+this.currentReport.template.id+'/section/'+sectionName.val();

        this.http.post<ReportSectionInfo>(url,this.currentReport, httpOptions).subscribe((info: ReportSectionInfo) => {
            this.singleReportDataService.changeMessage(info.report);

            sectionName.val('');
            //$('#section_' + newSection.id).css('display', 'block');
            $(createSectionModal).modal('hide');
            this.appComp.sectionAdded = true;
            this.sidebar.buildSectionsSideNav(null);
            this.appComp.sectionInModification = false;
            //  this.appComp.selectedTemplate = info.report.template;
            this.router.navigate(['report/section/' + this.getCleanText(info.report.reportDetails.sections.filter((a) => a.id===info.sectionId)[0])]);
        },error => {
            const errorMsg = error as HttpErrorResponse;
            console.log(error);
            const x = {'enableHtml': true,'preventDuplicates': true} as Partial<IndividualConfig>;
            const config: Partial<IndividualConfig> = x;
            if(errorMsg.error.message==='Token Expired'){
                this.toastr.error("Your session has expired", 'Logging you out now...', config);
                setTimeout( () => { this.appComp.logout(); }, 4000 );
            } else {
                this.toastr.error(errorMsg.error.message,"26 We encountered an error", config);
            }
        });
    }

    getCleanText(section:Section): string{
        if(section.sectionName === ''){
            return String(section.id);
        }
        return section.sectionName.replace(/[^_0-9a-z]/gi, '');
    }

    showHistory(type,obj){
        this.adminComp.showHistory(type,obj);
    }

    showWorkflowAssigments(){
        this.adminComp.showWorkflowAssigments();
    }
}
