import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AmountValidator {
  validatePositive(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
