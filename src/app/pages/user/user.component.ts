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
  weekDatesLabels2 = [];
  weekDatesLabels3 = [];
  stateOptions: any[];
  paymentOptions: any[];
  paymentOptions2: any[];
  data1 = [];
  data2 = [];
  data3 = [];
  data4 = [];
  data5 = [];
  data6 = [];



  constructor(private dataService: DataServicesService) {
    this.paymentOptions = [
      {name: 'Son Bir Haftalık Vaka ', value: 1},
      {name: 'Son İki Haftalık Vaka ', value: 2},
      {name: 'Son Bir Aylık Vaka ', value: 3}
    ];
    this.paymentOptions2 = [
      {name: 'Son Bir Haftalık Vefat ', value: 4},
      {name: 'Son İki Haftalık Vefat ', value: 5},
      {name: 'Son Bir Aylık Vefat ', value: 6}
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
    const startOfWeek2 = subDays(today, 14); // for two weeks
    const startOfWeek3 = subDays(today, 30);

    // Get this week data
    const myWeekData = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      const result = isWithinInterval(csDate, { start: startOfWeek, end: today });
      return result;
    });
    // last two week data
    const myWeekData2 = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate2 = new Date(+year, +month - 1, +day);
      const result2 = isWithinInterval(csDate2, { start: startOfWeek2, end: today });
      return result2;
    });
    // last one month data
    const myWeekData3 = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate3 = new Date(+year, +month - 1, +day);
      const result3 = isWithinInterval(csDate3, { start: startOfWeek3, end: today });
      return result3;
    });


    this.weekDatesLabels = myWeekData.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate.getMonth()]}`;
    });

    this.weekDatesLabels2 = myWeekData2.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate2 = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate2.getMonth()]}`;
    });

    this.weekDatesLabels3 = myWeekData3.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate3 = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate3.getMonth()]}`;
    });


    const cases = myWeekData.map((cs) => cs.cases);

    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log('Chart2');
    console.log('Week Data', myWeekData2);
    console.log('Chart3');
    console.log('Week Data', myWeekData3);
    console.log(cases);


    this.canvas = document.getElementById('chartEmail');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart1(this.ctx, cases, this.weekDatesLabels);
    // this.drawChart1(this.ctx, cases, this.weekDatesLabels2);
    // this.drawChart1(this.ctx, cases, this.weekDatesLabels3);
  }

  drawChart1(ctx, data, weekDatesLabels) {
    let dataSet2;
    {
      dataSet2 = {
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: [
          '#4b0d0d',
          '#5d1012',
          '#711314',
          '#841617',
          '#981919',
          '#901919',
          '#3c0c10',
          '#410d11',
          '#460d13',
          '#4b0e14',
          '#4f0e15',
          '#540f15',
          '#590f16',
          '#5e1017',
          '#631017',
          '#681018',
          '#6d1119',
          '#721119',
          '#781219',
          '#7d131a',
          '#82131a',
          '#87141a',
          '#8c141b',
          '#91151b',
          '#96161b',
          '#9b171b',
          '#a1181a',
          '#a6191a',
          '#ab1a1a',
          '#a6191a',
          '#b65253'
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
    const startOfWeek = subDays(today, 30);

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

    const deaths = myWeekData.map((cs) => cs.deaths);

    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log(this.deaths);


    this.canvas = document.getElementById('chartEmail1');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart2(this.ctx, deaths, this.weekDatesLabels);
  }

  drawChart2(ctx, data, weekDatesLabels) {
    let dataSet2;
    {
      dataSet2 = {
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: [
          '#fa6e6e',
          '#f46e66',
          '#ee6e5e',
          '#e76e56',
          '#e06f4f',
          '#d96f49',
          '#d26f42',
          '#ca703d',
          '#c37037',
          '#bb7032',
          '#b3702e',
          '#ac702a',
          '#a46f26',
          '#9c6f23',
          '#946e20',
          '#8d6e1e',
          '#856d1d',
          '#7e6c1c',
          '#776b1c',
          '#6f6a1c',
          '#68681c',
          '#61671d',
          '#5a661f',
          '#536420',
          '#4d6222',
          '#466023',
          '#405e25',
          '#3a5c27',
          '#335a28',
          '#2d582a'
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
