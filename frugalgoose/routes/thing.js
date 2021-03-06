/**
 * Created by Felix on 15/10/2016.
 */

var yelpGetter = require('../yelp_getter');

exports.things = function(req, res) {
    if (req.query.hasOwnProperty("place")) {
        yelpGetter.getThings(req.query.place, function(error, things) {
            if (error) {
                res.writeHead(401);
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.write(JSON.stringify(things));
                res.end();
            }
        });
    } else {
        res.writeHead(401);
        res.end();
    }
};

exports.hotels = function(req, res) {
    if (req.query.hasOwnProperty("place")) {
        yelpGetter.getHotels(req.query.place, function(error, hotels) {
            if (error) {
                res.writeHead(401);
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.write(JSON.stringify(hotels));
                res.end();
            }
        });
    } else {
        res.writeHead(401);
        res.end();
    }
};

exports.restaurants = function(req, res) {
    if (req.query.hasOwnProperty("place")) {
        var type = null;
        if (req.query.hasOwnProperty("type")) {
            type = req.query.type;
        }
        yelpGetter.getRestaurants(req.query.place, type, function(error, hotels) {
            if (error) {
                res.writeHead(401);
                res.end();
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.write(JSON.stringify(hotels));
                res.end();
            }
        });
    } else {
        res.writeHead(401);
        res.end();
    }
};
