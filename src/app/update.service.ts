import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { first } from 'rxjs/operators';
@Injectable()
export class UpdateService {

  constructor(private appRef: ApplicationRef, private updates: SwUpdate) {
  }

  checkForUpdates(){

    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    console.log('Checking for updates ' + appIsStable$);
    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }
}