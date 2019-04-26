import {Component, ElementRef, OnInit} from '@angular/core';
import {User} from '../model/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ErrorMessage} from '../model/error-message';
import {AppComponent} from '../app.component';
declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  constructor(private http: HttpClient, private elem: ElementRef, private appComp: AppComponent) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('USER'));
  }

  savePasswordChange() {
    const oldPwdElem = this.elem.nativeElement.querySelector('#old_pwd');
    const newPwdElem = this.elem.nativeElement.querySelector('#new_pwd');
    const repeatPwdElem = this.elem.nativeElement.querySelector('#repeat_new_pwd');

    if (!oldPwdElem.value) {
      alert('Please enter your current password');
      return;
    }

    if (!newPwdElem.value) {
      alert('Please enter a valid new password');
      return;
    }
    if (!repeatPwdElem.value) {
      alert('Please enter a valid repeat password');
      return;
    }
    if (repeatPwdElem.value !== newPwdElem.value) {
      alert('Your new and repeat passwords do not match');
      return;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    let url = '/api/users/' + this.user.id + '/validate-pwd';
    this.http.post(url, oldPwdElem.value, httpOptions).subscribe((result: ErrorMessage) => {
      if (!result.success) {
        alert(result.message);
      } else {
        url = '/api/users/' + this.user.id + '/pwd';
        this.http.post(url, newPwdElem.value, httpOptions).subscribe((user: User) => {
          localStorage.removeItem('USER');
          localStorage.setItem('USER', JSON.stringify(user));
          const changePwdModalElem = this.elem.nativeElement.querySelector('#changePwdModal');
          $(changePwdModalElem).modal('hide');
        });
      }
    });
  }


  updateProfile() {
    console.log(this.user);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
        'Authorization': localStorage.getItem('AUTH_TOKEN')
      })
    };

    const url = '/api/users/';
    this.http.put(url, this.user, httpOptions).subscribe((user: User) => {

      localStorage.removeItem('USER');
      localStorage.setItem('USER', JSON.stringify(user));
      this.appComp.loggedInUser = user;
    });
  }
}
