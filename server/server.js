// Base node.js deps
var http = require('http');
var path = require('path');

// Use express.js to run the server
var express = require('express');

// Create our application
var app = express();

// Gzip content if supported for faster load
app.use(express.compress());

// Log requests to console
app.use(express.logger());

// Static serve regular asset directory
app.use(
	'/Assets',
	express.static(
		path.join(
			__dirname,
			'..',
			'static'
		)
	)
);



// Export the app
module.exports = app;