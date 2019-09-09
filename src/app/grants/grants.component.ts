import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../model/user';
import {SerializationHelper, Tenant, Tenants} from '../model/dahsboard';
import {AppComponent} from '../app.component';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {GrantDataService} from '../grant.data.service';
import {DataService} from '../data.service';
import {GrantUpdateService} from '../grant.update.service';
import {Grant,GrantTemplate} from '../model/dahsboard'
import * as $ from 'jquery'
import {ToastrService, IndividualConfig} from 'ngx-toastr';
import {GrantComponent} from "../grant/grant.component";
import {MatBottomSheet, MatDatepickerInputEvent, MatDialog} from '@angular/material';
import {GrantTemplateDialogComponent} from '../components/grant-template-dialog/grant-template-dialog.component';
import {FieldDialogComponent} from '../components/field-dialog/field-dialog.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './grants.component.html',
  styleUrls: ['./grants.component.css'],
  providers: [GrantComponent]
})
export class GrantsComponent implements OnInit {

  user: User;
  tenants: Tenants;
  currentTenant: Tenant;
  hasTenant = false;
  hasKpisToSubmit: boolean;
  kpiSubmissionDate: Date;
  kpiSubmissionTitle: string;
  currentGrant: Grant
  currentGrantId: number;
  grantsDraft = [];
  grantsActive = [];
  grantsClosed = [];

  constructor(private http: HttpClient,
              public appComponent: AppComponent,
              private router: Router,
              private route: ActivatedRoute,
              private data: GrantDataService,
              private toastr: ToastrService,
              public grantComponent: GrantComponent,
              private dataService: DataService,
              private grantUpdateService: GrantUpdateService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('USER'));
    this.appComponent.loggedInUser = user;
    console.log(this.appComponent.loggedInUser.permissions);

