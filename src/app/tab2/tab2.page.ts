import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ToastController } from '@ionic/angular';
import { isNullOrUndefined } from 'util';

export interface Setpoint {
  time: number,
  values: {
    temp: number,
    hum: number,
    light: number
  }
}

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
  setTime: number = 0;

  setPoints: Array<Setpoint> = [];

  constructor(private db: DatabaseService, public toastController: ToastController) {}

  rangeChange(range) {
    switch (range) {
      case 'temp':
        this.temp = this.tempRange["el"]["value"];
        break;
      case 'hum':
        this.hum = this.humRange["el"]["value"];
        break;
      case 'light':
        this.light = this.lightRange["el"]["value"];
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    this.initializeRanges().then(() => {
      this.timeChange();
    })
  }

  initializeRanges() {
    var promise = new Promise(resolve => {
      this.setPoints = [];
      this.db.getSetPoints().subscribe(setpoints => {
        if(isNullOrUndefined(setpoints) || setpoints.length === 0) return;
        setpoints.forEach(point => {
          const element: Setpoint = {
            time: parseInt(point.propertyId), 
            values: {
              temp: point.temp,
              hum: point.hum,
              light: point.light
            }
          };
          this.setPoints.push(element);
        });
        resolve();
      });
    });
    return promise;
  }

  timeChange() {
    const currentSetpoint = this.setPoints.find(point => point.time === this.setTime);
    this.temp = (!isNullOrUndefined(currentSetpoint) ? currentSetpoint.values.temp : 0)
    this.hum = (!isNullOrUndefined(currentSetpoint) ? currentSetpoint.values.hum : 0)
    this.light = (!isNullOrUndefined(currentSetpoint) ? currentSetpoint.values.light : 0)
  }

  async saveSetpoints() {
      const currentDate = new Date();
      this.db.setSetpoints(this.setTime, this.temp, this.hum, this.light);
      this.initializeRanges();
      const toast = await this.toastController.create({
        message: 'Setpoints saved for the specified hour.',
        duration: 2000
      });
      toast.present();
      this.saveLog(this.setTime, this.temp, this.hum, this.light, currentDate);
  }

  saveLog(time: number, temp: number, hum: number, light: number, currentDate: Date) {
    this.db.saveSetpointLog(currentDate, time, temp, hum, light);
  }

}
