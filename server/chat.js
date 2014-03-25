// Use sockjs to handle chat page
var sockjs = require('sockjs');

// Special logger to not spam console
function logger(severity, message){
	if (severity === "error") {
		console.log(message);
	}
}

// Create a sockjs server to handle connections
var server = sockjs.createServer({
	log: logger
});

// Export the server
module.exports = server;