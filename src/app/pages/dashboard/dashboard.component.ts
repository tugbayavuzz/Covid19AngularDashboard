import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {endOfWeek, isSameWeek, subWeeks} from 'date-fns';
import {DataSummary} from '../../models/turkeydata';
import {DataServicesService} from '../../services/data.service';
import {formatDate} from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public canvas: any;
  public ctx;
  public secondCanvas: any;
  public secondCtx;
  public thirdCanvas: any;
  public thirdCtx;
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
  date = '';
  dataSummaries: DataSummary[];
  datatable = [];
  weeklyTable = [];
  dateoflast7day: any = [];

  constructor(private dataService: DataServicesService) {
  }
  ngOnInit() {
    this.dataService.getDailyJsonData().subscribe({
      next: (res) => {
        console.log(res);
        this.dataSummaries = res;
        res.forEach((cs) => {
          if (!Number.isNaN(cs.date)) {
            this.patients = cs.patients;
            this.date = cs.date;
            this.critical = cs.critical;
            this.cases = cs.cases;
            this.recovered = cs.recovered;
            this.pneumoniaPercent = cs.pneumoniaPercent;
            this.deaths = cs.deaths;
            this.tests = cs.tests;
          }
        });
        // this.initChart();
        this.initChart1(), this.initChart2(), this.initChart3();
      },
    });
  }

  initChart1() {
    let today1 = new Date();
    if (today1 !== endOfWeek(new Date(), {weekStartsOn: 1})) {
      today1 = subWeeks(today1, 1);
    }
    // Get this week data
    const myWeekData = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      const result = isSameWeek(csDate, today1, {weekStartsOn: 1});
      return result;
    });

    const cases = myWeekData.map((cs) => cs.cases);
    const deaths = myWeekData.map((cs) => cs.deaths);
    const tests = myWeekData.map((cs) => cs.tests);

    console.log('Chart1');
    console.log(cases);
    console.log(deaths);
    console.log(tests);

    this.canvas = document.getElementById('chartHours');
    this.ctx = this.canvas.getContext('2d');

    this.secondCanvas = document.getElementById('chartSecond');
    this.secondCtx = this.secondCanvas.getContext('2d');

    this.thirdCanvas = document.getElementById('chartThird');
    this.thirdCtx = this.thirdCanvas.getContext('2d');

    this.drawChart1(this.ctx, cases, 'cases');
    this.drawChart1(this.secondCtx, deaths, 'deaths');
    this.drawChart1(this.thirdCtx, tests, 'tests');
  }



  drawChart1(ctx, data, type) {
    let dataSet;
    switch (type) {
      case 'cases':
        dataSet = {
          borderColor: '#f17e5d',
          backgroundColor: '#f17e5d',
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          data: data, // vaka sayısı
        };
        break;
      case 'deaths':
        dataSet = {
          borderColor: '#fcc468',
          backgroundColor: '#fcc468',
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          data: data, // ölüm sayısı son 1 hafta
        };
        break;
      case 'tests':
        dataSet = {
          borderColor: '#6bd098',
          backgroundColor: '#6bd098',
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 3,
          data: data, // test sayısı
        };
        break;
    }

    this.chartHours = new Chart(ctx, {
      type: 'line',

      data: {
        labels: [1, 2, 3, 4, 5, 6, 7],
        datasets: [dataSet],
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
                maxTicksLimit: 4,
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


  initChart2() {
    let today = new Date();
    if (today !== endOfWeek(new Date(), {weekStartsOn: 1})) {
      today = subWeeks(today, 1);
    }
    // Get this week data
    const myWeekData = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      const result = isSameWeek(csDate, today, {weekStartsOn: 1});
      return result;
    });

    const cases = myWeekData.map((cs) => cs.cases);


    console.log('Chart2');
    console.log(cases);


    this.canvas = document.getElementById('chartEmail');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart2(this.ctx, cases, 'cases');

  }

  drawChart2(ctx, data, type) {
    let dataSet2;

    switch (type) {
      case 'cases':
        dataSet2 = {
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            '#4acccd',
            '#fcc468',
            '#ef8157',
            '#6bd098',
            '#90EE90',
            '#dcdcdc',
            '#000000',
          ],
          borderWidth: 0,
          data: data,
        };
        break;
    }

    this.chartEmail = new Chart(this.ctx, {
      type: 'pie',

      data: {
        labels: [1, 2, 3, 4, 5, 6, 7],
        datasets: [dataSet2],
      },
      options: {
        legend: {
          display: false,
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
    });
  }


  initChart3() {
    let today = new Date();
    if (today !== endOfWeek(new Date(), {weekStartsOn: 1})) {
      today = subWeeks(today, 1);
    }
    // Get this week data
    const myWeekData = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      const result = isSameWeek(csDate, today, {weekStartsOn: 1});
      return result;
    });

    const cases = myWeekData.map((cs) => cs.cases);
    const deaths = myWeekData.map((cs) => cs.deaths);
    const tests = myWeekData.map((cs) => cs.tests);


    console.log('Chart3');
    console.log(cases);
    console.log(deaths);
    console.log(tests);


    this.canvas = document.getElementById('speedChart');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart3(this.ctx, cases, 'cases');
    this.drawChart3(this.ctx, deaths, 'deaths');
    this.drawChart3(this.ctx, tests, 'tests');

  }

  drawChart3(ctx, data, type) {
    let dataFirst, dataSecond, dataThird;

    switch (type) {
      case 'cases':
        dataFirst = {
          data: data, // Test
          fill: false,
          borderColor: '#fbc658',
          backgroundColor: 'transparent',
          pointBorderColor: '#fbc658',
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBorderWidth: 8,
        };
        break;

      case 'tests':
        dataSecond = {
          data: data, // vaka
          fill: false,
          borderColor: '#51CACF',
          backgroundColor: 'transparent',
          pointBorderColor: '#51CACF',
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBorderWidth: 8,
        };
        break;

      case 'deaths':
        dataThird = {
          data: data, // vefat
          fill: false,
          borderColor: '#ef8157',
          backgroundColor: 'transparent',
          pointBorderColor: '#ef8157',
          pointRadius: 4,
          pointHoverRadius: 4,
          pointBorderWidth: 8,
        };
        break;
    }


    const speedData = {
      labels: ['Pzt', 'Salı', 'Çarş', 'Perş', 'Cuma', 'Cmt', 'Pzr'],
      datasets: [dataFirst, dataSecond, dataThird],
    };

    const chartOptions = {
      legend: {
        display: false,
        position: 'top',
      },
    };
    const canvas = document.getElementById('speedChart');
    const speedChart = new Chart(canvas, {
      type: 'line',
      hover: false,
      data: speedData,
      options: chartOptions,
    });
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
    const totalDate = [];

    for (let i = 0; i < 7; i++) {
      const dailyResult = this.dataSummaries[i];
      totalCases.push(dailyResult.cases);
      totalDeath.push(dailyResult.deaths);
      totalTests.push(dailyResult.tests);
      this.weeklyTable[i] = this.datatable[this.datatable.length - 1];
      this.datatable.length -= 1;
    }
 /*   for (let i = 0; i < 7; i++) {
      const dailyResult = this.dataSummaries[i];
      totalDate.push(dailyResult.date);
      this.dateoflast7day[i] = this.weeklyTable[this.weeklyTable.length - 1];
      this.weeklyTable.length -= 1;
    }

  */

    console.log(totalCases);
    console.log(totalDeath);
    console.log(totalTests);

    this.canvas = document.getElementById('chartHours');
    this.ctx = this.canvas.getContext('2d');

    this.chartHours = new Chart(this.ctx, {
      type: 'line',

      data: {
        labels: ['Pzt', 'Salı', 'Çarş', 'Perş', 'Cuma', 'Cmt', 'Pzr'],
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
