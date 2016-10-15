
var skyscanner_getter = require('../skyscanner_getter');

exports.destinations = function(req, res) {

    if (req.query.hasOwnProperty("from") && req.query.hasOwnProperty("to")) {

        skyscanner_getter.suggestId(req.query.from, function(error, fromId) {
            if (error) {
                res.writeHead(500);
                res.end();
            } else {
                var places = null;
                var toId = null;

                var placesCallback = function(error, places) {
                    if (error) {
                        res.writeHead(500);
                        res.end();
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.writeHead(200);
                        res.write(JSON.stringify(places));
                        res.end();
                    }
                };

                switch(req.query.to.toLowerCase()) {
                    case "europe":
                        skyscanner_getter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscanner_getter.CONTINENTS_COUNTRIES_MAP.EU, placesCallback);
                        break;
                    case "asia":
                        skyscanner_getter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscanner_getter.CONTINENTS_COUNTRIES_MAP.AS, placesCallback);
                        break;
                    case "oceania":
                        skyscanner_getter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscanner_getter.CONTINENTS_COUNTRIES_MAP.OC, placesCallback);
                        break;
                    case "south america":
                        skyscanner_getter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscanner_getter.CONTINENTS_COUNTRIES_MAP.SA, placesCallback);
                        break;
                    case "north america":
                        skyscanner_getter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscanner_getter.CONTINENTS_COUNTRIES_MAP.NA, placesCallback);
                        break;
                    default:
                        skyscanner_getter.suggestId(req.query.to, function(error, toId) {
                            if (error) {
                                res.writeHead(500);
                                res.end();
                            } else {
                                skyscanner_getter.getCheapeastPlacesFromPlaceToCountry(fromId, toId, placesCallback);
                            }
                        });

                }
            }

        });

    } else {
        res.writeHead(500);
        res.end();
    }
};