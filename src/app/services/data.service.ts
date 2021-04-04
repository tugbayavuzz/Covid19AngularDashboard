import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {DataSummary} from '../models/turkeydata';
import {combineLatest, Observable, pipe} from 'rxjs';
import {TheVirusTracker, City} from '../models/virusmap.model';
import {VaccineTracker} from '../models/vaccine';


@Injectable({
  providedIn: 'root',
})
export class DataServicesService {
  private dailyDataUrl = environment.apiCsvUrl;
  private dailyDataJsonUrl = environment.apiJsonUrl;
  private weeklyDataUrl = 'https://covid-turkey-case-ratio.herokuapp.com';
  private vaccineUrl = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/Turkey.csv';

  dataCombined$ = combineLatest([
    this.getCaseRatioData(),
    this.getHighChartGeoData(),
  ]);

  constructor(private http: HttpClient) {}


  getCaseRatioData(): Observable<City[]> {
    return this.http
      .get<TheVirusTracker>(this.weeklyDataUrl)
      .pipe(map((res) => res.cities));
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

  getVaccineData() {
    return this.http.get(this.vaccineUrl, { responseType: 'text'}).pipe(
      map(result => {
        const data: VaccineTracker[] = [];
        const raw = {};
        const rows = result.split('\n');

        rows.forEach((row) => {
          const cols = row;
          const cs = {
            date: cols[1],
            vaccine: +cols[2],
            total_vaccinations: +cols[4],
            people_vaccinated: +cols[5],
            people_fully_vaccinated: +cols[6]
          };
          const temp: VaccineTracker = rows[cs.date];
          if (temp) {
            temp.total_vaccinations = cs.total_vaccinations + temp.total_vaccinations;
            temp.people_vaccinated = cs.people_vaccinated + temp.people_vaccinated;
            temp.people_fully_vaccinated = cs.people_fully_vaccinated + temp.people_fully_vaccinated;
             raw[cs.date] = temp;
          } else {
            raw[cs.date] = cs;
          }
        });
          return Object.values(raw) as VaccineTracker[];

      }));
  }




  displayVaccine(): Observable<VaccineTracker> {
    return this.http.get(this.vaccineUrl).pipe(
      map((res) => {
        // @ts-ignore
        return (Object.values(res) as VaccineTracker).map((item) => {
          return {
            ...item,
            date: item.date,
            vaccine: +item.vaccine,
            total_vaccinations: +item.total_vaccinations,
            people_vaccinated: +item.people_vaccinated,
            people_fully_vaccinated: +item.people_fully_vaccinated,
          };
        });
      })
    )
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
