import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Grant } from './model/dahsboard'

@Injectable({
  providedIn: 'root',
})
export class GrantDataService {

  private messageSource = new BehaviorSubject<Grant>(null);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: Grant) {
    this.messageSource.next(message)
  }

}
