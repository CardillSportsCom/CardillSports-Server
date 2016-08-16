var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    Name: String,
    ImageID: String,
    AuthorID: String,
    Body: String,
    Rating: Number,
    TotalRatings: Number,
    Comments: []
}, {timestamps: true});

var ArticleModel = mongoose.model('Article', ArticleSchema);

var CreatorSchema = new Schema ({
    firstName: String,
    lastName: String,
    userPicture: String
});
var CreatorModel = mongoose.model('Creator', CreatorSchema);

router.get('/content', function(req, res, next) {
    ArticleModel.find({}).sort({DateCreated: 'descending'}).exec(
        function(err, articles){
            if(err){ return next(err); }
            res.json(articles);
    });
});

router.route('/article').post(function(req, res) {
        
        var article = new ArticleModel();      // create a new instance of the Bear model
        
        article.Body = req.body.fields.body["en-US"];
        article.Name = req.body.fields.title["en-US"];
        article.AuthorID = req.body.fields.author["en-US"][0].sys.id;
        article.ImageID = req.body.fields.featuredImage["en-US"].sys.id;
        article.Rating = 0;
        article.TotalRatings = 0;

        // save the article and check for errors
        article.save(function(err) {
            if (err)
                res.send(err);

            res.json("req.body");
        });
        
    });


router.get('/articles', function(req, res, next) {
    ArticleModel.find({"Type": "Article"}).sort({DateCreated: 'descending'}).exec(
        function(err, articles){
            if(err){ return next(err); }
            res.json(articles);
    });
});

router.get('/podcasts', function(req, res, next) {
    ArticleModel.find({"Type": "Podcast"}).sort({DateCreated: 'descending'}).exec(
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
    ArticleModel.find({}).sort({DateCreated: 'descending'}).limit(limit).exec(
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