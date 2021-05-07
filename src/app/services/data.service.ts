import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {DataSummary} from '../models/turkeydata';
import {combineLatest, Observable, pipe} from 'rxjs';
import {TheVirusTracker, City} from '../models/virusmap.model';
import {Cities, VaccineTracker} from '../models/vaccine';
import {CountryReports} from '../models/global-data';


@Injectable({
  providedIn: 'root',
})
export class DataServicesService {
  private dailyDataUrl = environment.apiCsvUrl;
  private dailyDataJsonUrl = environment.apiJsonUrl;
  private weeklyDataUrl = 'https://api-covid-turkey.herokuapp.com';
  private vaccineUrl = 'https://api-covid-turkey.herokuapp.com/vaccine';
  private globalDataUrl = 'https://corona.lmao.ninja/v3/covid-19/countries';

  dataCombined$ = combineLatest([
    this.getCaseRatioData(),
    this.getHighChartGeoData(),
  ]);

  dataCombined2$ = combineLatest([
    this.getTotalVaccineData(),
    this.getHighChartGeoData(),
  ]);

  constructor(private http: HttpClient) {}


  getCaseRatioData(): Observable<City[]> {
    return this.http
      .get<TheVirusTracker>(this.weeklyDataUrl)
      .pipe(map((res) => res.cities));
  }

  getTotalVaccineData(): Observable<Cities[]> {
    return this.http
      .get<VaccineTracker>(this.vaccineUrl)
      .pipe(map((res) => res.result));
  }

  getGlobalData(): Observable<any> {
    return  this.http
      .get<CountryReports>(this.globalDataUrl)
      .pipe(map((res) => res));
  }
  public covid19Reports() {
    return this.http.get('https://corona.lmao.ninja/v3/covid-19/countries');
  }

  getDailyData() {
    return this.http.get(this.dailyDataUrl, {responseType: 'text'}).pipe(
      map((res) => {
        const data: DataSummary[] = [];
        const raw = {};
        const rows = res.split('\n');
        rows.splice(0, 1);
        rows.forEach((row) => {
          // const cols = row.split(/,(?=\s)/);
          const cols = row
            .split(',')
            .map((item) => item.replace(/^"(.*)"$/, '$1'));
          const cs = {
            date: cols[10],
            patients: +cols[0],
            cases: +cols[13],
            deaths: +cols[2],
            recovered: +cols[4],
            critical: +cols[11],
            pneumoniaPercent: +cols[12],
            tests: +cols[8],
          };
          const temp: DataSummary = rows[cs.date];
          if (temp) {
            // @ts-ignore
            temp.cases = cs.cases + temp.cases;
            temp.patients = cs.patients + temp.patients;
            temp.critical = cs.critical + temp.critical;
            temp.pneumoniaPercent = cs.pneumoniaPercent + temp.pneumoniaPercent;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            temp.tests = cs.tests + temp.tests;
            temp.date = cs.date;
            raw[cs.date] = temp;
          } else {
            raw[cs.date] = cs;
          }
        });
        return Object.values(raw) as DataSummary[];
      })
    );
  }

  getDailyJsonData(): Observable<DataSummary[]> {
    return this.http.get(this.dailyDataJsonUrl).pipe(
      map((res) => {
        return (Object.values(res) as DataSummary[]).map((item) => {
          return {
            ...item,
            deaths: +item.deaths,
            patients: +item.patients,
            recovered: +item.recovered,
            tests: +item.tests,
            critical: +item.critical,
            cases: item.cases ? +item.cases : 0,
          };
        });
      })
    );
  }

  getHighChartGeoData(): Observable<any> {
    return this.http
      .get('./../assets/highcharts-turkey.geo.json')
      .pipe(map((res) => this.mapGeoData(res['features'])));
  }

  mapGeoData(data) {
    // why 77 and not 82
    return data.map((feature) => {
      const key = feature.properties['hc-key'];
      const name = feature.properties['name'];

      return {
        'hc-key': key,
        'woe-name': name ? name : key,
      };
    });
  }

  makeHighChartData({covidRatio, hcGeoData}) {
    const hcData = [];
    covidRatio.forEach((ratio) => {
      hcGeoData.forEach((hcGeo) => {
        if (
          this.replaceCityNameChars(ratio.name) ===
          this.replaceCityNameChars(hcGeo['woe-name'])
        ) {
          hcData.push([hcGeo['hc-key'], +ratio['caseRatio']]);
        }
      });
    });
    return hcData;
  }

  makeHighChartDataVaccine({totalVaccine, hcGeoData}) {
    const hcData = [];
    totalVaccine.forEach((total) => {
          hcGeoData.forEach((hcGeo) => {
            if (
              this.replaceCityNameChars(total.name) ===
              this.replaceCityNameChars(hcGeo['woe-name'])
              ) {
                  hcData.push([hcGeo['hc-key'], +total['total']]);
                }
          });
    });
    return hcData;
  }

  replaceCityNameChars(cityName) {
    return cityName
      .replace(/Ğ/gim, 'G')
      .replace(/Ü/gim, 'U')
      .replace(/Ş/gim, 'S')
      .replace(/İ/gim, 'I')
      .replace(/Ö/gim, 'O')
      .replace(/Ç/gim, 'C')
      .replace(/ğ/gim, 'g')
      .replace(/ü/gim, 'u')
      .replace(/ş/gim, 's')
      .replace(/ı/gim, 'i')
      .replace(/ö/gim, 'o')
      .replace(/ç/gim, 'c')
      .toLowerCase();
  }

}
