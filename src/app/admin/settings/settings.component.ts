import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AppComponent} from '../../app.component';
import {AppSetting} from '../../model/setting'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  appSettings:AppSetting[]

  constructor(
    private http: HttpClient,
    public appComp: AppComponent
  ) {}

  ngOnInit() {
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
        })
    };
    const user = this.appComp.loggedInUser;
    const url = 'api/admin/settings/'+user.id+'/'+user.organization.id;

    this.http.get(url,httpOptions).subscribe((settings:AppSetting[]) => {
        this.appSettings = settings;
        for(let setting of this.appSettings){
            if(setting.scheduledTaskConfiguration){
                if(setting.scheduledTaskConfiguration.configuration){
                    if(setting.scheduledTaskConfiguration.configuration.afterNoOfHours){
                       setting.scheduledTaskConfiguration.configuration.afterNoOfDays = setting.scheduledTaskConfiguration.configuration.afterNoOfHours/(24*60);
                    }
                }
            }
        }
    });

  }

  saveSetting(setting: AppSetting){

    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
        })
    };
    const user = this.appComp.loggedInUser;
    const url = 'api/admin/settings/'+user.id+'/'+user.organization.id;

    this.http.post(url,setting,httpOptions).subscribe((savedSetting:AppSetting) =>{
        setting = savedSetting;
    });

  }

  reCalculateDays(setting:AppSetting,ev: Event){
    if(ev){
        setting.scheduledTaskConfiguration.configuration.afterNoOfHours = Number(ev)*24*60;
    }
  }


}
