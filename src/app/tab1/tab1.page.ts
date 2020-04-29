import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service'
import { Chart } from 'chart.js';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild("lineCanvas", {static: true}) lineCanvas: ElementRef;

  private lineChart: Chart;

  constructor(private db: DatabaseService) {
    
  }

  ngOnInit() {
    this.db.getData().subscribe(data => {
      if(isNullOrUndefined(data)) return

      console.log("data", data)

      data.map(d => {
        return d.time = new Date(d.time);
      })

      data.sort((a, b) => a.time.getTime() - b.time.getTime())

      let xAxis = data.map(d => {
        return d.time.getHours() + ":" + d.time.getMinutes() + ":" + d.time.getSeconds()
      });

      let temps = data.map(element => {
        return element.temp
      });

      let light_b = data.map(element => {
        return element.light_b
      });

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: "line",
        data: {
          labels: ['-20', '-10', '-5', '0'],
          datasets: [
            {
              label: "Temperature",
              data: temps,
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              spanGaps: false
            },
            {
              label: "Light blue",
              data: light_b
            }
          ]
        }
      });
    })
  }

}
