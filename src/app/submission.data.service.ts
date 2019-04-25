import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {Grant, Submission} from './model/dahsboard'

@Injectable({
  providedIn: 'root',
})
export class SubmissionDataService {

  private messageSource = new BehaviorSubject<Submission>(null);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: Submission) {
    this.messageSource.next(message)
  }

}
