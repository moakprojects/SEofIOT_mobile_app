import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Chart } from 'chart.js';
import { isNullOrUndefined } from 'util';
import { GeneralService } from '../general.service';

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

  temps: Array<number> = [];
  hums: Array<number> = [];
  light_b: Array<number> = [];
  light_r: Array<number> = [];

  from: number = 1;

  data: any = [];

  constructor(private db: DatabaseService, private g: GeneralService) {
    
  }

  ngOnInit() {
    this.db.getData().subscribe(data => {
      if(isNullOrUndefined(data)) return

      this.temps = [];
      this.hums = [];
      this.light_b = [];
      this.light_r = [];

      data.map(d => {
        return d.time = new Date(d.time);
      })

      data.sort((a, b) => a.time.getTime() - b.time.getTime())

      this.generateGraphs(data);

      this.data = data;
    })
  }

  onChange(event){
    this.from = event.target.value;
    this.generateGraphs(this.data);
  }

  generateGraphs(data) {
    const currentDate = new Date();
    const temp = data.filter(d => {
      if(+this.from !== 0 && d.time.getTime() < (currentDate.getTime() - this.from * 86400000)) return false
      return true
    });

    const xAxis = temp.map(d => {
      return this.g.getMonthLabel(d.time.getMonth()) + "." + d.time.getDate() + " " + d.time.getHours() + ":" + d.time.getMinutes() + ":" + d.time.getSeconds();
    })

    data.forEach(element => {
      this.temps.push(element.temp);
      this.hums.push(element.hum);
      this.light_b.push(element.light_b);
      this.light_r.push(element.light_r);
    });

    this.lineChartTemp = new Chart(this.lineCanvasTemp.nativeElement, {
      type: "line",
      data: {
        labels: xAxis,
        datasets: [
          {
            label: "temperature",
            data: this.temps,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "rgba(75,192,192,1)",
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
        responsive: true,
        maintainAspectRatio: false
      }
    });

    this.lineChartHum = new Chart(this.lineCanvasHum.nativeElement, {
      type: "line",
      data: {
        labels: xAxis,
        datasets: [
          {
            label: "humidity",
            data: this.hums,
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    this.lineChartLight = new Chart(this.lineCanvasLight.nativeElement, {
      type: "line",
      options: {
        scales: {
          yAxes: [{
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Lux'
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false
      },
      data: {
        labels: xAxis,
        datasets: [
          {
            label: "Red channel",
            data: this.light_b,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#fc8370",
            borderColor: "#fc8370",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "#fc8370",
            pointBackgroundColor: "#fc8370",
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
            label: "Blue channel",
            data: this.light_r,
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#73b1f4",
            borderColor: "#73b1f4",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "#73b1f4",
            pointBackgroundColor: "#73b1f4",
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
      }
    });
  }

}
