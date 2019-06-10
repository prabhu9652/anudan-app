import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GrantDataService} from '../grant.data.service';
import {Grant, Note, Submission, Tenants} from '../model/dahsboard';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ElementRef} from '@angular/core';
import {KpiSubmissionData, SubmissionData, UploadFile} from '../model/KpiSubmissionData';
import {SubmissionDataService} from '../submission.data.service';
import {Action} from '../model/action';
import {AppComponent} from '../app.component';
import {Filedata} from '../model/filedata';
import {User} from '../model/user';
import * as moment from 'moment';
import _date = moment.unitOfTime._date;

declare var $: any;

@Component({
  selector: 'app-kpisubmission',
  templateUrl: './kpisubmission.component.html',
  styleUrls: ['./kpisubmission.component.scss']
})

export class KpisubmissionComponent implements OnInit {
  currentSubmission: Submission;
  quantitativeKpisToSubmit: Array<any> = [];
  qualitativeKpisToSubmit: Array<any> = [];
  documentKpisToSubmit: Array<any> = [];
  actions: Array<Action> = [];
  loading = false;
  hasAttachments = false;

  @ViewChild('submissionNotesModal') submissionNotesModal: ElementRef;


  constructor(private http: HttpClient,
              private submissionDataService: SubmissionDataService,
              private grantDataService: GrantDataService,
              private router: Router,
              private elem: ElementRef,
              public appComp: AppComponent) {
  }

  ngOnInit(): void {
    this.submissionDataService.currentMessage.subscribe(submission => this.currentSubmission = submission);


    if (this.currentSubmission.flowAuthorities) {
      for (const fa of this.currentSubmission.flowAuthorities) {
        if (!this._contains(this.actions, fa.action)) {
          const a = new Action();
          a.toStateId = fa.toStateId;
          a.name = fa.action;
          a.noteRequired = fa.noteRequired;
          if (!this.actions.some(e => e.name === a.name)) {
            this.actions.push(a);
          }
        }
      }

      for (const quantKpi of this.currentSubmission.quantitiaveKpisubmissions) {
        const kpiData = {
          'kpiDataId': quantKpi.id,
          'kpiType': quantKpi.grantKpi.kpiType,
          'kpiDataTitle': quantKpi.grantKpi.title,
          'kpiDataGoal': quantKpi.goal,
          'kpiDataActuals': quantKpi.actuals,
          'kpiDataNote': quantKpi.note,
          'kpiDataNotes': quantKpi.notesHistory,
          'kpiDataFiles': quantKpi.submissionDocs
        };
        this.quantitativeKpisToSubmit.push(kpiData);
      }

      for (const qualKpi of this.currentSubmission.qualitativeKpiSubmissions) {
        const kpiData = {
          'kpiDataId': qualKpi.id,
          'kpiType': qualKpi.grantKpi.kpiType,
          'kpiDataTitle': qualKpi.grantKpi.title,
          'kpiDataGoal': qualKpi.goal,
          'kpiDataActuals': qualKpi.actuals,
          'kpiDataNote': qualKpi.note,
          'kpiDataNotes': qualKpi.notesHistory,
          'kpiDataFiles': qualKpi.submissionDocs
        };
        this.qualitativeKpisToSubmit.push(kpiData);
      }

      for (const docKpi of this.currentSubmission.documentKpiSubmissions) {
        const kpiData = {
          'kpiDataId': docKpi.id,
          'kpiDataGrantKpiId': docKpi.grantKpi.id,
          'kpiType': docKpi.grantKpi.kpiType,
          'kpiDataTitle': docKpi.grantKpi.title,
          'kpiDataGoal': docKpi.goal,
          'kpiDataActuals': docKpi.actuals,
          'kpiDocType': docKpi.type,
          'kpiDataNote': docKpi.note,
          'kpiDataNotes': docKpi.notesHistory,
          'kpiFiles': docKpi.submissionDocs,
          'templates': docKpi.grantKpi.templates
        };
        this.documentKpisToSubmit.push(kpiData);
      }
    }

    $('#notesModal').on('show.bs.modal', function (event) {
      const triggerElem = $(event.relatedTarget);
      const noteId = triggerElem.attr('data-whatever');
      const noteValHolderElem = $('.note_history_' + noteId);
      const newnoteValHolderElem = $('#note_' + noteId).children();
      const idSplice = noteId.split('_');

      const modal = $(this);
      console.log('>>>>>>' + noteValHolderElem);
      $('#chatPlaceHolder').empty();
      for (const noteMsg of noteValHolderElem) {
        const tempNoteMsg = $(noteMsg).clone();
        $(tempNoteMsg).removeClass('note_history_' + noteId);
        $('#chatPlaceHolder').append($(tempNoteMsg));
      }
      for (const noteMsg of newnoteValHolderElem) {
        $('#chatPlaceHolder').append('<p class="mr-0 mb-0 text-right"><b>Me</b><span class="text-light"><small>'
            + new Date().toLocaleDateString()
            + '</small></span></p> <div class="text-right mx-1 mt-0 mb-1 pt-0 px-2 chat-text"><span> '
            + $(noteMsg).html() + ' </span></div>');
      }
      modal.find('#noteId').attr('data-value', noteId);
    });

    $('#notesModal').on('shown.bs.modal', function (event) {
      $('.holder').animate({scrollTop: $('#chatPlaceHolder').height()}, 0);
    });

    /*$('#submissionNotesModal').on('show.bs.modal', function (event) {
      const modal = $(this);
      const triggerElem = $(event.relatedTarget);
      const noteId = triggerElem.data('whatever');
      modal.find('#submissionNoteId').attr('data-value', noteId);
    });*/

    $('#attachmentsModal').on('show.bs.modal', function (event) {
      const elId =  $(event.relatedTarget).data('whatever');
      $('#attachmentId').val(elId);
      $('#attachmentsPlaceHolder').empty();

      const fileElems = $('#kpi_doc_placeholder_' + elId).children();
      for (let cn = 0; cn < fileElems.length; cn++) {
        let extIcon = 'fa-file-image text-primary';
        switch ($(fileElems[cn]).attr('id').substr($(fileElems[cn]).attr('id').lastIndexOf('.') + 1)) {
          case 'pdf':
            extIcon = 'fa-file-pdf text-danger';
            break;
          case 'doc':
            extIcon = 'fa-file-word text-primary';
            break;
          case 'docx':
            extIcon = 'fa-file-word text-primary';
            break;
          case 'xls':
            extIcon = 'fa-file-excel text-success';
            break;
          case 'xlsx':
            extIcon = 'fa-file-excel text-success';
            break;
        }

        $('#attachmentsPlaceHolder').append('<div class=" container row">'
            + '<div name="fileName" class="col-sm-11 col-lg-11 text-left" id="'
            + $(fileElems[cn]).attr('id') + '">'
            + '<i class="fa ' + extIcon + ' mr-1"></i> '
            + $(fileElems[cn]).attr('id') + '</div><div class="col-sm-1 col-lg-1"><i class="fa fa-minus text-primary ml-2"></i></div></div>');
      }

      $(this).find('#fileSelector').val('');

    });

    $('.removeNoteItem').on('click', function (event) {
      console.log(event);
    });
  }


