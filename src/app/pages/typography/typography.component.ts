import {Component, OnInit} from '@angular/core';
import { DataServicesService } from 'app/services/data.service';


@Component({
    selector: 'typography-cmp',
    moduleId: module.id,
    templateUrl: 'typography.component.html'
})

export class TypographyComponent implements OnInit {

  displayNews: any =  [];
  //displayNews2: any =  [];
  //displayNews3: any =  [];

  constructor(private dataService: DataServicesService) {}
  ngOnInit() {
    this.dataService.covid19News().subscribe(
      res => this.displayNews = res.image_results
    )
    
    /*
    this.dataService.News().subscribe({
      next: (res) => {
        console.log(res);
        this.displayNews2 = res.articles;
      },
    });

    this.dataService.NewsCovid().subscribe({
      next: (res) => {
        console.log(res);
        this.displayNews3 = res.articles;
      },
    });
    */
  }
}
