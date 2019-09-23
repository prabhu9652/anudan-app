import { Injectable } from '@angular/core';
import {Observable,ObservableInput} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {AppComponent} from './app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

constructor(private httpClient: HttpClient,public appComp: AppComponent){}

  postFile(userId,grantId, attributeId,filesToUpload: File[]): any {
      const endpoint = '/api/user/' + userId + '/grant/'+grantId+'/attribute/'+attributeId+'/upload';
      const formData: FormData = new FormData();
      for(let file of filesToUpload){
        formData.append('fileKey', file, file.name);
      }

      const httpOptions = {
              headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                  'Authorization': localStorage.getItem('AUTH_TOKEN')
              })
          };

      return this.httpClient
        .post(endpoint, formData, httpOptions)
        .map(() => { return true; })
        .catch((e) => this.handleError(e));
  }

  handleError(error):ObservableInput<{}>{
  return null;
  }

}