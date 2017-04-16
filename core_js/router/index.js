"use strict";

module.exports = function(app, server) {
		app.use("/node", require("./routes/myNode")());
		app.use("/schedulejobs", require("./routes/schedulejobs")());
};