  submitKpis(event: Event, toStateId: number) {
    const btn = event.srcElement;
    const noteRequired = $(btn).attr('data-value');
    console.log('##########' + noteRequired);
    if (noteRequired === 'true') {
      const submissionModal = this.submissionNotesModal.nativeElement;
      const el = $(submissionModal).find('#submissionNoteId');
      $(el).attr('data-value', $(btn) .data('whatever'));
      $(submissionModal).modal('show');
      return;
    }
    $(btn).append('<i id="spinnerIcon" *ngIf="loading" class="fa fa-spinner fa-spin" ></i>');
    this.loading = true;
    const user = JSON.parse(localStorage.getItem('USER'));
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };


    const elements = this.elem.nativeElement.querySelectorAll('[id^="data_id_"]');
    const kpiSubmissionData: Array<KpiSubmissionData> = [];
    const submissionData = new SubmissionData();

    for (const e of elements) {
      const idComponents = e.id.split('_');
      const kpiData = new KpiSubmissionData();
      kpiData.submissionId = Number(idComponents[2]);
      kpiData.type = idComponents[3];
      kpiData.kpiDataId = Number(idComponents[4]);

      const noteElemId = e.id.replace('data_id', '#note');
      const noteElem = this.elem.nativeElement.querySelector(noteElemId);
      kpiData.notes = new Array();
      for (const el of $(noteElem).children()) {
        kpiData.notes.push($(el).html());
      }


      if (idComponents[3] === 'DOCUMENT') {
        const docElemId = e.id.replace('data_id', '#doc_id');
        const docElem = this.elem.nativeElement.querySelector(docElemId);
        const fileElemId = e.id.replace('data_id', '#doc_placeholder');
        const fileElem = this.elem.nativeElement.querySelector(fileElemId);
        const fileElementsList = $(fileElem).children('[name="fileName"]');
        kpiData.files = new Array<UploadFile>();
        for (let el = 0; el < fileElementsList.length; el++) {
          const file = new UploadFile();
          file.fileName = $(fileElementsList[el]).attr('id');
          file.fileType = file.fileName.substr(file.fileName.lastIndexOf('.') + 1);
          const msg = $(fileElementsList[el]).children('div').html();
          file.value = msg.substr(msg.indexOf(',') + 1);
          kpiData.files.push(file);
        }
      } else {
        kpiData.value = e.value;
        const fileElemId = e.id.replace('data_id', '#kpi_doc_placeholder');
        const fileElem = this.elem.nativeElement.querySelector(fileElemId);
        const fileElementsList = $(fileElem).children('[name="fileName"]');
        kpiData.files = new Array<UploadFile>();
        for (let el = 0; el < fileElementsList.length; el++) {
          const file = new UploadFile();
          file.fileName = $(fileElementsList[el]).attr('id');
          file.fileType = file.fileName.substr(file.fileName.lastIndexOf('.') + 1);
          const msg = $(fileElementsList[el]).children('div').html();
          file.value = msg.substr(msg.indexOf(',') + 1);
          kpiData.files.push(file);
        }
      }

      kpiData.toStatusId = Number(toStateId);
      kpiSubmissionData.push(kpiData);
    }

