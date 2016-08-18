import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
//import { Observable } from 'rxjs/Observable';

import { DataService } from '../shared/services/data.service';
import { FilterTextboxComponent } from '../filterTextbox/filterTextbox.component';
import { ArticleCardsComponent } from './articleCards/articleCards.component';
import { IArticleData} from '../shared/interfaces';

@Component({ 
  moduleId: module.id,
  selector: 'articlesPage', 
  templateUrl: 'articlesPage.component.html',
  directives: [ ROUTER_DIRECTIVES, FilterTextboxComponent, 
               ArticleCardsComponent ]
})
export class ArticlesPageComponent implements OnInit {

  filterText: string;
  filteredArticles: IArticleData[] = [];
  articles: IArticleData[] = [];

  constructor(private dataService: DataService) { }
  
  ngOnInit() {
    this.dataService.getAllArticles()
      .subscribe((articles: IArticleData[]) => {
        this.articles = articles;
        this.filteredArticles = articles;
      });
  }

  filterChanged(data: string) {

    if (data && this.articles) {
        // Search thru all the properties for the data string
        data = data.toUpperCase();
        let props = ['Name','Owner'];
        let filtered = this.articles.filter(item => {
            let match = false;
            for (let prop of props) {            
                if (prop == 'Name') {
                  if (item[prop].toString().toUpperCase().indexOf(data) > -1) {
                    match = true;
                    break;
                  }
                } else {  // 'Owner'
                  let ownerProps = ['firstName', 'lastName'];
                  for (let ownerProp of ownerProps) {
                    if (item[prop][ownerProp].toString().toUpperCase().indexOf(data) > -1) {
                      match = true;
                      break;
                    }
                  }
                  
                }

            };
            return match;
        });
        this.filteredArticles = filtered;
    }
    else {
      this.filteredArticles = this.articles;
    }
  }

}
