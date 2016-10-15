
/*
 * GET home page.
 */

var skyscanner_getter = require('../skyscanner_getter');
var yelp_getter = require('../yelp_getter');

exports.index = function(req, res){

    // skyscannerGetter.testRequest();
    // console.log(skyscannerGetter.suggestId("Germany"));
    // skyscannerGetter.getCheapeastPlacesFromPlaceToContinent('BRE-sky', skyscannerGetter.CONTINENTS_COUNTRIES_MAP.EU);
    yelp_getter.testRequest();
};