    submissionData.id = this.currentSubmission.id;
    const submissionNotesToSave = $(this.elem.nativeElement.querySelector('#submissionNotes_' + submissionData.id)).children('[id^="note_item_"]');
    const submissionNotes: Array<string> = [];
    for (let i = 0; i <  submissionNotesToSave.length; i++) {
      console.log('>>>>>>>>' + $(submissionNotesToSave[i]).find('div > span').html());
      submissionNotes.push($(submissionNotesToSave[i]).find('div > span').html());
    }
    submissionData.notes = submissionNotes;
    submissionData.kpiSubmissionData = kpiSubmissionData;


    let url = '/api/user/' + user.id + '/grant/kpi';
    this.http.put(url, submissionData, httpOptions).subscribe((grant: Grant) => {
      /*this.loading = false;
      this.grantDataService.changeMessage(grant);
      this.router.navigate(['grant']);*/

      url = '/api/user/' + user.id + '/grant/' + this.currentSubmission.grant.id;
      this.http.get(url, httpOptions).subscribe((updatedGrant: Grant) => {
        this.loading = false;
        this.grantDataService.changeMessage(updatedGrant);
        this.router.navigate(['grant']);
      });
    });
  }

  docChangeListener($event, type: string, forKPIAttachments: boolean): void {
    this.loading = true;
    this.readThis($event, type, forKPIAttachments);
    this.hasAttachments = true;
  }

  readThis(inputValue: any, type: string, forKPIAttachments: boolean): void {
    if (inputValue.target.files.length <= 0) {
      return;
    } else {
      for (const file of inputValue.target.files) {
        this.loading = true;
        const myReader: FileReader = new FileReader();
        let docTitleElemId = '#' + type + '_';
        if (forKPIAttachments) {
          docTitleElemId = docTitleElemId + $('#attachmentId').val();
        } else {
          docTitleElemId = docTitleElemId + inputValue.target.id.replace('data_id_', '');
        }

        myReader.onloadstart = () => {
          // spinnerElem.classList.add('fa', 'fa-spinner', 'fa-spin');
          this.loading = true;
        };
        myReader.constructor(this.loading);

        myReader.onloadend = () => {
          this.loading = false;
          const thisFile = new Filedata();
          thisFile.name = file.name;
          thisFile.data = myReader.result.toString();
          let extIcon = 'fa-file-image text-primary';
          switch (thisFile.name.substr(thisFile.name.lastIndexOf('.') + 1)) {
            case 'pdf':
              extIcon = 'fa-file-pdf text-danger';
              break;
            case 'doc':
              extIcon = 'fa-file-word text-primary';
              break;
            case 'docx':
              extIcon = 'fa-file-word text-primary';
              break;
            case 'xls':
              extIcon = 'fa-file-excel text-success';
              break;
            case 'xlsx':
              extIcon = 'fa-file-excel text-success';
              break;
          }


          if (forKPIAttachments) {
            $('#doc_icon_' + $('#attachmentId').val()).addClass('text-primary');
            $('#attachmentsPlaceHolder').append('<div class=" container row">'
                + '<div name="fileName" class="col-sm-11 col-lg-11 text-left" id="'
                + thisFile.name + '">'
                + '<i class="fa ' + extIcon + ' mr-1"></i> '
                + thisFile.name + '</div><div class="col-sm-1 col-lg-1"><i class="fa fa-minus text-primary ml-2"></i></div></div>');

            $(docTitleElemId).append('<div name="fileName" class="col-sm-10 col-lg-10" id="'
                + thisFile.name + '"><div style="visibility: hidden;height: 0;">' +
                thisFile.data + '</div></div>');
          } else {
            $(docTitleElemId).append('<div name="fileName" class="col-sm-10 col-lg-10" id="' + thisFile.name +
                '"><i class="fa ' + extIcon + ' mr-1"></i> ' +
                thisFile.name + '<div style="visibility: hidden;height: 0;">' +
                thisFile.data + '</div></div><div class="col-sm-2 col-lg-2"><i class="fa fa-minus text-primary ml-2"></i></div>');
          }

        };
        myReader.readAsDataURL(file);

      }
    }

  }

  saveNote(modal: string, selector: string, placeholder: string) {
    const idHolder = this.elem.nativeElement.querySelector('#' + selector);
    // const messageElem = this.elem.nativeElement.querySelector('#message-text');
    const noteEntriesHolder = this.elem.nativeElement.querySelector('#' + placeholder + '_' + $(idHolder).attr('data-value'));
    const msgEntries = $(idHolder).children();

    // noteEntriesHolder.value = messageElem.value;
    const iconElem = this.elem.nativeElement.querySelector('#icon_' + idHolder.value);
    for (const singleEntry of msgEntries) {
      $(noteEntriesHolder).append(singleEntry);
    }
    /*if (messageElem.value.trim().length > 0) {
      iconElem.classList.add('text-primary');
    } else {
      iconElem.classList.remove('text-primary');
    }*/
    $('#' + modal).modal('hide');
    if (placeholder === 'submissionNote' && $('#submissionBtn_' + $(idHolder).attr('data-value')).attr('data-value') === 'false') {
      /*const submissionNotes = $(idHolder).children();
      for (let i = 0; i < submissionNotes.length; i++) {
        $('#submissionNote_' + $(idHolder).attr('data-value')).append(submissionNotes[i]);
      }*/

      $('#submissionBtn' + $(idHolder).attr('data-value')).click();
    }
  }

  addNote(evnt, selector: string, placeholder: string, user: User) {
    if (evnt.key === 'Enter') {

      const idHolder = this.elem.nativeElement.querySelector('#' + selector);
      const strNote = '<div id="note_item_' + $(idHolder).attr('data-value')
          + '_entry"><p class="mr-0 mb-0 text-right"><b class="bg-secondary p-1 rounded text-white">Me</b><span class="text-light"><small> '
          + new Date().toLocaleDateString() + '</small></span></p>'
          + '<div class=" text-right mx-1 mt-0 mb-1 pt-0  px-2 chat-text"></i><span>'
          + evnt.target.value
          + '</span></div></div>';

      $(idHolder).append(strNote);

      $('#' + placeholder).append(strNote);
      evnt.target.value = '';
      $('.holder').animate({scrollTop: $('#chatPlaceHolder').height()}, 1000);
      console.log($(idHolder).attr('data-value'));
      $('#icon_' + $(idHolder).attr('data-value')).addClass('text-primary');
      if (selector === 'submissionNoteId') {
        const submitBtn = $('[name="submissionBtn_' + $(idHolder).attr('data-value') + '"]');
        for (let i = 0; i < submitBtn.length; i++) {
          submitBtn.attr('data-value', false);
        }
      }
    }
  }

  removeItem(entry: string) {
    $('#' + entry).remove();
    $('#' + entry + '_entry').remove();
  }

  private _contains = (a, obj) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i].action === obj) {
        return true;
      }
    }
    return false;
  };
}

