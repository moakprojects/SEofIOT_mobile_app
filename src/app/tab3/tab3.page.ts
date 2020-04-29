import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Chart } from 'chart.js';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild("lineCanvasTemp", {static: true}) lineCanvasTemp: ElementRef;
  @ViewChild("lineCanvasHum", {static: true}) lineCanvasHum: ElementRef;
  @ViewChild("lineCanvasLight", {static: true}) lineCanvasLight: ElementRef;

  private lineChartTemp: Chart;
  private lineChartHum: Chart;
  private lineChartLight: Chart;

  constructor(private db: DatabaseService) {
    
  }

  ngOnInit() {
    this.db.getData().subscribe(data => {
      if(isNullOrUndefined(data)) return

      //data.sort((a,b) => a.time - b.time)

      let xAxis = data.map(element => {
        return element.time
      });

      let temps = data.map(element => {
        return element.temp
      });

      this.lineChartTemp = new Chart(this.lineCanvasTemp.nativeElement, {
        type: "line",
        data: {
          labels: xAxis,
          datasets: [
            {
              label: "",
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
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
        }
      });

      this.lineChartHum = new Chart(this.lineCanvasHum.nativeElement, {
        type: "line",
        data: {
          labels: xAxis,
          datasets: [
            {
              label: "",
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
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
        }
      });

      this.lineChartLight = new Chart(this.lineCanvasLight.nativeElement, {
        type: "line",
        data: {
          labels: xAxis,
          datasets: [
            {
              label: "",
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
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
        }
      });
    })
  }

}
