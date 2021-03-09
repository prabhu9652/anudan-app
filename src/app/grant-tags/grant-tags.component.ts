import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { COMMA } from '@angular/cdk/keycodes';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MessagingComponent } from './../components/messaging/messaging.component';
import { MatAutocompleteSelectedEvent, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Tag } from './../model/dahsboard';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';

@Component({
  selector: 'app-grant-tags',
  templateUrl: './grant-tags.component.html',
  styleUrls: ['./grant-tags.component.scss']
})
export class GrantTagsComponent {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<Tag[]>;
  selectedTags: Tag[] = [];
  initialTags: Tag[] = [];
  allTags: Tag[];


  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private dialogRef: MatDialogRef<GrantTagsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.allTags = data.orgTags;
    this.selectedTags = data.grantTags;
    this.initialTags = data.grantTags;
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: Tag | null) => fruit ? this._filter(fruit) : this.allTags.slice()));

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

  remove(fruit: Tag): void {
    const index = this.selectedTags.findIndex(i => i.id === fruit.id);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: Tag): Tag[] {
    const filterValue = value.name.toLowerCase();

    return this.allTags.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }

  close() {
    let changed = false;
    for (let tg of this.initialTags) {
      if (this.selectedTags.findIndex(f => f.id !== tg.id)) {
        changed = true;
        break;
      }
    }

    for (let tg of this.selectedTags) {
      if (this.initialTags.findIndex(f => f.id !== tg.id)) {
        changed = true;
        break;
      }
    }

    if (this.initialTags.length !== this.selectedTags.length) {
      changed = true;
    }
    this.dialogRef.close({ result: changed, selectedTags: this.selectedTags });
  }
}
