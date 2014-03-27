// Base node.js deps
var http = require('http');

// Load the chat module
var chatServer = require('./chat');

// Load the server module
var httpServer = require('./server');

// Load the fileSystem watch module
var buildPages = require('./filesystem');

// Run it
buildPages(function() {

	// Create a standard node server given the app
	var server = http.createServer(httpServer);

	// Install the handlers for the chat server
	chatServer.installHandlers(server, {
		prefix:'/sockjs'
	});

	// Export the server
	module.exports = server;

});