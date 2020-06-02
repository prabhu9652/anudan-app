import { Injectable } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class UserService{

    getUser(){
        return JSON.parse(localStorage.getItem('USER'));
    }
}