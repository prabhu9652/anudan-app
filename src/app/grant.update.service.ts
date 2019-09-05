import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GrantUpdateService {

  private messageSource = new BehaviorSubject<boolean>(false);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: boolean) {
    this.messageSource.next(message)
  }

}