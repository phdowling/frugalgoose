/**
 * Created by Felix on 15/10/2016.
 */

var config = require('./config.json');

var request = require('request');
var async = require('async');
require('./string_format');
var yelpToken = config.yelpToken;

var searchUrl = "https://api.yelp.com/v3/businesses/search?location={0}&categories={1}";

var categories = "landmarks,localflavor,active,nightlife";
var hotelCategory = "hotelstravel";

function testRequest() {
    var url = searchUrl.format("Munich");
    var options = {
        url: url,
        headers: {
            "Authorization": yelpToken
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Google homepage.
        } else {
            console.log("GET Error. Statuscode: " + response.statusCode + ". Error: " + error.toString());
        }
    });
}

function getThings(place, callback) {
    var url = searchUrl.format(place, categories);

    performGet(url, function (error, result) {
        if (error) {
            console.log("Error getting places from: " + from + " to: " + to);
            callback(error);
        } else {
            callback(null, JSON.parse(result));
        }
    });
}

function getHotels(place, callback) {

    var url = searchUrl.format(place, hotelCategory);

    performGet(url, function (error, result) {
        if (error) {
            console.log("Error getting places from: " + from + " to: " + to);
            callback(error);
        } else {
            callback(null, JSON.parse(result));
        }
    });

}


function performGet(url, callback) {
    var options = {
        url: url,
        headers: {
            "Authorization": yelpToken
        }
    };

    request(options, function (error, response, body) {
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

module.exports = {testRequest: testRequest,
    getThings: getThings,
    getHotels: getHotels};