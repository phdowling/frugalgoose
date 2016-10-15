
var skyscannerGetter = require('../skyscanner_getter');

exports.destinations = function(req, res) {

    if (req.query.hasOwnProperty("from") && req.query.hasOwnProperty("to")) {

        skyscannerGetter.suggestId(req.query.from, function(error, fromId) {
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
                        skyscannerGetter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscannerGetter.CONTINENTS_COUNTRIES_MAP.EU, placesCallback);
                        break;
                    case "asia":
                        skyscannerGetter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscannerGetter.CONTINENTS_COUNTRIES_MAP.AS, placesCallback);
                        break;
                    case "oceania":
                        skyscannerGetter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscannerGetter.CONTINENTS_COUNTRIES_MAP.OC, placesCallback);
                        break;
                    case "south america":
                        skyscannerGetter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscannerGetter.CONTINENTS_COUNTRIES_MAP.SA, placesCallback);
                        break;
                    case "north america":
                        skyscannerGetter.getCheapeastPlacesFromPlaceToContinent(fromId, skyscannerGetter.CONTINENTS_COUNTRIES_MAP.NA, placesCallback);
                        break;
                    default:
                        skyscannerGetter.suggestId(req.query.to, function(error, toId) {
                            if (error) {
                                res.writeHead(500);
                                res.end();
                            } else {
                                skyscannerGetter.getCheapeastPlacesFromPlaceToCountry(fromId, toId, placesCallback);
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