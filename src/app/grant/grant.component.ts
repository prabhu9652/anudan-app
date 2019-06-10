import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {GrantDataService} from '../grant.data.service';
import {
  ActionAuthorities,
  Attribute,
  DocumentKpiSubmission,
  Grant, GrantDetails,
  GrantKpi,
  Kpi,
  QualitativeKpiSubmission,
  QuantitiaveKpisubmission,
  Section,
  Submission,
  WorkflowStatus
} from '../model/dahsboard'
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {SubmissionDataService} from '../submission.data.service';
import {AppComponent} from '../app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Colors} from '../model/app-config';
import * as moment from 'moment';
import {MatDatepickerInput} from '@angular/material';

declare var $: any;


@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss'],
  providers: [MatDatepickerInput]
})
export class GrantComponent implements OnInit, AfterViewInit, AfterContentChecked {

  hasKpisToSubmit: boolean;
  kpiSubmissionTitle: string;
  currentGrant: Grant;
  editMode = false;
  firstColumnInitialPosition: number;
  currentSubmission: Submission;
  colors: Colors;

  @ViewChild('editFieldModal') editFieldModal: ElementRef;
  @ViewChild('createFieldModal') createFieldModal: ElementRef;
  @ViewChild('createSectionModal') createSectionModal: ElementRef;
  @ViewChild('createKpiModal') createKpiModal: ElementRef;
  @ViewChild('addKpiButton') addKpiButton: ElementRef;
  @ViewChild('actionBlock') actionBlock: ElementRef;
  @ViewChild('saveGrantButton') saveGrantButton: ElementRef;
  @ViewChild('kpiTypeElem') kpiTypeElem: ElementRef;
  @ViewChild('kpiDescriptionElem') kpiDescriptionelem: ElementRef;

  constructor(private grantData: GrantDataService
      , private submissionData: SubmissionDataService
      , private route: ActivatedRoute
      , private router: Router
      , private submissionDataService: SubmissionDataService
      , private appComp: AppComponent
      , private http: HttpClient
      , private toastr: ToastrService) {
  }

  ngOnInit() {
    this.grantData.currentMessage.subscribe(grant => this.currentGrant = grant);
    this.submissionData.currentMessage.subscribe(submission => this.currentSubmission = submission);

    for (const submission of this.currentGrant.submissions) {
      if (submission.flowAuthorities) {
        this.hasKpisToSubmit = true;
        this.kpiSubmissionTitle = submission.title;
        this.currentSubmission = submission;
        break;
      }
    }

    $('#editFieldModal').on('shown.bs.modal', function (event) {
      $('#editFieldInput').focus();
    });

    $('#createFieldModal').on('shown.bs.modal', function (event) {
      $('#fieldTitleInput').focus();
    });

    $('#createSectionModal').on('shown.bs.modal', function (event) {
      $('#sectionTitleInput').focus();
    });

    $('#createKpiModal').on('shown.bs.modal', function (event) {
      $('#kpiDescription').focus();
    });
  }

  ngAfterViewInit(): void {
    const firstCol = $('.first-column');
    if (firstCol.length) {
      this.firstColumnInitialPosition = firstCol.position().left;
    }
  }

  ngAfterContentChecked(): void {
    this._adjustHeights();
    this._setFlowButtonColors();
  }

  rememberScrollPosition(event: Event) {
    console.log(event);
  }

  viewKpisToSubmit(submissionId: number) {
    for (const submission of this.currentGrant.submissions) {
      if (submission.id === submissionId) {
        this.submissionDataService.changeMessage(submission);
        break;
      }
    }
    this.router.navigate(['kpisubmission']);
  }

  editFieldEntry(identifier: string) {
    console.log(this.currentGrant);
    this._setEditMode(true);
    const editFieldModal = this.editFieldModal.nativeElement;

    const modalTitle = $(editFieldModal).find('#editFieldLabel');
    const modalValue = $(editFieldModal).find('#editFieldInput');
    const modalIdHolder = $(editFieldModal).find('#editFieldIdHolder');
    $(modalTitle).html($('#attribute_name_id_' + identifier).html());
    $(modalValue).val($('#attribute_value_id_' + identifier).html());
    $(modalIdHolder).val(identifier);

    $(modalValue).focus();
    $(editFieldModal).modal('show');
  }


  deleteFieldEntry() {
    console.log('Delete field');
  }

