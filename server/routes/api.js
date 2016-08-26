var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var contentful = require('contentful');
var showdown  = require('showdown');
var Promise = require('bluebird');
var converter = new showdown.Converter();

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    Name: String,
    Image: String,
    Creator: Object,
    Body: String,
    Rating: Number,
    TotalRatings: Number,
    Comments: []
}, {timestamps: true});

var ArticleModel = mongoose.model('Article', ArticleSchema);

var CreatorSchema = new Schema ({
    name: String,
    userPicture: String
});
var CreatorModel = mongoose.model('Creator', CreatorSchema);

var client = contentful.createClient({
  space: 'tkvbbi8oo5wg',
  accessToken: 'bd37d91aa4c406c96d2d870e4556314f7c2ece4600c590cdafb7007bbdeba2e6'
})

router.get('/content', function(req, res, next) {
    ArticleModel.find({}).sort({createdAt: 'descending'}).exec(
        function(err, articles){
            if(err){ return next(err); }
            res.json(articles);
    });
});

router.route('/article').post(function(req, res) {
    
    articleId = req.body.sys.id;
    console.log(articleId);
    Promise.try(function(){
        return client.getEntries({'sys.id': articleId});
    }).then(function (entries) {   
             
        var entry = entries.items[0].fields;    
        
        var creator = new CreatorModel();
        creator.name = entry.author[0].fields.name;
        creator.userPicture = entry.author[0].fields.profilePhoto.fields.file.url;
       
        var article = new ArticleModel();        
        article.Name = entry.title;
        article.Body = converter.makeHtml(entry.body);
        article.Creator = creator; 
        article.Image = entry.featuredImage.fields.file.url;
        
        article.Rating = 0;
        article.TotalRatings = 0;

        

        // save the article and check for errors
        return article.save(function(err) {
            if (err)
                res.send(err);
            
            res.json(article);
        });  
    }).catch(function(err){
        console.log(err);
    });
});


router.get('/articles', function(req, res, next) {
    ArticleModel.find({"Type": "Article"}).sort({createdAt: 'descending'}).exec(
        function(err, articles){
            if(err){ return next(err); }
            res.json(articles);
    });
});

router.get('/podcasts', function(req, res, next) {
    ArticleModel.find({"Type": "Podcast"}).sort({createdAt: 'descending'}).exec(
        function(err, articles){
            if(err){ return next(err); }
            res.json(articles);
    });
});

router.get('/creators', function(req, res, next) {
    CreatorModel.aggregate(
        [   
            { $unwind: "$articles" },
            { $group : { _id : { firstName: "$firstName", lastName: "$lastName", userPicture:"$userPicture" }, 
                            articleCount : { $sum : 1 } } },
            { $sort : { articleCount : -1 } }
        ],
        function(err, creators) {
            if(err){ return next(err); }
            res.json(creators);
        });
});

router.get('/home-content/:limit', function(req, res, next) {
    var limit = req.params.limit;
    ArticleModel.find({}).sort({createdAt: 'descending'}).limit(limit).exec(
        function(err, articles){
            if(err){ return next(err); }
            res.json(articles);
    });
});

router.get('/content/:id', function(req, res, next) {
    var id = req.params.id;
    ArticleModel.findById(id, function(err, article){
        if(err){ return next(err); }
        res.json(article);
    });
});

router.put('/content/:id/rating/:rating', function(req, res, next) {
    var id = req.params.id;
    var rating = req.params.rating;

    ArticleModel.findById(id, function(err, article){
        if(err){ return next(err); }
        // Calculate new average
        article.Rating =    ((parseFloat(article.Rating) * parseFloat(article.TotalRatings)) + parseFloat(rating)) / 
                            (parseFloat(article.TotalRatings) + 1);
                
        // Increment 
        article.TotalRatings += 1;
        
        article.save(
                function(err) {
                    if (err) res.send(err);
                    res.json({ message: 'Article updated!' });
                });
    });
});

router.put('/content/:id/comment/:comment', function(req, res, next) {
    var id = req.params.id;
    var comment = req.params.comment;

    ArticleModel.findById(id, function(err, article){
        if(err){ return next(err); }
        
        var commentObj = {"Name": "Anonymous",
                            "Text": comment,
                            "Date": new Date}

        article.Comments.push(commentObj);

        article.save(
                function(err) {
                    if (err) res.send(err);
                    res.json(commentObj);
                });
    });
});

var getRedditPosts = function(req, res, next) {  
    
    var pathString = "/r/nba/top.json?sort=top&t=month&limit=100";
    if (Object.keys(req.params).length !== 0) {
        pathString = pathString + "&after=" + req.params.after;
    }

    var options = {
        host: 'www.reddit.com',
        path: pathString,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

   /* requestController.getJSON(options, function(statusCode, result) {    
        res.statusCode = statusCode;
        res.json(result);
    });*/
};

router.get('/reddit/:after', getRedditPosts);
router.get('/reddit', getRedditPosts);

module.exports = router;