import {Component, OnInit} from '@angular/core';
import {DataServicesService} from '../../services/data.service';
import {VaccineTracker} from '../../models/vaccine';
// @ts-ignore
import worldMap from '@highcharts/map-collection/custom/world.geo.json';
import turkeyMap from '@highcharts/map-collection/countries/tr/tr-all.geo.json';
import * as Highcharts from 'highcharts/highmaps';


@Component({
    selector: 'icons-cmp',
    moduleId: module.id,
    templateUrl: 'icons.component.html'
})

export class IconsComponent implements OnInit {

  result = [];
  vaccineMap: VaccineTracker;
  name: string;
  total: number;
  firstDose: number;
  secondDose: number;

  'use strict';

  private fs = require('fs');

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = 'mapChart';

  chartOptions: Highcharts.Options;

  // chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... } // optional function, defaults to null
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false; // optional boolean, defaults to false

  constructor(private dataService: DataServicesService) {}

  ngOnInit() {

    // combine the two observables in one single observable

    // @ts-ignore
    this.dataService.dataCombined2$.subscribe(([totalVaccine, hcGeoData]) => {
      const res = this.dataService.makeHighChartDataVaccine({totalVaccine, hcGeoData}) ;
      console.log(res);
      this.makeChartOptions(res);

    });
  }

  makeChartOptions(data) {
    this.chartOptions = {
      chart: {
        map: turkeyMap,
      },
      title: {
        text: 'Türkiye Aşı Durum Haritası',
      },
      subtitle: {
        text: `Source map: <a href="http://code.highcharts.com/mapdata/countries/tr/tr-all.js">Turkey</a>`,
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox',
        },
      },
      legend: {
        enabled: true,
      },
      colorAxis: {
        dataClasses: [{
          to: 100000
        }, {
          from: 300000,
          to: 300001
        }, {
          from: 600000,
          to: 600001
        }, {
          from: 1000000,
          to: 100000000
        },
        ]
      },

      series: [
        {
          type: 'map',
          name: 'Toplam Aşı',
          states: {
            hover: {
              color: '#7FFFD4',
            },
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
          },
          allAreas: false,
          data,
        },
      ],
    };
  }
}
