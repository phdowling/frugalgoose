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
var async = require('async');
var skyscannerKey = "prtl6749387986743898559646983194";
var src = "LON";
var dest = "GE";

var routesUrl = "http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/GE/EUR/EN/{0}/{1}/anytime/anytime?apiKey={2}";
var suggestUrl = "http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/GE/EUR/EN/?query={0}&apiKey={1}";

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
            console.log(routesUrl); // Show the HTML for the Google homepage.
        } else {
            console.log("GET Error. Statuscode: " + response.statusCode + ". Error: " + error.toString());
        }

    })
}

function getCheapeastPlacesFromPlaceToContinent(from, to) {
    var urls = to.map(function(country) {
        return routesUrl.format(from, country, skyscannerKey);
    });

    async.map(urls, performGet, function (error, result) {
        if (error) {
            console.log("Error getting places from: " + from + " to: " + to)
        } else {
            return parseRoutesForCheapestDestinations(result.map(function(jsonString) {
                return JSON.parse(jsonString);
            }));
        }
    });
}

function parseRoutesForCheapestDestinations(routeResults) {
    var cheapestPlaces = [];
    var allPlaces = [].concat.apply([], routeResults.map(function(routeResult) {
        return routeResult.Places
    }));
    var allRoutes = [].concat.apply([], routeResults.map(function(routeResult) {
        return routeResult.Routes
    }));

    allRoutes.sort(function(a, b) {
        return a.Price - b.Price;
    });

    allRoutes = allRoutes.slice(0, 10);

    for (var routeIndex in allRoutes) {
        var route = allRoutes[routeIndex];
        var destination = placeForId(route.DestinationId, allPlaces);
        cheapestPlaces.push({"destination": destination, "price": route.Price});
    }
    return cheapestPlaces;
}

function placeForId(id, places) {
    for (var placeIndex in places) {
        var place = places[placeIndex];
        if (place.PlaceId == id) {
            return place;
        }
    }
}

function performGet(url, callback) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null, body);
        } else {
            console.log("GET Error. Statuscode: " + response.statusCode + ". Error: " + error.toString());
            callback(error);
        }
    })
}


function suggestId(query) {
    var url = suggestUrl.format(query, skyscannerKey);
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body).Places[0].PlaceId
        } else {
            console.log("GET Error. Statuscode: " + response.statusCode + ". Error: " + error.toString());
        }
    })
}

module.exports = {testRequest: testRequest,
    getCheapeastPlacesFromPlaceToContinent: getCheapeastPlacesFromPlaceToContinent,
    suggestId: suggestId,
    CONTINENTS_COUNTRIES_MAP: CONTINENTS_COUNTRIES_MAP};