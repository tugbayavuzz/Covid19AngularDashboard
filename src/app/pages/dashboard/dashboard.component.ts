import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';


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


  constructor() {}

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
              data: [300, 310, 316, 322, 330, 326, 333, 345, 338, 354] //test sayısı
            },
            {
              borderColor: '#f17e5d',
              backgroundColor: '#f17e5d',
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: [320, 340, 365, 360, 370, 385, 390, 384, 408, 420] // vaka sayısı
            },
            {
              borderColor: '#fcc468',
              backgroundColor: '#fcc468',
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: [170, 394, 415, 409, 425, 445, 460, 450, 478, 484] // ölüm sayısı son 1 hafta
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
            data: [342, 480, 530, 258, 456, 789, 172] // son 7 günün verisini dızıye at buraya tanımla.
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
        data: [0, 19, 15, 20, 30, 40, 40, 50, 25, 30, 50, 70],   //Test
        fill: false,
        borderColor: '#fbc658',
        backgroundColor: 'transparent',
        pointBorderColor: '#fbc658',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
      };

      const dataSecond = {
        data: [0, 5, 10, 12, 20, 27, 30, 34, 42, 45, 55, 63],    //vaka
        fill: false,
        borderColor: '#51CACF',
        backgroundColor: 'transparent',
        pointBorderColor: '#51CACF',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8
      };
      const dataThird = {
        data: [8, 58, 18, 18, 21, 28, 38, 84, 48, 85, 55, 69], //vefat
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
    }
}
