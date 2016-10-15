var express = require('express');
var skyscanner_getter = require('../skyscanner_getter');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  skyscanner_getter.testRequest();

});

module.exports = router;

