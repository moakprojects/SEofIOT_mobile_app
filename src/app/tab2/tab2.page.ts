import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  @ViewChild("tempRange", {static: true}) tempRange: ElementRef;
  @ViewChild("humRange", {static: true}) humRange: ElementRef;
  @ViewChild("lightRange", {static: true}) lightRange: ElementRef;

  temp: number = 0;
  hum: number = 0;
  light: number = 0;

  constructor(private db: DatabaseService) {}

  rangeChange(range) {
    switch (range) {
      case 'temp':
        this.temp = this.tempRange["el"]["value"]
        //this.db.setSetpoints(this.temp, this.hum, this.light);
        break;
      case 'hum':
        this.hum = this.humRange["el"]["value"]
        //this.db.setSetpoints(this.temp, this.hum, this.light);
        break;
      case 'light':
        this.light = this.lightRange["el"]["value"]
        //this.db.setSetpoints(this.temp, this.hum, this.light);
        break;
      default:
        break;
    }

    this.db.setSetpoints(this.temp, this.hum, this.light);
    console.log("t: ", this.temp + " h: " + this.hum + " l: " + this.light)

    
  }

  ngOnInit() {
    console.log("oninit")
    this.db.getSetPoints().subscribe(setpoints => {
      if(setpoints.length === 0) return;
      console.log("setpoint", setpoints)
      this.temp = setpoints.temp;
      this.hum = setpoints.hum;
      this.light = setpoints.light;
    })
  }

}