  saveField() {
    const identifier = $('#editFieldIdHolder').val();
    const inputField = $('#editFieldInput');

    if (inputField.val().trim() === '') {
      this.toastr.warning('Field value cannot be left blank', 'Warning');
      inputField.focus();
      return;
    }
    console.log('>>>>>> ' + identifier);
    $('#attribute_value_id_' + identifier).html($('#editFieldInput').val());
    $('#attribute_value_id_' + identifier).addClass('bg-warning');
    const editFieldModal = this.editFieldModal.nativeElement;
    const sectionId = $('#attribute_value_id_' + identifier).attr('data-section');
    const attributeId = $('#attribute_value_id_' + identifier).attr('data-attribute');
    console.log(sectionId + '   ' + attributeId);

    const grant = this.currentGrant;
    for (const section of grant.grantDetails.sections) {
      if (section.id === Number(sectionId)) {
        console.log(section);
        for (const attrib of section.attributes) {
          if (attrib.id === Number(attributeId)) {
            console.log(attrib);
            attrib.fieldValue = inputField.val();
            this.grantData.changeMessage(grant);
          }
        }
      }
    }

    $(editFieldModal).modal('hide');

  }

  updateGrant(event: Event) {
    const fieldElem = (<HTMLInputElement>event.target);
    const fielId = $(fieldElem).attr('id');
    const fieldVal = $(fieldElem).val();
    switch (fielId) {
      case 'grantName':
        this.currentGrant.name = fieldVal;
        break;
      case 'grantDesc':
        this.currentGrant.description = fieldVal;
        break;
      case 'grantStart':
        this.currentGrant.startDate = fieldVal;
        break;
      case 'grantEnd':
        this.currentGrant.endDate = fieldVal;
        break;
    }
    this._setEditMode(true);
    this.grantData.changeMessage(this.currentGrant);
  }

  saveGrant() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    const url = '/api/user/' + this.appComp.loggedInUser.id + '/grant/';

