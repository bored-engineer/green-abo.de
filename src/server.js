// Base node.js deps
var path = require('path');

// Use express.js to run the server
var express = require('express');

// Load in the pages
var pages = require('./Page/pages');

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
			'Assets'
		)
	)
);

// Static serve regular anntoated directory
app.use(
	'/Annotated',
	express.static(
		path.join(
			__dirname,
			'..',
			'Annotated'
		)
	)
);

// Get a minified css file
app.get('/Minified/:name.css', function(req, res, next) {
	if (!pages[req.params.name]) { return next(); }
	res.set('Content-Type', 'text/css');
	res.end(pages[req.params.name].css);
});

// Get a minified js file
app.get('/Minified/:name.js', function(req, res, next) {
	var name = req.params.name;
	var head = name.substring(name.length - 1, name.length) === "H";
	name = name.substring(0, name.length - 2);
	if (!pages[name]) { return next(); }
	if (!pages[name][head ? 'js_head' : 'js_body'].code) { return next(); }
	res.set('Content-Type', 'application/javascript');
	res.end(pages[name][head ? 'js_head' : 'js_body'].code);
});

// Get a minified js map file
app.get('/Minified/:name.js.map', function(req, res, next) {
	var name = req.params.name;
	var head = name.substring(name.length - 1, name.length) === "H";
	name = name.substring(0, name.length - 2);
	if (!pages[name]) { return next(); }
	if (!pages[name][head ? 'js_head' : 'js_body'].map) { return next(); }
	res.set('Content-Type', 'application/json');
	res.end(pages[name][head ? 'js_head' : 'js_body'].map);
});

// Get a annotated file/page
app.get('/Annotated/:name', function(req, res, next) {
	if (!pages[req.params.name]) { return next(); }
	if (typeof pages[req.params.name].annotated === "string") {
		res.end(pages[req.params.name].annotated);
	} else {
		var tab = Object.keys(pages[req.params.name].minified)[0];
		res.redirect(301, req.url.replace(/\/$/, "") + "/" + tab);
	}
});

// Get a annotated page by tab
app.get('/Annotated/:name/:tab', function(req, res, next) {
	if (!pages[req.params.name]) { return next(); }
	if (!pages[req.params.name].annotated[req.params.tab]) { return next(); }
	res.end(pages[req.params.name].annotated[req.params.tab]);
});

// Get the root page
app.get('/', function(req, res, next) {
	res.end(pages["Home"].minified);
});

// Get the root page
app.get('/Annotated/', function(req, res, next) {
	res.end(pages["Home"].annotated);
});

// Get a minified page
app.get('/:name', function(req, res, next) {
	if (!pages[req.params.name]) { return next(); }
	if (typeof pages[req.params.name].minified === "string") {
		res.end(pages[req.params.name].minified);
	} else {
		var tab = Object.keys(pages[req.params.name].minified)[0];
		res.redirect(301, req.url.replace(/\/$/, "") + "/" + tab);
	}
});

// Get a minified page by tab
app.get('/:name/:tab', function(req, res, next) {
	if (!pages[req.params.name]) { return next(); }
	if (!pages[req.params.name].minified[req.params.tab]) { return next(); }
	res.end(pages[req.params.name].minified[req.params.tab]);
});

// Catch all other requests
app.get('/Annotated/*', function(req, res, next) {
	// Send the 404
	res.end(pages["404"].annotated);
});

// Catch all other requests
app.get('/*', function(req, res, next) {
	// Send the 404
	res.end(pages["404"].minified);
});

// Export the app
module.exports = app;