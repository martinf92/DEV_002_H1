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
	var jobsc = require('sap-jobs-client');
	var util = require(global.__base + "utils/jobs");

	app.get("/", function(req, res) {
		res.send("Hello World Node.js");
	});


	app.get("/create_xsa_job", function(req, res) {
		var jobid;
		var options = util.appconfig();
		var scheduleId;
		
		var jname = "Job_009";
		var description = "Job_009_Desc";
		var startTime = "2017-04-16 17:10:00 +0000";
		var endTime = "2017-04-16 17:25:00 +0000";
		var cron = "* * * * * * 59";
		
		var myJob = {
			"name": jname,
			"description": description,
			"action": "https://hxehost:51012/schedulejobs/yahoo_stocks_save",
			"active": true,
			"httpMethod": "POST",
			"schedules": [{
				"cron": cron,
				"description": description,
				"data": {
					"jobname": jname
				},
				"active": true,
				"startTime": {
					"date": startTime,
					"format": "YYYY-MM-DD HH:mm:ss Z"
				},
				"endTime": {
					"date": endTime,
					"format": "YYYY-MM-DD HH:mm:ss Z"
				}
			}]
		};
		var scheduler = new jobsc.Scheduler(options);
		var scJob = {
			job: myJob
		};
		scheduler.createJob(scJob, function(error, body) {
			if (error) {
				res.status(200).send("Error registering new job ");
			} else {
				jobid = body._id;
				scheduleId = body.schedules[0].scheduleId;

				var upJob = {
					"jobId": jobid,
					"job": {
						"active": true
					}
				};
				scheduler.updateJob(upJob, function(error, body) {
					if (error) {
						res.status(200).send("Error updating job ");
					} else {
						res.status(200).send(JSON.stringify({
							JobId: jobid,
							JobName: jname,
							Desc: description,
							StartTime: startTime,
							EndTime: endTime,
							Cron: cron,
							ScheduleId: scheduleId
						}));
					}
				});
			}

		});
	});



	app.get("/yahoo_stocks_save", function(req, res) {
		var client = req.db;
		
		async.waterfall([
			
			function getStockData(callback){
				yahooFinance.historical({
						symbol: "AAPL",
						from: "2017-01-01",
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