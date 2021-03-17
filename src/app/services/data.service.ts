 import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataSummary } from '../models/turkeydata';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataServicesService {
  private dailyDataUrl = environment.apiCsvUrl;
  private dailyDataJsonUrl = environment.apiJsonUrl;

  constructor(private http: HttpClient) {}

  getDailyData() {
    return this.http.get(this.dailyDataUrl, { responseType: 'text' }).pipe(
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
}