    this.dataService.currentMessage.subscribe(id => this.currentGrantId = id);
    this.data.currentMessage.subscribe(grant => this.currentGrant = grant);
    this.fetchDashboard(user.id, this.currentGrant);
    this.grantUpdateService.currentMessage.subscribe(id => {
        if(id){
        //this.fetchDashboard(user.id);
        }
    });
  }

  createGrant(){

  const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
          'Authorization': localStorage.getItem('AUTH_TOKEN')
        })
      };
        const user = JSON.parse(localStorage.getItem('USER'));
      const url = '/api/user/' + user.id + '/grant/templates';
      this.http.get<GrantTemplate[]>(url, httpOptions).subscribe((templates: GrantTemplate[]) => {
          const dialogRef = this.dialog.open(GrantTemplateDialogComponent, {
                data: templates
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result.result) {
                  this.grantComponent.createGrant(result.selectedTemplate);
                  this.appComponent.selectedTemplate = result.selectedTemplate;
                } else {
                  dialogRef.close();
                }
              });
      });

    
  }


  fetchDashboard(userId: string, grant: Grant) {

  if(grant){
    this.saveGrant(grant);
  }else{
  console.log('dashboard');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    this.appComponent.loggedIn = true;

    const url = '/api/users/' + userId + '/dashboard';
    this.http.get<Tenants>(url, httpOptions).subscribe((tenants: Tenants) => {

      // this.tenants = new Tenants();
      this.tenants = tenants;
      console.log(this.tenants);
      // this.tenants = tenants;
        if (this.tenants.tenants && this.tenants.tenants.length > 0) {
        this.currentTenant = this.tenants.tenants[0];
        this.appComponent.currentTenant = this.currentTenant;
        this.hasTenant = true;
        localStorage.setItem('X-TENANT-CODE', this.currentTenant.name);
         this.grantsDraft = [];
         this.grantsActive = [];
         this.grantsClosed = [];
        for (const grant of this.currentTenant.grants) {
          if((grant.actionAuthorities) && (grant.grantStatus.internalStatus === 'DRAFT' && grant.grantStatus.name !== 'DRAFT') || ( grant.grantStatus.internalStatus === 'DRAFT' && grant.createdBy===this.appComponent.loggedInUser.emailId)){
            this.grantsDraft.push(grant); 
          }else if(grant.grantStatus.internalStatus === 'ACTIVE'){
            this.grantsActive.push(grant);
          }else if(grant.grantStatus.internalStatus === 'CLOSED'){
            this.grantsClosed.push(grant);
          }
          for (const submission of grant.submissions) {
            if (submission.flowAuthorities) {
              this.hasKpisToSubmit = true;
              this.kpiSubmissionTitle = submission.title;
              // this.kpiSubmissionDate = submission.submitBy;
              break;
            }
          }
          if (this.hasKpisToSubmit) {
            break;
          }
        }
        this.grantUpdateService.changeMessage(false);
      }
    },
        error1 => {
      const errorMsg = error1 as HttpErrorResponse;
          if(errorMsg.error.message === 'Token Expired'){
            const logoutMsg = this.toastr.error("Your session is expired. Please log back in", errorMsg.error.messageTitle, {
              tapToDismiss: false,
              timeOut: 30000,
              positionClass: 'toast-bottom-center'
            });
            setTimeout(() => 
            {
                this.toastr.clear();   
                this.appComponent.logout();
            },
            5000);
            
          }else {
            this.toastr.error(errorMsg.error.message, errorMsg.error.messageTitle, {
              enableHtml: true,
              positionClass: 'toast-top-center'
            });
          }
          
        });
        }
  }

  manageGrant(grant: Grant) {
        this.dataService.changeMessage(grant.id);
        this.data.changeMessage(grant);
        this.appComponent.currentView = 'grant';

                this.appComponent.selectedTemplate = grant.grantTemplate;

        this.router.navigate(['grant/basic-details']);
  }

  deleteGrant(grant: Grant){
    const dialogRef = this.dialog.open(FieldDialogComponent, {
          data: "Are you sure you want to delete this grant?"
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const httpOptions = {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                            'Authorization': localStorage.getItem('AUTH_TOKEN')
                        })
                    };

                    const url = '/api/user/' + this.appComponent.loggedInUser.id + '/grant/' + grant.id;

                    this.http.delete(url, httpOptions).subscribe( (val: any) => {
                        const user = JSON.parse(localStorage.getItem('USER'));
                        this.fetchDashboard(user.id);
                    });
          } else {
            dialogRef.close();
          }
        });

  }

  saveGrant(grant: Grant) {

          this.appComponent.autosaveDisplay = 'Saving changes...     ';
          /*const errors = this.validateFields();
          if (errors) {
              this.toastr.error($(this.erroredElement).attr('placeholder') + ' is required', 'Missing entries');
              $(this.erroredElement).focus();
          } else {*/
              const httpOptions = {
                  headers: new HttpHeaders({
                      'Content-Type': 'application/json',
                      'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                      'Authorization': localStorage.getItem('AUTH_TOKEN')
                  })
              };

              const url = '/api/user/' + this.appComponent.loggedInUser.id + '/grant/';

              this.http.put(url, grant, httpOptions).toPromise().then((grant: Grant) => {
                      this.originalGrant = JSON.parse(JSON.stringify(grant));
                      this.data.changeMessage(grant);
                      //this.setDateDuration();
                      //this.dataService.changeMessage(grant.id);
                      //this.currentGrant = grant;
                      //this._setEditMode(false);
                      //this.currentSubmission = null;
                      //this.checkGrantPermissions();

                      this.appComponent.autosave = false;
                      //this.appComponent.autosaveDisplay = 'Last saved @ ' + this.datepipe.transform(new Date(), 'hh:mm:ss a') + '     ';
                      this.fetchDashboard(this.appComponent.loggedInUser.id,null);
                  },error => {
                                const errorMsg = error as HttpErrorResponse;
                                //console.log(error);
                                const x = {'enableHtml': true,'preventDuplicates': true} as Partial<IndividualConfig>;
                                const config: Partial<IndividualConfig> = x;
                                if(errorMsg.error.message==='Token Expired'){
                                 this.toastr.error("Your session has expired", 'Logging you out now...', config);
                                 setTimeout( () => { this.appComp.logout(); }, 4000 );
                                } else {
                                 this.toastr.error("Oops! We encountered an error.", errorMsg.error.message, config);
                                }


                              });
          // }
      }
}
