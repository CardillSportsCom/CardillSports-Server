import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { SafeStyle, DomSanitizationService } from '@angular/platform-browser'
import { IArticleData, IComment } from '../shared/interfaces';
import { DataService } from '../shared/services/data.service';
import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { SemanticRatingComponent } from './ratings.component';
import { Http, Response } from '@angular/http';

@Component({
  moduleId: module.id,
  selector: 'article-details',
  templateUrl: 'articleDetails.component.html',
  directives: [ ROUTER_DIRECTIVES, SemanticRatingComponent ],
  pipes: [ CapitalizePipe ]
})
export class ArticleDetailsComponent implements OnInit {

  sub: any;
  article: IArticleData;
  id:string;
  articleImage: SafeStyle;
  articleRating: number = 0;
  latestComment: string = "";
  
  constructor(private router: Router, private sanitizer: DomSanitizationService, private route: ActivatedRoute, private dataService: DataService) { }

  
  ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
        this.id = params['id'];
        //TODO: chain observables
        this.dataService.getArticle(this.id).subscribe((article: IArticleData) => {
          this.article = article;
          this.articleImage = this.sanitizer.bypassSecurityTrustStyle("url('https:" + this.article.Image);
          this.articleRating = Math.round(article.Rating); 
        });
      });
      
  }

  onReceiveRating(rating: number) {
    this.dataService.postRating(this.id, rating)
      .subscribe((response: Response) => {
          console.log(response);
      });
  }

  onSubmit(comment: any): void { 
    
    this.dataService.postComment(this.id, comment)
      .subscribe((postedComment: IComment) => {
          this.article.Comments.push(postedComment);
          this.latestComment = "";
      });
  }
  stringAsDate(dateStr:string){
    return new Date(dateStr);
  }
}