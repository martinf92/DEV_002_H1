/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, newcap:0*/
"use strict";
var express 		= require("express");
var async			= require("async");
var yahooFinance	= require("yahoo-finance");
var googleTrends	= require("google-trends-api");
var flightTracker = require("flight-tracker");
var WebSocketServer = require("ws").Server;

module.exports = function(server) {
	var app = express.Router();

	app.get("/", function(req, res) {
		res.send("Hello World Node.js");
	});
	
	app.get("/example1", function(req, res) {
		var client = req.db;
		client.prepare("select SESSION_USER from \"DUMMY\" ",
			function(err, statement) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				}
				statement.exec([],
					function(err, results) {
						if (err) {
							res.type("text/plain").status(500).send("ERROR: " + err.toString());
							return;
						} else {
							var result = JSON.stringify({
								Objects: results
							});
							res.type("application/json").status(200).send(result);
						}
					}
				);
			}
		);
	});

	app.get("/example2", function(req, res) {
		var client = req.db;
		
		async.waterfall([
			function prepare(callback) {
				client.prepare("select SESSION_USER from \"DUMMY\" ",
					function(err, statement) {
						callback(null, err, statement);
					});
			},
			function execute(err, statement, callback) {
				statement.exec([],
					function(execErr, results) {
						callback(null, execErr, results);
					});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				} else {
					var result = JSON.stringify({ Objects: results });
					res.type("application/json").status(200).send(result);
				}
				callback();
			}
		]);
	});
	
	
	app.get("/yahoo_stocks_save", function(req, res) {
		var client = req.db;
		
		async.waterfall([
			
			function getStockData(callback){
				yahooFinance.historical({
						symbol: "AAPL",
						from: "2000-01-01",
						to: "2017-01-30"
					}, function (err, quotes) {
						
						var results = [];
						
						for(var x in quotes){
							results.push([
						  		JSON.stringify(quotes[x].adjClose),
						  		JSON.stringify(quotes[x].close),
						  		JSON.stringify(quotes[x].date),
						  		JSON.stringify(quotes[x].high),
						  		JSON.stringify(quotes[x].low),
						  		JSON.stringify(quotes[x].open),
						  		JSON.stringify(quotes[x].symbol),
						  		JSON.stringify(quotes[x].volume)
							]);
						}
						
						callback(null, err, results);
					}
				);
			},
			
			function prepare(error, results, callback) {
				client.prepare("INSERT INTO \"YahooFinance.Stocks\" VALUES(?,?,?,?,?,?,?,?)",
					function(err, statement) {
						callback(null, results, err, statement);
					});
			},
			
			function execute(results, err, statement, callback) {
				statement.exec(results,
					function(execErr, rows) {
						callback(null, execErr, rows);
					});
			},
			
			function response(err, rows, callback) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				} else {
					var result = JSON.stringify({ Objects: rows });
					res.type("application/json").status(200).send(rows);
				}
				callback();
			}
		]);
	});
	
	
	app.get("/yahoo_stocks_live/:symbol/:from/:to", function(req, res) {
		
		yahooFinance.historical({
			symbol: req.params.symbol,
			from: req.params.from,
			to: req.params.to
			}, function (err, quotes) {
				if (err) {
						res.type("text/plain").status(500).send("ERROR: " + err.toString());
						return;
					} else {
						res.type("application/json").status(200).send(quotes);
				}
		});
	});
	
	app.get("/google_queries_live/:query", function(req, res) {
		
		googleTrends.relatedQueries({
			keyword: req.params.query
			}, function (err, results) {
				if (err) {
						res.type("text/plain").status(500).send("ERROR: " + err.toString());
						return;
					} else {
						res.type("application/json").status(200).send(results);
				}
		});
	});
	
	
	app.get("/flight_tracker", function(req, res) {
		
		flightTracker({
		    // Where and when are you flying from? 
		    start: ["Munich", new Date(2017, 4, 6, 20, 15)]
		 
		    // Where and when are you flying to? 
		  , end: ["Heathrow, London", new Date(2017, 4, 6, 21, 15)]
		 
		    ///// The following are the defaults. You don't 
		    ///// have to provide them as long you are happy with them. 
		 
		    // How often do you want to update the output? 
		  , interval: 50
		 
		    // Width of the stream 
		  , width: process.stdout.columns || 60
		 
		    // By default, show two decimals 
		  , decimals: 20
		 
		    // By default, use the standard out stream of the current process 
		  , stream: process.stdout
		}, function (err){
			if (err) {
				res.type("text/plain").status(500).send("ERROR: " + err.toString());
				return;
			}
		});
	});



	return app;
};