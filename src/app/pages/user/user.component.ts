import { Component, OnInit } from '@angular/core';
import {DataSummary} from '../../models/turkeydata';
import {DataServicesService} from '../../services/data.service';
import Chart from 'chart.js';
import {isWithinInterval, subDays} from 'date-fns';
import {Subscription} from 'rxjs';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent implements OnInit {

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
  weekDatesLabels = [];
  stateOptions: any[];
  paymentOptions: any[];
  paymentOptions2: any[];
  value1: number;
  value2: number;
  value3: number;



  constructor(private dataService: DataServicesService) {
    this.paymentOptions = [
      {name: 'Son Bir Haftalık Vaka ', value: 1},
      {name: 'Son İki Haftalık Vaka ', value: 2},
      {name: 'Son Bir Aylık Vaka ', value: 3}
    ];
    this.paymentOptions2 = [
      {name: 'Son Bir Haftalık Vaka ', value: 4},
      {name: 'Son İki Haftalık Vaka ', value: 5},
      {name: 'Son Bir Aylık Vaka ', value: 6}
    ];
  }
    ngOnInit() {

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
          // this.initChart();
          this.initChart1(), this.initChart2();
        },
      });
    }
  initChart1() {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];


    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = subDays(today, 6);

    // Get this week data
    const myWeekData = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      const result = isWithinInterval(csDate, { start: startOfWeek, end: today });
      return result;
    });


    this.weekDatesLabels = myWeekData.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate.getMonth()]}`;
    });

    const cases = myWeekData.map((cs) => cs.cases);

    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log(cases);


    this.canvas = document.getElementById('chartEmail');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart1(this.ctx, cases, this.weekDatesLabels);
  }

  drawChart1(ctx, data, weekDatesLabels) {
    let dataSet2;
    {
      dataSet2 = {
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: [
          '#8b0000',
          '#a40000',
          '#cd0000',
          '#ee0000',
          '#ff0000',
          '#f00000',
          '#ff2929',
        ],
        borderWidth: 0,
        data: data,
      };

    }

    this.chartHours = new Chart(this.ctx, {
      type: 'bar',

      data: {
        labels: weekDatesLabels,
        datasets: [dataSet2],
      },
      options: {
        legend: {
          display: false,
        },
        plugins: {
          datalabels: {
            // tslint:disable-next-line:no-shadowed-variable
            formatter: (value, ctx) => {
              const sum = ctx.dataset._meta[0].total;
              const percentage = (value * 100 / sum).toFixed(2) + '%';
              return percentage;
            },
            color: '#fff',
          },
          pieceLabel: {
            render: 'percentage',
            fontColor: ['white'],
            precision: 2,
          },

          tooltips: {
            enabled: false,
          },

          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                },
                gridLines: {
                  drawBorder: false,
                  zeroLineColor: 'transparent',
                  color: 'rgba(255,255,255,0.05)',
                },
              },
            ],

            xAxes: [
              {
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  color: 'rgba(255,255,255,0.1)',
                  zeroLineColor: 'transparent',
                },
                ticks: {
                  display: false,
                },
              },
            ],
          },
        },
      }});
  }

  initChart2() {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];


    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = subDays(today, 6);

    // Get this week data
    const myWeekData = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      const result = isWithinInterval(csDate, { start: startOfWeek, end: today });
      return result;
    });


    this.weekDatesLabels = myWeekData.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate.getMonth()]}`;
    });

    const patients = myWeekData.map((cs) => cs.patients);

    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log(patients);


    this.canvas = document.getElementById('chartEmail1');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart2(this.ctx, patients, this.weekDatesLabels);
  }

  drawChart2(ctx, data, weekDatesLabels) {
    let dataSet2;
    {
      dataSet2 = {
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: [
          '#c60000',
          '#00cc00',
          '#00ffff',
          '#0080ff',
          '#ffff00',
          '#CC99FF',
          '#FF8000',
        ],
        borderWidth: 0,
        data: data,
      };

    }

    this.chartHours = new Chart(this.ctx, {
      type: 'bar',

      data: {
        labels: weekDatesLabels,
        datasets: [dataSet2],
      },
      options: {
        legend: {
          display: false,
        },
        plugins: {
          datalabels: {
            // tslint:disable-next-line:no-shadowed-variable
            formatter: (value, ctx) => {
              const sum = ctx.dataset._meta[0].total;
              const percentage = (value * 100 / sum).toFixed(2) + '%';
              return percentage;
            },
            color: '#fff',
          },
          pieceLabel: {
            render: 'percentage',
            fontColor: ['white'],
            precision: 2,
          },

          tooltips: {
            enabled: false,
          },

          scales: {
            yAxes: [
              {
                ticks: {
                  display: false,
                },
                gridLines: {
                  drawBorder: false,
                  zeroLineColor: 'transparent',
                  color: 'rgba(255,255,255,0.05)',
                },
              },
            ],

            xAxes: [
              {
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  color: 'rgba(255,255,255,0.1)',
                  zeroLineColor: 'transparent',
                },
                ticks: {
                  display: false,
                },
              },
            ],
          },
        },
      }});
  }



  initChart() {
    this.datatable = [];
    this.weeklyTable = [];

    this.dataSummaries.forEach((cs) => {
      this.datatable.push([cs.date, cs.cases]);
    });

    // son 7 günün  chartta gösterilmesi
    const totalCases = [];
    const totalDeath = [];
    const totalTests = [];

    for (let i = 0; i < 7; i++) {
      this.weeklyTable[i] = this.datatable[this.datatable.length - 1];
      this.datatable.length -= 1;
    }

    console.log(this.weeklyTable);

    this.canvas = document.getElementById('chartHours');
    this.ctx = this.canvas.getContext('2d');

    this.chartHours = new Chart(this.ctx, {
      type: 'line',

      data: {
        labels: [],
        datasets: [
          {
            borderColor: '#6bd098',
            backgroundColor: '#6bd098',
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: totalTests, // test sayısı
          },
          {
            borderColor: '#f17e5d',
            backgroundColor: '#f17e5d',
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: totalCases, // vaka sayısı
          },
          {
            borderColor: '#fcc468',
            backgroundColor: '#fcc468',
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 3,
            data: totalDeath, // ölüm sayısı son 1 hafta
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },

        tooltips: {
          enabled: false,
        },

        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: '#9f9f9f',
                beginAtZero: false,
                maxTicksLimit: 5,
                // padding: 20
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: '#ccc',
                color: 'rgba(255,255,255,0.05)',
              },
            },
          ],

          xAxes: [
            {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: 'transparent',
                display: false,
              },
              ticks: {
                padding: 20,
                fontColor: '#9f9f9f',
              },
            },
          ],
        },
      },
    });
  }

}
