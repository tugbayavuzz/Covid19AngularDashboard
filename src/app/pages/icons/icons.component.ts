import {Component, OnInit} from '@angular/core';
import {DataServicesService} from '../../services/data.service';
import {VaccineTracker} from '../../models/vaccine';
import {isWithinInterval, subDays} from 'date-fns';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
    selector: 'icons-cmp',
    moduleId: module.id,
    templateUrl: 'icons.component.html'
})

export class IconsComponent implements OnInit {
  public tableData1: TableData;
  public tableData2: TableData;
  location: string;
  date: string;
  vaccine: string;
  source_url: string;
  total_vaccinations: number;
  people_vaccinated: number;
  people_fully_vaccinated: number;
  total = 0;
  dataVaccine: VaccineTracker[];


  constructor(private dataService: DataServicesService) {}

  ngOnInit() {

    this.dataService.getVaccineData().subscribe({
      next: (res) => {
        console.log(res);
        this.dataVaccine = res;
        res.forEach((cs) => {
          if (!Number.isNaN(cs.date)) {
            this.date = cs.date;
            this.vaccine = cs.vaccine;
            this.total_vaccinations = cs.total_vaccinations;
            this.people_vaccinated = cs.people_vaccinated;
            this.people_fully_vaccinated = cs.people_fully_vaccinated;
          }
        });
        this.displayVaccineOptions();
      },
    });
  }

    displayVaccineOptions() {

      this.tableData1 = {
        headerRow: ['ID', 'Name', 'Country', 'City', 'Salary'],
        dataRows: [
          ['1', 'Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738'],
          ['2', 'Minerva Hooper', 'Curaçao', 'Sinaai-Waas', '$23,789'],
          ['3', 'Sage Rodriguez', 'Netherlands', 'Baileux', '$56,142'],
          ['4', 'Philip Chaney', 'Korea, South', 'Overland Park', '$38,735'],
          ['5', 'Doris Greene', 'Malawi', 'Feldkirchen in Kärnten', '$63,542'],
          ['6', 'Mason Porter', 'Chile', 'Gloucester', '$78,615']
        ]
      };
      this.tableData2 = {
        headerRow: ['ID', 'Name', 'Salary', 'Country', 'City'],
        dataRows: [
          ['1', 'Dakota Rice', '$36,738', 'Niger', 'Oud-Turnhout'],
          ['2', 'Minerva Hooper', '$23,789', 'Curaçao', 'Sinaai-Waas'],
          ['3', 'Sage Rodriguez', '$56,142', 'Netherlands', 'Baileux'],
          ['4', 'Philip Chaney', '$38,735', 'Korea, South', 'Overland Park'],
          ['5', 'Doris Greene', '$63,542', 'Malawi', 'Feldkirchen in Kärnten', ],
          ['6', 'Mason Porter', '$78,615', 'Chile', 'Gloucester']
        ]
      };

  }
}
