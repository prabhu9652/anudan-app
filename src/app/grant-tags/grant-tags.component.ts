import { AppComponent } from './../app.component';
import { User } from 'app/model/user';
import { FieldDialogComponent } from 'app/components/field-dialog/field-dialog.component';
import { Grant } from 'app/model/dahsboard';
import { GrantTag, OrgTag } from './../model/dahsboard';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { COMMA } from '@angular/cdk/keycodes';
import { ENTER } from '@angular/cdk/keycodes';
import { interval } from "rxjs";
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MessagingComponent } from './../components/messaging/messaging.component';
import { MatAutocompleteSelectedEvent, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, ElementRef, ViewChild, Inject, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-grant-tags',
  templateUrl: './grant-tags.component.html',
  styleUrls: ['./grant-tags.component.scss']
})
export class GrantTagsComponent {
  visible = true;
  selectable = false;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<OrgTag[]>;
  selectedTags: GrantTag[] = [];
  initialTags: GrantTag[] = [];
  allTags: OrgTag[];
  grant: Grant;
  appComp: AppComponent


  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInputLabel') fruitInputLabel: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private dialogRef: MatDialogRef<GrantTagsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private http: HttpClient) {
    this.allTags = data.orgTags;
    this.removable = data.type === 'grant' ? true : false;
    this.selectedTags = Object.assign([], data.grantTags);
    this.initialTags = Object.assign([], data.grantTags);
    this.appComp = data.appComp;
    this.allTags.filter((el) => {
      return (this.initialTags.findIndex(a => a.orgTagId === el.id) < 0);
    });
    this.grant = data.grant;
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: OrgTag | null) => fruit ? this._filter(fruit) : this.allTags.slice()));

    dialogRef.disableClose = true;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      //this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: GrantTag): void {
    const index = this.selectedTags.findIndex(i => i.id === fruit.id);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let tg: GrantTag = new GrantTag();
    tg.grantId = this.grant.id;
    tg.orgTagId = event.option.value.id;
    tg.tagName = event.option.value.name;
    this.selectedTags.push(JSON.parse(JSON.stringify(tg)));
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    this.fruitInput.nativeElement.blur();
    interval(100).subscribe((t) => {
      this.fruitInput.nativeElement.focus();
    });
    //this.fruitInputLabel.nativeElement.click();
  }

  private _filter(value): OrgTag[] {

    let filterValue = null;
    if (this.isObject(value)) {
      filterValue = value.name.toLowerCase()
    } else {
      filterValue = value.toLowerCase();
    }

    return this.allTags.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) >= 0);
  }

  isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  close() {
    let changed = false;
    let newTags: GrantTag[] = [];
    let deletedTags: GrantTag[] = [];
    for (let tg of this.initialTags) {
      if (this.selectedTags.findIndex(f => f.id === tg.id) === -1) {
        changed = true;
        deletedTags.push(tg);
        //break;
      }
    }

    for (let tg of this.selectedTags) {
      if (this.initialTags.findIndex(f => f.orgTagId === tg.orgTagId) === -1) {
        changed = true;
        newTags.push(tg);
        //break;
      }
    }

    /* if (this.initialTags.length !== this.selectedTags.length) {
      changed = true;
    } */

    if (changed) {
      const user: User = JSON.parse(localStorage.getItem('USER'));
      const dg = this.dialog.open(FieldDialogComponent, {
        data: { title: "Grant Tags have been modified", btnMain: "Save changes", btnSecondary: "Not Now" },
        panelClass: "grant-template-class",
      });

      dg.afterClosed().subscribe(result => {
        if (result) {
          const httpOptions = {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
              "X-TENANT-CODE": localStorage.getItem("X-TENANT-CODE"),
              Authorization: localStorage.getItem("AUTH_TOKEN"),
            }),
          };


          for (let tg of newTags) {
            let url = '/api/user/' + user.id + '/grant/' + this.grant.id + '/tags/' + tg.orgTagId;
            this.http.post(url, {}, httpOptions).subscribe((result: GrantTag) => {
              this.grant.tags.push(result);
            });
          }

          for (let tg of deletedTags) {
            let url = '/api/user/' + user.id + '/grant/' + this.grant.id + '/tags/' + tg.id;
            this.http.delete(url, httpOptions).subscribe((result) => {
              const idx = this.grant.tags.findIndex(gt => gt.id === tg.id);
              this.grant.tags.splice(idx, 1);
            });
          }
        } else {
          dg.close();
        }
      });
    }
    this.dialogRef.close({ result: changed, selectedTags: this.selectedTags });
  }

  canManageTags(): boolean {
    const isAdmin = this.data.type !== 'grant' ? false : this.appComp.loggedInUser.userRoles.filter((ur) => ur.role.name === 'Admin').length > 0;
    const grantNotActiveOrClosed = (this.grant.grantStatus.internalStatus !== 'ACTIVE' && this.grant.grantStatus.internalStatus !== 'CLOSED');
    let activeOrClosedStateOwner = false;
    if (!grantNotActiveOrClosed) {
      if (this.data.type === 'grant') {
        const idx = this.grant.workflowAssignments.findIndex(a => a.stateId === this.grant.grantStatus.id && a.assignments === this.appComp.loggedInUser.id);
        if (idx >= 0) {
          activeOrClosedStateOwner = true;
        }
      }
    }

    return (isAdmin || grantNotActiveOrClosed || activeOrClosedStateOwner);
  }

  checkDisabled(tag: OrgTag): boolean {
    if (tag.disabled || this.selectedTags.findIndex(f => f.orgTagId === tag.id) > -1) {
      return true;
    } else {
      return false;
    }
  }
}
