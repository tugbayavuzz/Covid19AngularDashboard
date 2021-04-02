import { Component, OnInit } from '@angular/core';
import { DataServicesService } from '../../services/data.service';

// @ts-ignore
import worldMap from '@highcharts/map-collection/custom/world.geo.json';
import turkeyMap from '@highcharts/map-collection/countries/tr/tr-all.geo.json';
// import * as turkeyMap from "assets/maps/tr-all.geo.json";
// import proj4 from "proj4";
// import * as Highcharts from "highcharts";
import * as Highcharts from 'highcharts/highmaps';
import { TheVirusTracker } from '../../models/virusmap.model';

@Component({
  moduleId: module.id,
  selector: 'maps-cmp',
  templateUrl: 'maps.component.html',
})
export class MapsComponent implements OnInit {
  mapData: TheVirusTracker;
  dateRange = '';
  cities = [];

  'use strict';

  private fs = require('fs');

  private highchartsTurkeyGeoUrl = 'assets/highcharts-turkey.geo.json';
  private apiUrl = 'https://covid-turkey-case-ratio.herokuapp.com/';

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

    this.dataService.dataCombined$.subscribe(([covidRatio, hcGeoData]) => {
      const result = this.dataService.makeHighChartData({ covidRatio, hcGeoData });
      console.log(result);
      this.makeChartOptions(result);

    });
  }

  makeChartOptions(data) {
    this.chartOptions = {
      chart: {
        map: turkeyMap,
      },
      title: {
        text: 'Türkiye Vaka Risk Haritası',
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
        min: 0,
      },

      series: [
        {
          type: 'map',
          name: 'Haftalık Vaka Oranı',
          states: {
            hover: {
              color: '#8B0000',
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
