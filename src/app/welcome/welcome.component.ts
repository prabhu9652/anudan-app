import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component'
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {GrantDataService} from '../grant.data.service';
import {Grant} from '../model/dahsboard'
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

    logoURL:string;
    orgName: string;
    parameters: any;

  constructor(public appComponent: AppComponent,
  private grantDataService: GrantDataService,
  private http: HttpClient,
  private activatedRoute: ActivatedRoute,
  private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
        this.parameters = params;
    });
  }

  ngOnInit() {

    const tenantCode = localStorage.getItem('X-TENANT-CODE');
    this.logoURL = "/api/public/images/"+tenantCode+"/logo";

    const url = '/api/public/tenant/' + tenantCode;
    this.http.get(url,{responseType: 'text'}).subscribe((orgName) => {
        localStorage.setItem('ORG-NAME',orgName);
        this.orgName = localStorage.getItem('ORG-NAME');
        },error =>{
    });

  }

  navigate(){
    const type = this.parameters.type;
    if(type==='grant'){
        const grantCode = this.parameters.g;
        const queryParams = new HttpParams().set('g', grantCode)
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE')
            }),
            params: queryParams
        };
        const url = '/api/user/'+this.appComponent.loggedInUser.id+'/grant/resolve';

        this.http.get(url,httpOptions).subscribe((grant:Grant) => {
            this.grantDataService.changeMessage(grant);
            this.appComponent.originalGrant = JSON.parse(JSON.stringify(grant));
            this.appComponent.currentView = 'grant';

            this.appComponent.selectedTemplate = grant.grantTemplate;

            if(grant.grantStatus.internalStatus!='ACTIVE' && grant.grantStatus.internalStatus!='CLOSED'){
                this.router.navigate(['grant/basic-details']);
            } else{
                this.appComponent.action = 'preview';
                this.router.navigate(['grant/preview']);
            }
           // this.router.navigate(['grants']);
        });
    }else if(type==='report'){
    }

    /*const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
        })
    };

    const url = '/api/user/' + this.appComponent.loggedInUser.id + '/grant/' + this.currentGrant.id + '/field/'+attribute.id+'/template/'+event.option.value.id;

    this.http.post<DocInfo>(url,this.currentGrant, httpOptions).subscribe((info: DocInfo) => {
    });*/
  }

  showProfile(){
  }

  navigateToOrg(){
    this.router.navigate(['organization/details']);
  }
}
