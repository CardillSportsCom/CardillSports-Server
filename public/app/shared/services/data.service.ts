import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map'; 
import 'rxjs/add/operator/catch';

import { IComment, IArticleData, ICreator } from '../interfaces';

@Injectable()
export class DataService {
    _cardillBase: string = 'http://cardillsports.gear.host/';
    _baseUrl: string = '';    
    allArticles: IArticleData[];
    articles: IArticleData[];
    podcasts: IArticleData[];
    homeArticles: IArticleData[];
    lastPostedComment: IComment;
    allCreators: ICreator[];

    constructor(private http: Http) { }
    
    postRating(id: string, rating: number) : Observable<Response> {
        return this.http.put(this._baseUrl + 'api/content/' + id + "/rating/" + rating, {})
                    .map((res: Response) => {
                        let body = res.json();
                        return body.data || { };
                    })
                    .catch(this.handleError);        
    }

    postComment(id: string, comment: string) : Observable<IComment> {
        return this.http.put(this._baseUrl + 'api/content/' + id + "/comment/" + comment, {})
                    .map((res: Response) => {
                        this.lastPostedComment = res.json();
                        return this.lastPostedComment;
                    })
                    .catch(this.handleError);        
    }

    // Gets all articles and podcasts
    getAllArticles() : Observable<IArticleData[]> {
        if (!this.allArticles) {
            return this.http.get(this._baseUrl + 'api/content')
                        .map((res: Response) => {
                            this.allArticles = res.json();                        
                            return this.allArticles;
                        })
                        .catch(this.handleError);
        }
        else {
            //return cached data
            return this.createObservable(this.allArticles);
        }
    }

    // Gets articles only
    getArticles() : Observable<IArticleData[]> {
        if (!this.articles) {
            return this.http.get(this._baseUrl + 'api/articles')
                        .map((res: Response) => {
                            this.articles = res.json();                        
                            return this.articles;
                        })
                        .catch(this.handleError);
        }
        else {
            //return cached data
            return this.createObservable(this.articles);
        }
    }

    // Gets podcasts only
    getPodcasts() : Observable<IArticleData[]> {
        if (!this.podcasts) {
            return this.http.get(this._baseUrl + 'api/podcasts')
                        .map((res: Response) => {
                            this.podcasts = res.json();                        
                            return this.podcasts;
                        })
                        .catch(this.handleError);
        }
        else {
            //return cached data
            return this.createObservable(this.podcasts);
        }
    }

    getAllCreators() : Observable<ICreator[]> {
        if (!this.allCreators) {
            return this.http.get(this._baseUrl + 'api/creators')
                        .map((res: Response) => {
                            this.allCreators = res.json();                        
                            return this.allCreators;
                        })
                        .catch(this.handleError);
        }
        else {
            //return cached data
            return this.createObservable(this.allCreators);
        }
    }

    getHomePageArticles(limit: number) : Observable<IArticleData[]> {    
        if (!this.homeArticles) {
            return this.http.get(this._baseUrl + 'api/home-content/' + limit)
                        .map((res: Response) => {                            
                            this.homeArticles = res.json();                        
                            return this.homeArticles;
                        })
                        .catch(this.handleError);
        }
        else {
            //return cached data
            return this.createObservable(this.homeArticles);
        }
    }


    getArticle(id: string) : Observable<IArticleData> {
        return this.http.get(this._baseUrl + 'api/content/' + id)
                        .map((res: Response) => {
                            const article : IArticleData = res.json();                        
                            return article;
                        })
                        .catch(this.handleError);
    }

    private createObservable(data: any) : Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            observer.next(data);
            observer.complete();
        });
    }
    
    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}
