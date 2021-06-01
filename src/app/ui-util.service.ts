import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiUtilService {

  constructor() { }

  public getCardStyle(flag: boolean) {
    if (flag) {
      return [
        'row',
        'w-100',
        'p-3',
        'mb-2',
        'mx-0',
        'grants-section',
        'owner-highlight'
      ];
    } else {
      return ['row', 'w-100', 'p-3', 'mb-2', 'mx-0', 'grants-section']
    }
  }
}
