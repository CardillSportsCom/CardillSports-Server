import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
//import { Observable } from 'rxjs/Observable';
import { FeaturedArticleComponent } from './featuredArticle/featuredArticle.component';
import { DataService } from '../shared/services/data.service';
import { ArticleCardsComponent } from '../articlesPage/articleCards/articleCards.component';
import { DomSanitizationService, SafeStyle} from '@angular/platform-browser';
import { IArticleData } from '../shared/interfaces';

@Component({ 
  moduleId: module.id,
  selector: 'home', 
  templateUrl: 'home.component.html',
  directives: [ ROUTER_DIRECTIVES, 
              FeaturedArticleComponent,
               ArticleCardsComponent
                ]
})
export class HomeComponent implements OnInit {

  title: string;
  featuredArticle: IArticleData;
  articles: IArticleData[] = [];
  bannerImage: SafeStyle;
  numberOfArticles: number = 7;

  constructor(private dataService: DataService, private sanitizer: DomSanitizationService) { }
  
  ngOnInit() {    
    this.dataService.getHomePageArticles(this.numberOfArticles)
      .subscribe((articles: IArticleData[]) => {
        this.featuredArticle = articles[0];
        this.bannerImage = this.sanitizer.bypassSecurityTrustStyle("url('https://" + this.featuredArticle.Image);
        this.articles = articles.slice(1);
      });
  }


}

