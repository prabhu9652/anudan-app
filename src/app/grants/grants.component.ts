import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../model/user';
import {SerializationHelper, Tenant, Tenants} from '../model/dahsboard';
import {AppComponent} from '../app.component';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {GrantDataService} from '../grant.data.service';
import {DataService} from '../data.service';
import {Grant} from '../model/dahsboard'
import * as $ from 'jquery'
import {ToastrService} from 'ngx-toastr';
import {GrantComponent} from "../grant/grant.component";
import {MatBottomSheet, MatDatepickerInputEvent, MatDialog} from '@angular/material';
import {GrantTemplateDialogComponent} from '../components/grant-template-dialog/grant-template-dialog.component';


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
              private dialog: MatDialog) {
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('USER'));
    this.appComponent.loggedInUser = user;
    this.fetchDashboard(user.id);
    this.dataService.currentMessage.subscribe(id => this.currentGrantId = id);
  }

  createGrant(){
  const dialogRef = this.dialog.open(GrantTemplateDialogComponent, {
      data: this.currentTenant.grantTemplates[0].name
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.grantComponent.createGrant(this.currentTenant.grantTemplates[0].name);
      } else {
        dialogRef.close();
      }
    });
    
  }


  fetchDashboard(userId: string) {
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
        this.hasTenant = true;
        localStorage.setItem('X-TENANT-CODE', this.currentTenant.name);

        for (const grant of this.currentTenant.grants) {
          if(grant.grantStatus.name !== 'APPROVED' && grant.grantStatus.name !== 'CLOSED'){
            this.grantsDraft.push(grant); 
          }else if(grant.grantStatus.name === 'APPROVED'){
            this.grantsActive.push(grant);
          }else if(grant.grantStatus.name === 'CLOSED'){
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

  manageGrant(grant: Grant) {
        this.dataService.changeMessage(grant.id);
        this.data.changeMessage(grant);
        this.appComponent.currentView = 'grant';
        this.router.navigate(['grant/basic-details']);
  }
}
