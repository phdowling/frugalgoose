
/*
 * GET home page.
 */

var skyscanner_getter = require('../skyscanner_getter');
var yelp_getter = require('../yelp_getter');

exports.index = function(req, res){
    res.render('index', {title: 'FrugalGoose'});
    // res.writeHead(200);
    // res.write(JSON.stringify(places));
    // res.end();
    // console.log(skyscannerGetter.suggestId("Germany"));
    // skyscannerGetter.getCheapeastPlacesFromPlaceToContinent('BRE-sky', skyscannerGetter.CONTINENTS_COUNTRIES_MAP.EU);
};
