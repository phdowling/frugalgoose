/**
 * Created by Felix on 15/10/2016.
 */

String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};


var request = require('request');
var skyscannerKey = "prtl6749387986743898559646983194";
var src = "LON";
var dest = "GE";

var routesUrl = "http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/GE/EUR/EN/{0}/{1}/anytime/anytime?apiKey={2}".format(src, dest, skyscannerKey);
var CONTINENTS = {
    EU: 'Europe',
    AF: 'Africa',
    AS: 'Asia',
    NA: 'North America',
    SA: 'South America',
    OC: 'Oceania'
};

var CONTINENTS_COUNTRIES_MAP = {
    EU: ['DE-sky', 'UK-sky', 'IT-sky', 'FR-sky'],
    AF: ['ZA-sky'],
    AS: ['CN-sky'],
    NA: ['US-sky', 'CA-sky'],
    SA: ['AR-sky'],
    OC: ['AU-sky', 'NZ-sky']
};

function testRequest() {
    request('http://www.google.com', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(routesUrl) // Show the HTML for the Google homepage.
        }
    })
}

function getCheapeastPlaces() {

}


module.exports = {testRequest: testRequest}