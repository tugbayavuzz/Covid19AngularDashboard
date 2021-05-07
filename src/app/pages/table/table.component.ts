import { Component, OnInit } from '@angular/core';
import { DataServicesService } from '../../services/data.service';
import { CountryReports } from '../../models/global-data';
import {strict} from 'assert';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'table-cmp',
  moduleId: module.id,
  templateUrl: 'table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  public tableData1: TableData;
  public tableData2: TableData;

  active: 0;
  cases: 0;
  country: '';
  deaths: 0;
  recovered: 0;
  tests: 0;
  todayCases: 0;
  id: 0;
  globalData: CountryReports[];

  constructor(private dataService: DataServicesService) {}
  ngOnInit() {
    this.dataService.getGlobalData().subscribe({
      next: (res) => {
        console.log(res);
        this.globalData = res;
      },
    });

    this.tableData1 = {
      headerRow: ['ID', 'Name', 'Country', 'City', 'Salary'],
      dataRows: [['country', 'cases', 'deaths', 'recovered', 'todayCases']],
    };
  }

}
