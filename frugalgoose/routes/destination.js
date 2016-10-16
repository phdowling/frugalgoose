
var skyscannerGetter = require('../skyscanner_getter');

var CONTINENTS_COUNTRIES_MAP = require('../continent_countries_mapping.json');

exports.destinations = function(req, res) {

    if (req.query.hasOwnProperty("from") && req.query.hasOwnProperty("to")) {

        skyscannerGetter.suggestId(req.query.from, function(error, fromId) {
            if (error) {
                res.writeHead(401);
                res.end();
            } else {
                var places = null;
                var toId = null;

                var placesCallback = function(error, places) {
                    if (error) {
                        res.writeHead(401);
                        res.end();
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.writeHead(200);
                        res.write(JSON.stringify(places));
                        res.end();
                    }
                };

                if (CONTINENTS_COUNTRIES_MAP.hasOwnProperty(req.query.to.toLowerCase())) {
                    skyscannerGetter.getCheapeastPlacesFromPlaceToContinent(fromId, CONTINENTS_COUNTRIES_MAP[req.query.to.toLowerCase()], placesCallback);
                } else {
                    skyscannerGetter.suggestId(req.query.to, function(error, toId) {
                        if (error) {
                            res.writeHead(401);
                            res.end();
                        } else {
                            skyscannerGetter.getCheapeastPlacesFromPlaceToCountry(fromId, toId, placesCallback);
                        }
                    });
                }
            }
        });

    } else {
        res.writeHead(401);
        res.end();
    }
};

exports.bookingUrl = function(req, res) {
    if (req.query.hasOwnProperty("from") && req.query.hasOwnProperty("to")) {
        skyscannerGetter.suggestId(req.query.from, function(error, fromId) {
            if (error) {
                console.log("Error getting booking URL: " + error.toString());
                res.writeHead(401);
                res.end();
            } else {
                skyscannerGetter.suggestId(req.query.to, function(error, toId) {
                    if (error) {
                        console.log("Error getting booking URL: " + error.toString());
                        res.writeHead(401);
                        res.end();
                    } else {
                        skyscannerGetter.getBookingUrl(fromId, toId, function (error, url) {
                            if (error) {
                                console.log("Error getting booking URL: " + error.toString());
                                res.writeHead(401);
                                res.end();
                            } else {
                                res.setHeader('Content-Type', 'application/json');
                                res.writeHead(200);
                                res.write(JSON.stringify({url: url}));
                                res.end();
                            }
                        });

                    }
                });

            }
        })
    } else {
        res.writeHead(401);
        res.end();
    }
};