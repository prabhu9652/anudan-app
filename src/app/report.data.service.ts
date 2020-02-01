import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Report} from './model/report'

@Injectable({
  providedIn: 'root',
})
export class ReportDataService {

  private messageSource = new BehaviorSubject<Report[]>(null);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: Report[]) {
    this.messageSource.next(message)
  }

}
