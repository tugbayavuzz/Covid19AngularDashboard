import { Component, OnInit } from '@angular/core';
import { DataServicesService } from '../../services/data.service';
import { CountryReports } from '../../models/global-data';
import {strict} from 'assert';
import {MatTableDataSource} from '@angular/material/table';

import 'jspdf-autotable'
// @ts-ignore
import jsPDF from 'jspdf';
import {applyPlugin} from 'jspdf-autotable';
import {ExportToCsv} from 'export-to-csv';

// @ts-ignore
applyPlugin(jsPDF)


declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

declare const require: any;
require('jspdf-autotable');
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
  ELEMENT_DATA: CountryReports[];
  displayedColumns: string[] = ['country',
    'cases',
    'todayCases',
    'deaths',
    'todayDeaths',
    'recovered',
    'todayRecovered',
    'active',
    'critical',
    'casesPerOneMillion',
    'deathsPerOneMillion',
    'tests',
    'testsPerOneMillion'];
  // @ts-ignore
  dataSource = new MatTableDataSource<CountryReports>(this.ELEMENT_DATA);
  cols: any[];

  exportColumns: any[];

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
    this.getAllReports();
  }
  public getAllReports() {
    const res = this.dataService.covid19Reports();
    res.subscribe(report => this.dataSource.data = report as CountryReports[] )
  }
  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.globalData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'globalData');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }
  /*
  exportPdf() {
    // tslint:disable-next-line:no-shadowed-variable
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(this.displayedColumns, this.globalData);
        doc.save('products.pdf');
      })
    })
  }
  */
  exportCSV() {
    const csvExporter = new ExportToCsv();
    csvExporter.generateCsv(this.globalData);
  }
}
