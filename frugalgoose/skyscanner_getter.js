/**
 * Created by Felix on 15/10/2016.
 */

var config = require('./config.json');

var request = require('request');
var async = require('async');
require('./string_format');
var skyscannerKey = config.skyscannerKey;

var routesUrl = "http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/GE/EUR/EN/{0}/{1}/anytime/anytime?apiKey={2}";
var suggestUrl = "http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/GE/EUR/EN/?query={0}&apiKey={1}";

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
            console.log(body); // Show the HTML for the Google homepage.
        } else {
            console.log("GET Error. Statuscode: " + response.statusCode + ". Error: " + error.toString());
        }
    })
}

function getCheapeastPlacesFromPlaceToContinent(from, to, callback) {
    var urls = to.map(function(country) {
        return routesUrl.format(from, country, skyscannerKey);
    });

    async.map(urls, performGet, function (error, result) {
        if (error) {
            console.log("Error getting places from: " + from + " to: " + to);
            callback(error)
        } else {
            callback(null, parseRoutesForCheapestDestinations(result.map(function(jsonString) {
                return JSON.parse(jsonString);
            })));
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


function getCheapeastPlacesFromPlaceToCountry(from, to, callback) {
    var url = routesUrl.format(from, to, skyscannerKey);
    performGet(url, function(error, result) {
        if (error) {
            console.log("Error getting places from: " + from + " to: " + to);
            callback(error);
        } else {
            callback(null, parseRouteForCheapestDestinations(JSON.parse(result)));
        }
    });
}

function parseRouteForCheapestDestinations(routeResult) {
    var cheapestPlaces = [];
    var allPlaces = routeResult.Places;
    var allRoutes = routeResult.Routes;

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
            if (error) {
                console.log("GET Error. Statuscode: " + response.statusCode + ". Error: " + error.toString());
                callback(error);

            }
            console.log("GET bad statuscode. Statuscode: " + response.statusCode);
            callback(new Error("Bad statuscode"));
        }
    })
}


function suggestId(query, callback) {
    var url = suggestUrl.format(query, skyscannerKey);

    performGet(url, function (error, result) {
        if (error) {
            console.log("Error getting ID. " + error.toString());
            callback(error);
        } else {
            callback(null, JSON.parse(result).Places[0].PlaceId);
        }
    });
}

function getBookingUrl(from, to, callback) {

    var url = suggestUrl.format(query, skyscannerKey);

    performGet(url, function (error, result) {
        if (error) {
            console.log("Error getting places from: " + from + " to: " + to);
            callback(error);
        } else {
            callback(null, JSON.parse(result).Places[0].PlaceId);
        }
    });

}

module.exports = {testRequest: testRequest,
    getCheapeastPlacesFromPlaceToContinent: getCheapeastPlacesFromPlaceToContinent,
    getCheapeastPlacesFromPlaceToCountry: getCheapeastPlacesFromPlaceToCountry,
    suggestId: suggestId,
    CONTINENTS_COUNTRIES_MAP: CONTINENTS_COUNTRIES_MAP};