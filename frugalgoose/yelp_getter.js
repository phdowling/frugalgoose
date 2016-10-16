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
var restaurantCategory = "restaurants";

function getThings(place, callback) {
    var url = searchUrl.format(place, categories);

    performGet(url, function (error, result) {
        if (error) {
            console.log("Error getting places from : " + place + ". Error: " + error.toString());
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
            console.log("Error getting hotels from : " + place + ". Error: " + error.toString());
            callback(error);
        } else {
            callback(null, JSON.parse(result));
        }
    });

}

function getRestaurants(place, type, callback) {

    if (type == "american") {
        var url = searchUrl.format(place, "newamerican,tradamerican");
    } else if (type == "chinese") {
        var url = searchUrl.format(place, "chinese");
    } else if (type == "japanese") {
        var url = searchUrl.format(place, "japanese");
    } else if (type == "mexican") {
        var url = searchUrl.format(place, "mexican,newmexican");
    } else if (type == "vietnamese") {
        var url = searchUrl.format(place, "vietnamese");
    } else if (type == "german") {
        var url = searchUrl.format(place, "german");
    } else {
        var url = searchUrl.format(place, restaurantCategory);
    }

    performGet(url, function (error, result) {
        if (error) {
            console.log("Error getting restaurants from : " + place + ". Error: " + error.toString());
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

module.exports = {
    getThings: getThings,
    getHotels: getHotels,
    getRestaurants: getRestaurants};