import { Component, OnInit } from '@angular/core';
import {DataSummary} from '../../models/turkeydata';
import {DataServicesService} from '../../services/data.service';
import Chart from 'chart.js';
import {isWithinInterval, subDays} from 'date-fns';


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
  weekDatesLabel = [];
  weekDatesLabels2 = [];
  weekDatesLabels3 = [];
  weekDatesLabels4 = [];
  selectedTable = 1 ;
  selectedTable2 = 1;
  maxCaseWeekly: Number;
  maxCaseTwoWeek: Number;
  maxCaseMonthly: Number;
  maxDeathWeekly: Number;
  maxDeathTwoWeek: Number;
  maxDeathMonthly: Number;
  dateofMaxCaseWeekly ;
  dateofMaxCaseTwoWeek ;
  dateofMaxCaseMonthly ;
  dateofMaxDeathWeekly ;
  dateofMaxDeathTwoWeek ;
  dateofMaxDeathMonthly ;
  rateofCases ;
  rateofDeaths ;
  Math: any = Math;
  deathToday ;
  caseToday ;
  rateofCasesWeekly ;
  rateofCasesTwoWeek ;
  rateofCasesMonthly ;
  rateofDeathWeekly: Number ;
  rateofDeathTwoWeek: Number ;
  rateofDeathMonthly: Number;

  constructor(private dataService: DataServicesService) {}
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
        this.initChart1(), this.initChart2();
      },
    });
  }
  findMaxCase(data: DataSummary[]): Number {
    const result = data.map(obj => {
      return obj.cases
    });
    return  Math.max(...result);
  }
  findMaxDeath(data: DataSummary[]): Number {
    const result = data.map(obj => {
      return obj.deaths
    });
    return  Math.max(...result);
  }


  findDateofMaxCase(data: DataSummary[], maxCase: Number): Date {
    let dataReturn;
    data.forEach(function(data1) {
      if (data1.cases === maxCase) {
        dataReturn = data1.date;
      }
    })
    return dataReturn;
  }
  findDateofMaxDeath(data: DataSummary[], maxDeath: Number): Date {
    let dataReturn;
    data.forEach(function(data1) {
      if (data1.deaths === maxDeath) {
        dataReturn = data1.date;
      }
    })
    return dataReturn;
  }
  findRateofCases(data: DataSummary[], index) {
    const array = data.map(obj => {
      return obj.cases
    });
    const x = array[index] - array[index - 1];
    const y = x / array[index - 1];
    const rate = y * 100;
    return rate;
  }
  findSubsofDeaths(data: DataSummary[], index) {
    const array = data.map(obj => {
      return obj.deaths
    });
    const subs = array[index] - array[index - 1];
    return subs;
  }
  findCaseforToday(data: DataSummary []) {
    const result = data.map(obj => {
      return obj.cases
    });
    return result[result.length - 1];
  }
  findDeathforToday(data: DataSummary []) {
    const result = data.map(obj => {
      return obj.deaths
    });
    return result[result.length - 1];
  }
  findSumofCase(data: DataSummary[]) {
    let sumFirstWeek = 0;
    let sumSecondWeek = 0;
    const x = [];
    let i = 0;
    const array = data.map(obj => {
      return obj.cases
    });
    for (i ; i < array.length / 2; i++) {
      sumFirstWeek += array[i];
    }
    x[0] = sumFirstWeek;
    for (i ; i < array.length; i++) {
      sumSecondWeek += array[i];
    }
    x[1] = sumSecondWeek;
    return this.findRate(x, x.length - 1);
  }
  findSumofDeath(data: DataSummary[]) {
    let sumFirstWeek = 0;
    let sumSecondWeek = 0;
    const x = [];
    const array = data.map(obj => {
      return obj.deaths
    });
    for (let i = 0; i < array.length / 2; i++) {
      sumFirstWeek += array[i];
    }
    x[0] = sumFirstWeek;
    for (let i ; i < array.length; i++) {
      sumSecondWeek += array[i];
    }
    x[1] = sumSecondWeek;
    return this.findSubs(x);

  }
  findRate(data: Array<any> , index) {
    const x = data[index] - data[index - 1];
    const y = x / data[index - 1];
    const rate = y * 100;
    return rate;
  }
  findSubs(data: Array<any>) {
    return data[data.length - 1] - data[data.length - 2];
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
    const startOfWeek2 = subDays(today, 13); // for two weeks
    const startOfWeek3 = subDays(today, 29);
    const startOfWeek4 = subDays(today, 59);


    // Get this week data
    const myWeekData = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate = new Date(+year, +month - 1, +day);
      const result = isWithinInterval(csDate, { start: startOfWeek, end: today });
      return result;
    });


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
    const myWeekData4 = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate4 = new Date(+year, +month - 1, +day);
      const result3 = isWithinInterval(csDate4, { start: startOfWeek4, end: today });
      return result3;
    });

    // last week
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
    this.weekDatesLabels4 = myWeekData4.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate4 = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate4.getMonth()]}`;
    });
    console.log(myWeekData.length);
    const casesWeekly = myWeekData.map((cs) => cs.cases);
    const casesTwoWeek = myWeekData2.map((cs) => cs.cases);
    const casesMonthly = myWeekData3.map((cs) => cs.cases);
    this.maxCaseWeekly = this.findMaxCase(myWeekData);
    this.maxCaseTwoWeek = this.findMaxCase(myWeekData2);
    this.maxCaseMonthly = this.findMaxCase(myWeekData3);
    this.dateofMaxCaseWeekly = this.findDateofMaxCase(myWeekData, this.maxCaseWeekly);
    this.dateofMaxCaseTwoWeek = this.findDateofMaxCase(myWeekData2, this.maxCaseTwoWeek);
    this.dateofMaxCaseMonthly = this.findDateofMaxCase(myWeekData3, this.maxCaseMonthly);
    this.rateofCases = this.findRateofCases(myWeekData, myWeekData.length - 1);
    this.caseToday = this.findCaseforToday(myWeekData);
    this.rateofCasesWeekly = this.findSumofCase(myWeekData2);
    this.rateofCasesTwoWeek = this.findSumofCase(myWeekData3);
    this.rateofCasesMonthly = this.findSumofCase(myWeekData4);

    console.log(this.rateofCases);

    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log('Chart2');
    console.log('Week Data', myWeekData2);
    console.log('Chart3');
    console.log('Week Data', myWeekData3);


    this.canvas = document.getElementById('chartEmail');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart1(this.ctx, casesWeekly, this.weekDatesLabels);
    this.canvas = document.getElementById('chartEmail1');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart1(this.ctx, casesTwoWeek, this.weekDatesLabels2);

    this.canvas = document.getElementById('chartEmail2');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart1(this.ctx, casesMonthly, this.weekDatesLabels3);
  }

  selectData(event) {
    this.selectedTable = 1 ;
  }
  selectData2(event) {
    this.selectedTable = 2 ;
  }

  selectData3(event) {
    this.selectedTable = 3 ;
  }

  drawChart1(ctx, data, weekDatesLabels) {
    let dataSet2;
    {
      dataSet2 = {
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: [
          '#35619e',
          '#2ca3d6',
          '#16bff7',
          '#071daf',
          '#083975',
          '#0c41b5',
          '#00e5e1',
          '#5bd4d8',
          '#309edd',
          '#033b9e',
          '#2d418e',
          '#23d4ef',
          '#0b84e8',
          '#5186cc',
          '#04dbe2',
          '#079e9b',
          '#003060',
          '#1e3989',
          '#665ff4',
          '#1dabd6',
          '#1168c4',
          '#06706e',
          '#112a84',
          '#0b055e',
          '#59d5e5',
          '#2194a5',
          '#29ebf2',
          '#063982',
          '#0710bf',
          '#4536a5',
          '#3765fc',
          '#4d31b2',
          '#6aebf2',
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
    const startOfWeek2 = subDays(today, 13); // for two weeks
    const startOfWeek3 = subDays(today, 29);
    const startOfWeek4 = subDays(today, 59);

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
    const myWeekData4 = this.dataSummaries.filter((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate4 = new Date(+year, +month - 1, +day);
      const result3 = isWithinInterval(csDate4, { start: startOfWeek4, end: today });
      return result3;
    });


    this.weekDatesLabel = myWeekData.map((cs) => {
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
    this.weekDatesLabels4 = myWeekData4.map((cs) => {
      const [day, month, year] = cs.date.split('/');
      const csDate4 = new Date(+year, +month - 1, +day);
      return `${day} ${monthNames[csDate4.getMonth()]}`;
    });

    const deathWeekly = myWeekData.map((cs) => cs.deaths);
    const deathTwoWeek = myWeekData2.map((cs) => cs.deaths);
    const deathMonthly = myWeekData3.map((cs) => cs.deaths);
    this.maxDeathWeekly = this.findMaxDeath(myWeekData);
    this.maxDeathTwoWeek = this.findMaxDeath(myWeekData2);
    this.maxDeathMonthly = this.findMaxDeath(myWeekData3);
    this.dateofMaxDeathWeekly = this.findDateofMaxDeath(myWeekData, this.maxDeathWeekly);
    this.dateofMaxDeathTwoWeek = this.findDateofMaxDeath(myWeekData2, this.maxDeathTwoWeek);
    this.dateofMaxDeathMonthly = this.findDateofMaxDeath(myWeekData3, this.maxDeathMonthly);
    this.rateofDeaths = this.findSubsofDeaths(myWeekData, myWeekData.length - 1);
    this.deathToday = this.findDeathforToday(myWeekData);

    this.rateofDeathWeekly = this.findSumofDeath(myWeekData2);
    this.rateofDeathTwoWeek = this.findSumofDeath(myWeekData3);
    this.rateofDeathMonthly = this.findSumofDeath(myWeekData4);
    console.log(this.rateofDeathWeekly);



    console.log('Chart1');
    console.log('Week Data', myWeekData);
    console.log('Chart2');
    console.log('Week Data', myWeekData2);
    console.log('Chart3');
    console.log('Week Data', myWeekData3);


    this.canvas = document.getElementById('chartEmail3');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart2(this.ctx, deathWeekly, this.weekDatesLabel);
    this.canvas = document.getElementById('chartEmail4');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart2(this.ctx, deathTwoWeek, this.weekDatesLabels2);
    this.canvas = document.getElementById('chartEmail5');
    this.ctx = this.canvas.getContext('2d');

    this.drawChart2(this.ctx, deathMonthly, this.weekDatesLabels3);
  }
  selectData4(event) {
    this.selectedTable2 = 1 ;
  }
  selectData5(event) {
    this.selectedTable2 = 2 ;
  }

  selectData6(event) {
    this.selectedTable2 = 3 ;
  }

  drawChart2(ctx2, data, weekDatesLabel) {
    let dataSet2;
    {
      dataSet2 = {
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: [
          '#ea6077',
          '#f4402c',
          '#e05e5c',
          '#9e0608',
          '#f46055',
          '#d17559',
          '#ea2543',
          '#bc011d',
          '#d63956',
          '#c45e4a',
          '#a01411',
          '#d6440e',
          '#f45f5d',
          '#ff816d',
          '#a81c25',
          '#c41532',
          '#a80627',
          '#b70c0f',
          '#f70e35',
          '#9b1511',
          '#b50e3d',
          '#db2b49',
          '#961e03',
          '#c4152c',
          '#931e07',
          '#aa4019',
          '#d8616b',
          '#e56647',
          '#aa255a',
          '#b5271c'
        ],
        borderWidth: 0,
        data: data,
      };

    }

    this.chartHours = new Chart(this.ctx, {
      type: 'bar',

      data: {
        labels: weekDatesLabel,
        datasets: [dataSet2],
      },
      options: {
        legend: {
          display: false,
        },
        plugins: {
          datalabels: {
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
      },
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