    this.http.put(url, this.currentGrant, httpOptions).subscribe((grant: Grant) => {
          this.grantData.changeMessage(grant);
          this._setEditMode(false);
        },
        error => {
          const errorMsg = error as HttpErrorResponse;
          console.log(error);
          this.toastr.error(errorMsg.error.message, errorMsg.error.messageTitle, {
            enableHtml: true
          });
        });
  }

  saveSubmissionAndMove(toStateId: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    let url = '/api/user/' + this.appComp.loggedInUser.id + '/grant/'
        + this.currentGrant.id + '/submission/flow/'
        + this.currentSubmission.submissionStatus.id + '/' + toStateId;

    this.http.put(url, this.currentSubmission, httpOptions).subscribe((submission: Submission) => {
          this.submissionData.changeMessage(submission);

          url = '/api/user/' + this.appComp.loggedInUser.id + '/grant/' + this.currentGrant.id;
          this.http.get(url, httpOptions).subscribe((updatedGrant: Grant) => {
            this.grantData.changeMessage(updatedGrant);
            this.editMode = false;
            this.toastr.info('Submission saved with status <b>'
                + this.currentSubmission.submissionStatus.displayName
                + '</b>', 'Submission Saved')
          });
        },
        error => {
          const errorMsg = error as HttpErrorResponse;
          console.log(error);
          this.toastr.error(errorMsg.error.message, errorMsg.error.messageTitle, {
            enableHtml: true
          });
        });
  }

  addNewFieldToSection(sectionId: string, sectionName: string) {
    const createFieldModal = this.createFieldModal.nativeElement;
    const titleElem = $(createFieldModal).find('#createFieldLabel');
    const idHolderElem = $(createFieldModal).find('#sectionIdHolder');
    $(titleElem).html(sectionName + ' - Create new field');
    $(idHolderElem).val(sectionId);
    $(createFieldModal).modal('show');
  }


  addField() {
    const fieldName = $('#fieldTitleInput');
    const fieldType = $('#fieldValueInput');
    if (fieldName.val().trim() === '') {
      this.toastr.warning('Field Name cannot be left blank', 'Warning');
      fieldName.focus();
      return;
    }
    const createFieldModal = this.createFieldModal.nativeElement;
    const idHolderElem = $(createFieldModal).find('#sectionIdHolder');
    const grant = this.currentGrant;
    for (const section of grant.grantDetails.sections) {
      if (section.id === Number($(idHolderElem).val())) {

        console.log('found it');
        const attribute = new Attribute();
        attribute.fieldName = fieldName.val();
        attribute.fieldType = fieldType.val();
        attribute.fieldValue = '';
        attribute.id = 0 - Math.round(Math.random() * 10000000000);
        section.attributes.push(attribute);
        break;
      }
    }
    this.grantData.changeMessage(grant);
    fieldName.val('');
    this._setEditMode(true);
    $(createFieldModal).modal('hide');
  }


  addNewSection() {
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
    const currentSections = this.currentGrant.grantDetails.sections;
    const newSection = new Section();
    newSection.attributes = [];
    newSection.id = 0 - Math.round(Math.random() * 10000000000);
    newSection.sectionName = sectionName.val();

    currentSections.push(newSection);

    this.grantData.changeMessage(this.currentGrant);

    sectionName.val('');
    $('#section_' + newSection.id).css('display', 'block');
    this._setEditMode(true);
    $(createSectionModal).modal('hide');
  }

  saveSectionAndAddNew() {

    const sectionName = $('#sectionTitleInput');
    if (sectionName.val().trim() === '') {
      this.toastr.warning('Section name cannot be left blank', 'Warning');
      sectionName.focus();
      return;
    }

    const createSectionModal = this.createSectionModal.nativeElement;
    const currentSections = this.currentGrant.grantDetails.sections;
    const newSection = new Section();
    newSection.attributes = [];
    newSection.id = 0 - Math.round(Math.random() * 10000000000);
    newSection.sectionName = sectionName.val();

    currentSections.push(newSection);

    this.grantData.changeMessage(this.currentGrant);

    sectionName.val('');
    this.addNewSection();
    sectionName.focus();
  }

  toggleSection(event: Event, sectionId: string) {
    const trgt = $('#section_' + sectionId);
    const trgtIcon = $(event.target);
    trgt.toggle('slow');

    console.log(trgtIcon.hasClass('fa-chevron-down'));
    if (trgtIcon.hasClass('fa-chevron-down')) {
      trgtIcon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
    } else if (trgtIcon.hasClass('fa-chevron-right')) {
      trgtIcon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
    }
  }

  addNewKpi() {
    const kpiModal = this.createKpiModal.nativeElement;
    $(kpiModal).modal('show');
  }

  saveKpi() {
    const kpiModal = this.createKpiModal.nativeElement;
    const kpiTypeElem = $(this.kpiTypeElem.nativeElement);
    const kpiDesc = $(this.kpiDescriptionelem.nativeElement);
    const id = 0 - Math.round(Math.random() * 10000000000);

    const kpi = new Kpi();
    kpi.id = id;
    kpi.kpiType = kpiTypeElem.val().toUpperCase();
    kpi.description = kpiDesc.val();
    kpi.title = kpiDesc.val();

    this.currentGrant.kpis.push(kpi);

    const submissions = this.currentGrant.submissions;
    const grantKpi = new GrantKpi();

    grantKpi.id = id;
    grantKpi.kpiType = kpiTypeElem.val().toUpperCase();
    grantKpi.title = kpiDesc.val();
    grantKpi.description = kpiDesc.val();
    grantKpi.frequency = 'YEARLY';
    grantKpi.periodicity = 0;
    grantKpi.scheduled = true;

    for (const sub of this.currentGrant.submissions) {
      if (kpiTypeElem.val() === 'Quantitative') {
        const quantKpi = new QuantitiaveKpisubmission();
        quantKpi.goal = 0;
        quantKpi.toReport = true;
        quantKpi.id = 0 - Math.round(Math.random() * 10000000000);
        quantKpi.grantKpi = grantKpi;

        sub.quantitiaveKpisubmissions.push(quantKpi);
      } else if (kpiTypeElem.val() === 'Qualitative') {
        const qualKpi = new QualitativeKpiSubmission();
        qualKpi.goal = '';
        qualKpi.toReport = true;
        qualKpi.id = 0 - Math.round(Math.random() * 10000000000);
        qualKpi.grantKpi = grantKpi;

        sub.qualitativeKpiSubmissions.push(qualKpi);
      } else if (kpiTypeElem.val() === 'Document') {
        const docKpi = new DocumentKpiSubmission();
        docKpi.goal = '';
        docKpi.toReport = true;
        docKpi.id = 0 - Math.round(Math.random() * 10000000000);
        docKpi.grantKpi = grantKpi;

        sub.documentKpiSubmissions.push(docKpi);
      }
      //this.currentGrant.submissions.push(sub);
    }
    this.grantData.changeMessage(this.currentGrant);

    this._setEditMode(true);
    kpiDesc.val('');
    $(kpiModal).modal('hide');
  }

  toggleCheckBox(event: Event, type: string, submissionId: number, kpiDataId: number) {
    this._setEditMode(true);
    const checkBoxVal = (<HTMLInputElement>event.currentTarget).checked;
    const submissions = this.currentGrant.submissions;
    switch (type) {
      case 'quantitative':
        for (const submission of submissions) {
          if (submissionId === submission.id) {
            const quantitativeKpis = submission.quantitiaveKpisubmissions;
            for (const quantKpiData of quantitativeKpis) {
              if (kpiDataId === quantKpiData.id) {
                quantKpiData.toReport = checkBoxVal;
              }
            }
          }
        }
        break;
      case 'qualitative':
        for (const submission of submissions) {
          if (submissionId === submission.id) {
            const qualitativeKpis = submission.qualitativeKpiSubmissions;
            for (const qualKpiData of qualitativeKpis) {
              if (kpiDataId === qualKpiData.id) {
                qualKpiData.toReport = checkBoxVal;
              }
            }
          }
        }
        break;
      case 'document':
        for (const submission of submissions) {
          if (submissionId === submission.id) {
            const docKpis = submission.documentKpiSubmissions;
            for (const docKpiData of docKpis) {
              if (kpiDataId === docKpiData.id) {
                docKpiData.toReport = checkBoxVal;
              }
            }
          }
        }
        break;
    }

    this.grantData.changeMessage(this.currentGrant);
    console.log();
  }

  updateGoal(event: Event, type: string, submissionId: number, kpiDataId: number) {
    this._setEditMode(true);
    const submissions = this.currentGrant.submissions;

    for (const submission of submissions) {
      if (submissionId === submission.id) {
        const quantitativeKpis = submission.quantitiaveKpisubmissions;
        for (const quantKpiData of quantitativeKpis) {
          if (kpiDataId === quantKpiData.id) {
            quantKpiData.goal = Number((<HTMLInputElement>event.currentTarget).value);
          }
        }
      }
    }
  }


  submitGrant(toStateId: number) {
    console.log(toStateId);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    let url = '/api/user/' + this.appComp.loggedInUser.id + '/grant/'
        + this.currentGrant.id + '/flow/'
        + this.currentGrant.grantStatus.id + '/' + toStateId;
    this.http.post(url, this.currentGrant, httpOptions).subscribe((grant: Grant) => {
      /*this.loading = false;
      this.grantDataService.changeMessage(grant);
      this.router.navigate(['grant']);*/

      url = '/api/user/' + this.appComp.loggedInUser.id + '/grant/' + this.currentGrant.id;
      this.http.get(url, httpOptions).subscribe((updatedGrant: Grant) => {
        this.grantData.changeMessage(updatedGrant);
        // this.router.navigate(['grant']);
      });
    });

  }


  postionFirstColumn(event: Event) {
    const dist = event.srcElement.scrollLeft;
    $('.first-column').css('left', dist + 'px');
  }

  private _setEditMode(state: boolean) {
    this.editMode = state;
    if (state) {
      $(this.actionBlock.nativeElement).css('display', 'none');
    } else {
      $(this.actionBlock.nativeElement).css('display', 'block');
    }
  }

  scrollContent (event: Event) {
    const dist =  event.srcElement.scrollLeft;

    $('.kpi-block').css('left', (0 - dist) + 'px');
  }

  updateSubmission(event: Event, kpiType: string, kpiDataId: number) {
    console.log((<HTMLInputElement>event.target).value + '  ' + kpiType + '  ' + kpiDataId);
    switch (kpiType) {
      case 'QUANTITATIVE':
        for (const kpiData of this.currentSubmission.quantitiaveKpisubmissions) {
          if (kpiData.id === kpiDataId) {
            kpiData.actuals = Number((<HTMLInputElement>event.target).value);
          }
        }
        break;
      case 'QUALITATIVE':
        for (const kpiData of this.currentSubmission.qualitativeKpiSubmissions) {
          if (kpiData.id === kpiDataId) {
            kpiData.actuals = (<HTMLInputElement>event.target).value;
          }
        }
        break;
    }

    this.submissionData.changeMessage(this.currentSubmission);
    console.log(this.currentSubmission);
  }

  updateTitle(event: Event, kpiId: number, kpiType: string) {
    const kpiTitleElem = event.target;
    for (const kpi of this.currentGrant.kpis) {
      if (kpi.id === kpiId) {
        kpi.title = (<HTMLInputElement>kpiTitleElem).value;
        kpi.description = (<HTMLInputElement>kpiTitleElem).value;
      }
    }
    switch (kpiType) {
      case 'QUANTITATIVE':
        for (const sub of this.currentGrant.submissions) {
          for (const quantKpi of sub.quantitiaveKpisubmissions) {
            if (quantKpi.grantKpi.id === kpiId) {
              quantKpi.grantKpi.title = (<HTMLInputElement>kpiTitleElem).value;
              quantKpi.grantKpi.description = (<HTMLInputElement>kpiTitleElem).value;
            }
          }
        }
        break;

      case 'QUALITATIVE':
        for (const sub of this.currentGrant.submissions) {
          for (const qualKpi of sub.qualitativeKpiSubmissions) {
            if (qualKpi.grantKpi.id === kpiId) {
              qualKpi.grantKpi.title = (<HTMLInputElement>kpiTitleElem).value;
              qualKpi.grantKpi.description = (<HTMLInputElement>kpiTitleElem).value;
            }
          }
        }
        break;

      case 'DOCUMENT':
        for (const sub of this.currentGrant.submissions) {
          for (const docKpi of sub.documentKpiSubmissions) {
            if (docKpi.grantKpi.id === kpiId) {
              docKpi.grantKpi.title = (<HTMLInputElement>kpiTitleElem).value;
              docKpi.grantKpi.description = (<HTMLInputElement>kpiTitleElem).value;
            }
          }
        }
        break;
    }
    this._setEditMode(true);
    this.grantData.changeMessage(this.currentGrant);
    console.log(this.currentGrant);
  }


  createGrant() {
    const grant = new Grant();
    grant.submissions = new Array<Submission>();
    grant.actionAuthorities = new ActionAuthorities();
    grant.actionAuthorities.permissions = [];
    grant.actionAuthorities.permissions.push('MANAGE');
    grant.grantStatus = new WorkflowStatus();
    grant.grantStatus.name = 'DRAFT';

    grant.startDate = new Date();
    const endDt = new Date();
    grant.endDate = new Date(endDt.setFullYear(endDt.getFullYear() + 2));

    grant.grantStatus.displayName = 'DRAFT';
    grant.substatus = new WorkflowStatus();
    grant.substatus.name = 'NOT SUBMITTED';
    grant.substatus.displayName = 'NOT SUBMITTED';
    grant.kpis = new Array<Kpi>();
    grant.grantDetails = new GrantDetails();
    grant.grantDetails.sections = new Array<Section>();
    for (const defaultSection of this.appComp.appConfig.defaultSections) {
      defaultSection.id = 0 - Math.round(Math.random() * 10000000000);
      for (const attr of defaultSection.attributes) {
        attr.id = 0 - Math.round(Math.random() * 10000000000);
      }
      grant.grantDetails.sections.push(defaultSection);
    }

    grant.submissions = new Array<Submission>();
    for (let i = 0; i < 8; i++) {
      const sub = new Submission();
      sub.id = 0 - Math.round(Math.random() * 10000000000);
      sub.documentKpiSubmissions = [];
      sub.qualitativeKpiSubmissions = [];
      sub.quantitiaveKpisubmissions = [];
      sub.flowAuthorities = [];
      sub.title = 'Quarter ' + (i + 1);
      sub.submitBy = new Date(grant.startDate.getFullYear(), (grant.startDate.getMonth()) + (3 * (i + 1)), grant.startDate.getDate());
      // sub.grant = grant;
      // sub.actionAuthorities = new ActionAuthorities();
      grant.submissions.push(sub);
    }

    this.currentGrant = grant
    this.grantData.changeMessage(grant);
    this.router.navigate(['grant']);
  }

  private _adjustHeights() {
    for (const elem of $('[data-id]')) {
      $(elem).css('height', $('#kpi_title_' + $(elem).attr('data-id')).outerHeight() + 'px');
      // console.log($(elem).css('height'));
    }
  }

  private _setFlowButtonColors() {
    const flowActionBtns = $('[name="flowActionBtn"]');
    for (let elem = 0; elem < flowActionBtns.length; elem++) {
      this.colors = new Colors();
      const color = this.colors.colorArray[elem];
      $(flowActionBtns[elem]).css('background-color', color);
    }
  }

}
