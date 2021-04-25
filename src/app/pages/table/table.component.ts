import { Component, OnInit } from '@angular/core';
import {DataServicesService} from '../../services/data.service';
import {CountryReports} from '../../models/global-data';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'table-cmp',
  moduleId: module.id,
  templateUrl: 'table.component.html'
})

export class TableComponent implements OnInit {
  public tableData1: TableData;
  public tableData2: TableData;
  globalData: CountryReports[];
  active: 0;
  cases: 0;
  country: '';
  deaths: 0;
  recovered: 0;
  tests: 0;
  todayCases: 0;



  constructor(private dataService: DataServicesService) {
  }
  ngOnInit() {

    this.dataService.getGlobalData().subscribe({
      next: (res) => {
        console.log(res);
        this.globalData = res;
      }
    })

    this.tableData1 = {
      headerRow: [ 'ID', 'Name', 'Country', 'City', 'Salary'],
      dataRows: [
        ['country', 'cases', 'deaths', 'recovered', 'todayCases'],
      ]
    };
    this.tableData2 = {
      headerRow: [ 'ID', 'Name',  'Salary', 'Country', 'City' ],
      dataRows: [
        ['country', 'cases', 'deaths', 'recovered', 'todayCases'],
      ]
    };
  }
}
