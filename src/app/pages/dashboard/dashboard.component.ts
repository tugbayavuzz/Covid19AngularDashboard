import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import {DataSummary} from '../../models/turkeydata';
import {DataServicesService} from '../../services/data.service';


@Component({

  // tslint:disable-next-line:component-selector
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

  public canvas: any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  patients = 0;
  cases = 0;
  deaths = 0;
  recovered = 0;
  critical = 0;
  pneumoniaPercent = 0;
  tests = 0;
  dataSummaries: DataSummary[];
  datatable = [];
  weeklyTable = [];

  constructor(private dataService: DataServicesService) {}

    ngOnInit() {
      this.chartColor = '#FFFFFF';
      this.canvas = document.getElementById('chartHours');
      this.ctx = this.canvas.getContext('2d');

      this.chartHours = new Chart(this.ctx, {

        type: 'line',

        data: {
          labels: ['Pzt', 'Salı', 'Çarş', 'Perş', 'Cuma', 'Cmt', 'Pzr'],
          datasets: [{
              borderColor: '#6bd098',
              backgroundColor: '#6bd098',
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: [this.tests] // test sayısı
            },
            {
              borderColor: '#f17e5d',
              backgroundColor: '#f17e5d',
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: [this.cases] // vaka sayısı
            },
            {
              borderColor: '#fcc468',
              backgroundColor: '#fcc468',
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: [this.deaths] // ölüm sayısı son 1 hafta
            }
          ]
        },
        options: {
          legend: {
            display: false
          },

          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                fontColor: '#9f9f9f',
                beginAtZero: false,
                maxTicksLimit: 5,
                // padding: 20
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: '#ccc',
                color: 'rgba(255,255,255,0.05)'
              }

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent',
                display: false,
              },
              ticks: {
                padding: 20,
                fontColor: '#9f9f9f'
              }
            }]
          },
        }
      });


      this.canvas = document.getElementById('chartEmail');
      this.ctx = this.canvas.getContext('2d');
      this.chartEmail = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: [1, 2, 3, 4 , 5 , 6 , 7],
          datasets: [{
            label: 'Emails',
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: [
              '#4acccd',
              '#fcc468',
              '#ef8157',
              '#6bd098',
              '#90EE90',
              '#dcdcdc',
              '#000000'
            ],
            borderWidth: 0,
            data: [this.cases] // son 7 günün verisini dızıye at buraya tanımla.
          }]
        },

        options: {

          legend: {
            display: false
          },

          pieceLabel: {
            render: 'percentage',
            fontColor: ['white'],
            precision: 2
          },

          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                display: false
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: 'transparent',
                color: 'rgba(255,255,255,0.05)'
              }

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent'
              },
              ticks: {
                display: false,
              }
            }]
          },
        }
      });

      const speedCanvas = document.getElementById('speedChart');

      const dataFirst = {
        data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70],   // Test
        fill: false,
        borderColor: '#fbc658',
        backgroundColor: 'transparent',
        pointBorderColor: '#fbc658',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
      };

      const dataSecond = {
        data: [0, 5, 10, 12, 20, 27, 30, 34, 42, 45, 55, 63],    // vaka
        fill: false,
        borderColor: '#51CACF',
        backgroundColor: 'transparent',
        pointBorderColor: '#51CACF',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8
      };
      const dataThird = {
        data: [8, 58, 18, 18, 21, 28, 38, 84, 48, 85, 55, 69], // vefat
        fill: false,
        borderColor: '#ef8157',
        backgroundColor: 'transparent',
        pointBorderColor: '#ef8157',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8
      };

      const speedData = {
        labels: ['Pzt', 'Salı', 'Çarş', 'Perş', 'Cuma', 'Cmt', 'Pzr'],
        datasets: [dataFirst, dataSecond, dataThird]
      };

      const chartOptions = {
        legend: {
          display: false,
          position: 'top'
        }
      };

      const lineChart = new Chart(speedCanvas, {
        type: 'line',
        hover: false,
        data: speedData,
        options: chartOptions
      });


      this.dataService.getDailyJsonData().subscribe({
        next: (res) => {
          console.log(res);
          this.dataSummaries = res;
          res.forEach((cs) => {
            if (!Number.isNaN(cs.date)) {
              this.patients = cs.patients;
              this.critical = cs.critical;
              this.cases = cs.cases;
              this.recovered = cs.recovered;
              this.pneumoniaPercent = cs.pneumoniaPercent;
              this.deaths = cs.deaths;
              this.tests = cs.tests;
            }
          });
          this.initChart();
        },
      });

    }


  initChart() {
    this.datatable = [];
    this.weeklyTable = [];

    this.dataSummaries.forEach((cs) => {
      this.datatable.push([cs.date, cs.cases]);
    });
    // son 7 günün :) chartta gösterilmesi ama çalışmıyor .ÇALIŞTI.
    for (let i = 0; i < 7; i++) {
      this.weeklyTable[i] = this.datatable[this.datatable.length - 1];
      this.datatable.length -= 1;
    }
    console.log(this.weeklyTable);
  }

}
