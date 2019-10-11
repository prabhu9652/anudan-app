import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.css']
})
export class TenantsComponent implements OnInit {

    @ViewChild("tenantName") tenantNameElem: ElementRef;
    @ViewChild("tenantAdmin") tenantAdminElem: ElementRef;
    @ViewChild("tenantSlug") tenantSlugElem: ElementRef;
    @ViewChild("tenantLogo") tenantLogoElem: ElementRef;

  constructor(
    private http: HttpClient,
    private appComp: AppComponent
  ) {}

  ngOnInit() {}

    createTenant(){
        const tenantName = this.tenantNameElem.nativeElement.value;
        const tenantAdmin = this.tenantAdminElem.nativeElement.value;
        const tenantSlug = this.tenantSlugElem.nativeElement.value;
        const tenantLogo = this.tenantLogoElem.nativeElement;

        let formData = new FormData();
        for( let i=0; i< tenantLogo.files.length; i++){
            formData.append('file', tenantLogo.files.item(i));
        }

        const endpoint = '/api/granter' + '/user/'+this.appComp.loggedInUser.id  + '/onboard/'+ tenantName + '/slug/'+ tenantSlug + '/granterUser/' + tenantAdmin;

        const httpOptions = {
            headers: new HttpHeaders({
              'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
              'Authorization': localStorage.getItem('AUTH_TOKEN')
            })
            };

            this.http.post(endpoint,formData, httpOptions).subscribe((data) => {
                console.log(data);
            });
    }
}
