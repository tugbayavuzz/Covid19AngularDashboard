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
<<<<<<< HEAD
    this.dataService.covid19News().subscribe(
      res => this.displayNews = res.news_results
    )
    
=======
    this.dataService.covid19News().subscribe({
      next: (res) => {
        console.log(res);
        this.displayNews = res.articles;
      },
    });
>>>>>>> a91d9b845737b76442600ed482f4c3af9277e301
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
