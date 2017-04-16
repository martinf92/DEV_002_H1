/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, quotes: 0, no-use-before-define: 0, new-cap:0 */
"use strict";
var xsenv = require("sap-xsenv");

module.exports = {
	appconfig: function() {
		var services = xsenv.getServices({
			jobscheduler: {
				tag: "jobscheduler"
			}
		}).jobscheduler;
		return {
			timeout: 15000,
			user: services.user,
			password: services.password,
			baseURL: services.url
		};
	}
};