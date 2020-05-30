import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import schedule from 'node-schedule';


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  ionViewWillEnter() {
    schedule.scheduleJob({hour: 23, minute: 59}, function(){
      //Schedule daily summary
    });
  }

  setpointLogs: Array<object> = [];

  constructor(private db: DatabaseService) {
    this.db.getSetpointLogs().subscribe(logs => {
      logs.map(d => {
        return d.propertyId = new Date(d.propertyId);
      })
      logs.sort((a, b) => b.propertyId.getTime() - a.propertyId.getTime())
      this.setpointLogs = logs;
    })

    this.db.getData().subscribe(data => {
      data.map(d => {
        return d.time = new Date(d.time);
      })

      data.sort((a, b) => a.time.getTime() - b.time.getTime())

      const yest = new Date();
      yest.setDate(yest.getDate() - 10);  

      const newD = data.filter(d => {
        return d.time.getTime() > yest.getTime()
      })
    })
  }

  generateDailyLog() {

  }

}
