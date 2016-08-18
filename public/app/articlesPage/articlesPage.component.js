"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
//import { Observable } from 'rxjs/Observable';
var data_service_1 = require('../shared/services/data.service');
var filterTextbox_component_1 = require('../filterTextbox/filterTextbox.component');
var articleCards_component_1 = require('./articleCards/articleCards.component');
var ArticlesPageComponent = (function () {
    function ArticlesPageComponent(dataService) {
        this.dataService = dataService;
        this.filteredArticles = [];
        this.articles = [];
    }
    ArticlesPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.getAllArticles()
            .subscribe(function (articles) {
            _this.articles = articles;
            _this.filteredArticles = articles;
        });
    };
    ArticlesPageComponent.prototype.filterChanged = function (data) {
        if (data && this.articles) {
            // Search thru all the properties for the data string
            data = data.toUpperCase();
            var props_1 = ['Name', 'Owner'];
            var filtered = this.articles.filter(function (item) {
                var match = false;
                for (var _i = 0, props_2 = props_1; _i < props_2.length; _i++) {
                    var prop = props_2[_i];
                    if (prop == 'Name') {
                        if (item[prop].toString().toUpperCase().indexOf(data) > -1) {
                            match = true;
                            break;
                        }
                    }
                    else {
                        var ownerProps = ['firstName', 'lastName'];
                        for (var _a = 0, ownerProps_1 = ownerProps; _a < ownerProps_1.length; _a++) {
                            var ownerProp = ownerProps_1[_a];
                            if (item[prop][ownerProp].toString().toUpperCase().indexOf(data) > -1) {
                                match = true;
                                break;
                            }
                        }
                    }
                }
                ;
                return match;
            });
            this.filteredArticles = filtered;
        }
        else {
            this.filteredArticles = this.articles;
        }
    };
    ArticlesPageComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'articlesPage',
            templateUrl: 'articlesPage.component.html',
            directives: [router_1.ROUTER_DIRECTIVES, filterTextbox_component_1.FilterTextboxComponent,
                articleCards_component_1.ArticleCardsComponent]
        }), 
        __metadata('design:paramtypes', [data_service_1.DataService])
    ], ArticlesPageComponent);
    return ArticlesPageComponent;
}());
exports.ArticlesPageComponent = ArticlesPageComponent;
//# sourceMappingURL=articlesPage.component.js.map