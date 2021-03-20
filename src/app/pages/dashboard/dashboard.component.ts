import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {endOfWeek, isSameWeek, isWithinInterval, subDays, subWeeks} from 'date-fns';
import {DataSummary} from '../../models/turkeydata';
import {DataServicesService} from '../../services/data.service';


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
  dataSummaries: DataSummary[];
  datatable = [];
  weeklyTable = [];
  weekDatesLabels = [];

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

    const weekDatesLabels = myWeekData.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate.getMonth()]}`;
    });


    const cases = myWeekData.map((cs) => cs.cases);
    const deaths = myWeekData.map((cs) => cs.deaths);
    const tests = myWeekData.map((cs) => cs.tests);

    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log(cases);
    console.log(deaths);
    console.log(tests);

    this.canvas = document.getElementById('chartHours');
    this.ctx = this.canvas.getContext('2d');

    this.secondCanvas = document.getElementById('chartSecond');
    this.secondCtx = this.secondCanvas.getContext('2d');

    this.thirdCanvas = document.getElementById('chartThird');
    this.thirdCtx = this.thirdCanvas.getContext('2d');

    this.drawChart1(this.ctx, cases, 'cases', weekDatesLabels);
    this.drawChart1(this.secondCtx, deaths, 'deaths', weekDatesLabels);
    this.drawChart1(this.thirdCtx, tests, 'tests', weekDatesLabels);
  }



  drawChart1(ctx, data, type,  weekDatesLabels) {
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
        labels: weekDatesLabels,
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

    const recovered = myWeekData.map((cs) => cs.recovered);

    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log(recovered);


    this.canvas = document.getElementById('chartEmail');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart2(this.ctx, recovered, this.weekDatesLabels);


  }

  drawChart2(ctx, data, weekDatesLabels) {
    let dataSet2;
     {
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

    }

    this.chartEmail = new Chart(this.ctx, {
      type: 'pie',

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


  initChart3() {
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

    const weekDatesLabels = myWeekData.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate.getMonth()]}`;
    });


    const patients = myWeekData.map((cs) => cs.patients);

    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log(patients);

    this.drawChart3(this.ctx, patients,  weekDatesLabels);


}

  drawChart3(ctx, data, weekDatesLabels) {
    let dataFirst;
    {
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
    }


    const speedData = {
      labels: weekDatesLabels,
      datasets: [dataFirst],
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
