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
  @ViewChild("timeCanvas", {static: true}) timeCanvas: ElementRef;

  lineChart: Chart;
  timeChart: Chart;

  warning: Array<Object> = [];

  constructor(private db: DatabaseService) {
    
  }

  warningMessage(currentData) {
    this.db.getSetPoints().subscribe(setpoints => {
      const currentDate = new Date();
      const hour = currentDate.getHours();
      const currentSetpoint = setpoints.filter(s => {
        return s.propertyId == hour;
      });
      if(currentSetpoint.length === 0) return;

      console.log("cD", currentData)

      this.warning = [];
      if(currentData.temp < currentSetpoint[0].temp) {
        const label = {
          'title': 'The temperature value is too low',
          'time': currentSetpoint[0].propertyId + "h",
          'setpoint': currentSetpoint[0].temp + "°C",
          'value': Math.round(currentData.temp * 100) / 100 + "°C"
        }
        this.warning.push(label);
      }

      if(currentData.hum < currentSetpoint[0].hum) {
        const label = {
          'title': 'The humidity value is too low',
          'time': currentSetpoint[0].propertyId + "h",
          'setpoint': currentSetpoint[0].hum + "%",
          'value': Math.round(currentData.hum * 100) / 100 + "%"
        }
        this.warning.push(label);
      }

      if(currentData.light_b < currentSetpoint[0].light) {
        const label = {
          'title': 'The light value is too low',
          'time': currentSetpoint[0].propertyId + "h",
          'setpoint': currentSetpoint[0].light + "lux",
          'value': Math.round(currentData.light_b * 100) / 100 + "lux"
        }
        this.warning.push(label);
      }
    });
  }

  ngOnInit() {
    this.db.getData().subscribe(data => {
      if(isNullOrUndefined(data)) return

      data.map(d => {
        return d.time = new Date(d.time);
      })

      data.sort((a, b) => b.time.getTime() - a.time.getTime())

      this.warningMessage(data[0]);

      const dataFilter = data.filter((d, index) => {
        return index <= 14;
      });

      dataFilter.sort((a, b) => a.time.getTime() - b.time.getTime())

      console.log("df", dataFilter)

      const xAxis: Array<String> = [];
      const temps: Array<number> = [];
      const hums: Array<number> = [];
      const light_b: Array<number> = [];
      const light_r: Array<number> = [];

      dataFilter.forEach(d => {
        xAxis.push(d.time.getHours() + ":" + d.time.getMinutes() + ":" + d.time.getSeconds());
        temps.push(Math.round(d.temp * 100) / 100);
        hums.push(Math.round(d.hum * 100) / 100);
        light_b.push(d.light_b);
        light_r.push(d.light_r);
      });

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: "line",
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: {
                callback: function(label, index) {
                  /* if(index === 0) return '-20 min'
                  else if(index === 4) return '-10 min'
                  else if(index === 9) return '-5 min'
                  else if(index === 14) return '0 min'
                  else return '' */
                  return label
                }
              }
            }],
            yAxes: [{
              id: 'A',
              type: 'linear',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: '°C'
              }
            }, {
              id: 'B',
              type: 'linear',
              position: 'right',
              scaleLabel: {
                display: true,
                labelString: '%'
              }
            }]
          }
        },
        data: {
          labels: xAxis,
          datasets: [
            {
              label: "Temperature",
              data: temps,
              yAxisID: 'A',
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
            },
            {
              label: "Humidity",
              data: hums,
              yAxisID: 'B',
            }
          ]
        }
      });

      this.timeChart = new Chart(this.timeCanvas.nativeElement, {
        type: "line",
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              type: 'linear',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: 'Lux'
              }
            }]
          }
        },
        data: {
          labels: xAxis,
          datasets: [
            {
              label: "Light Red",
              data: light_r,
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
              label: "Light Blue",
              data: light_b,
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
    })
  }

}
