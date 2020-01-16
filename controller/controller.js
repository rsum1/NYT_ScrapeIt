var express = require('express')
var router = express.Router()
var path = require('path')

//dependencies for scraping
var request = require('request')
var cheerio = require('cheerio')

//connections to models
var Comment = require("../models/Comment.js")
var Article = require("../models/Article.js")

//route to index page
router.get('/', function (req, res) {
  res.redirect('/articles')
})

//get request for scraping NYT
router.get('/scrape', function (req, res) {
  request('https://www.nytimes.com/section/technology', function (error, response, html) {
    var $ = cheerio.load(html)
    var titlesArray = []

    $('.css-1l4spti')
      .each(function (i, elem) {
        var result = {}

        result.title = $(this)
          .children('a')
          .children('h2')
          .text()
        result.link = $(this)
          .children('a')
          .attr("href")

        if (result.title !== "" && result.link !== "") {
          if (titlesArray.indexOf(result.title) == -1) {
            titlesArray.push(result.title);

            Article.count({ title: result.title }, function (err, test) {
              if (test === 0) {
                var entry = new Article(result);

                entry.save(function (err, doc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(doc);
                  }
                });
              }
            });
          } else {
            console.log("Article already exists.");
          }
        } else {
          console.log("Not saved to DB, missing data");
        }
      })
    res.redirect('/')
  })
})

//grab articles and populate the DOM in the /articles endpoint
// router.get('/articles', function (req, res) {
//   Article.find().sort({ _id: -1 }).exec(function (err, doc) {
//     if (err) {
//       console.log(err)
//     } else {
//       var nextArticle = { article: doc }
//       res.render('index', nextArticle)
//     }
//   })
// })==========================

router.get("/articles", function (req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render("index", artcl);
      }
    });
});




//articles JSON route, scrape articles from MongoDB into a JSON
// router.get("/articles-json", function (req, res) {
//   Article.find({}, function (err, doc) {
//     if (err) {
//       console.log(err)
//     } else {
//       res.json(doc)
//     }
//   })
// })===================


router.get("/articles-json", function (req, res) {
  Article.find({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

module.exports = router

