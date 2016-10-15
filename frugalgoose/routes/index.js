
/*
 * GET home page.
 */

var skyscanner_getter = require('../skyscanner_getter');

exports.index = function(req, res){
    res.render('index', { title: 'Express', foo: {bar:'baz'} });
    skyscanner_getter.testRequest();
    console.log(skyscanner_getter.suggestId("Germany"));
    skyscanner_getter.getCheapeastPlacesFromPlaceToContinent('BRE-sky', skyscanner_getter.CONTINENTS_COUNTRIES_MAP.EU);
};
