import {Component, OnInit} from '@angular/core';
import { DataServicesService } from 'app/services/data.service';


@Component({
    selector: 'typography-cmp',
    moduleId: module.id,
    templateUrl: 'typography.component.html'
})

export class TypographyComponent implements OnInit {


  displayNews: any =  [];

  constructor(private dataService: DataServicesService) {}
  ngOnInit() {
    this.dataService.covid19News().subscribe({
      next: (res) => {
        console.log(res);
        this.displayNews = res.articles;
      },
    });
  }
}
