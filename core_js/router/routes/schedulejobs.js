/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, newcap:0*/
"use strict";
var express 		= require("express");
var async			= require("async");
var yahooFinance	= require("yahoo-finance");

module.exports = function(server) {
	var app = express.Router();
	var jobsc = require('sap-jobs-client');
	var util = require(global.__base + "utils/jobs");

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
	
	return app;
};