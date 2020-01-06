import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

    logoURL:string;
    orgName: string;
    parameters: any;

  constructor(private appComponent: AppComponent,
  private http: HttpClient, private activatedRoute: ActivatedRoute) {
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
    console.log( this.parameters.type);

    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
            'Authorization': localStorage.getItem('AUTH_TOKEN')
        })
    };

    const url = '/api/user/' + this.appComp.loggedInUser.id + '/grant/' + this.currentGrant.id + '/field/'+attribute.id+'/template/'+event.option.value.id;

    this.http.post<DocInfo>(url,this.currentGrant, httpOptions).subscribe((info: DocInfo) => {
    });
  }

}
