import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  constructor(private db: DatabaseService) {
    let currentDate = new Date();
    var month = currentDate.getUTCMonth() + 1; //months from 1-12
    var day = currentDate.getUTCDate();

    console.log(month, day)
    console.log(typeof day)

    this.db.getData().subscribe(data => {
      data.forEach(d => {
        console.log("dd", d)
        console.log("dd", d.time)
        console.log("dd", d.hum)
        console.log("dd", d.light_r)
      })
    })
  }

}
