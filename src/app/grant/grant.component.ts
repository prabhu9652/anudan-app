import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { Grant } from '../model/dahsboard'


@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss']
})
export class GrantComponent implements OnInit {

  currentGrant: Grant;
  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(grant => this.currentGrant = grant);
    console.log(this.currentGrant);
  }

}
