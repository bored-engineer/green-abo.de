// Use sockjs to handle chat page
var sockjs = require('sockjs');

// Special logger to not spam console
function logger(severity, message){
	if (severity === "error") {
		console.log(message);
	}
}

// SockJS server
var sockjs = require('sockjs');

// Top 100 2012 names from SS
var names = 'Sophia,Emma,Isabella,Jacob,Mason,Ethan,Noah,Olivia,William,Liam,Jayden,Michael,Ava,Alexander,Aiden,Daniel,Matthew,Elijah,Emily,James,Anthony,Benjamin,Abigail,Joshua,Andrew,David,Joseph,Logan,Jackson,Mia,Christopher,Gabriel,Madison,Samuel,Ryan,Lucas,John,Nathan,Isaac,Dylan,Caleb,Elizabeth,Chloe,Christian,Landon,Jonathan,Carter,Ella,Luke,Owen,Brayden,Avery,Gavin,Wyatt,Addison,Isaiah,Aubrey,Henry,Eli,Hunter,Lily,Jack,Natalie,Evan,Sofia,Jordan,Nicholas,Tyler,Aaron,Charlotte,Zoey,Jeremiah,Julian,Cameron,Grace,Hannah,Amelia,Harper,Levi,Lillian,Brandon,Angel,Austin,Connor,Adrian,Robert,Samantha,Charles,Evelyn,Victoria,Thomas,Brooklyn,Sebastian,Zoe,Colton,Jaxon,Layla,Kevin,Zachary,Ayden'.split(',');

// Create the communications server
var server = sockjs.createServer({
	sockjs_url: "//green-abo.de/Assets/SockJS/sockjs-0.3.4.min.js",
	log: logger
});

// Get the clients
var clients = {};

// Function name
function connectionInfo(conn, data) {
	data = data || {};
	data.id = conn.id;
	data.name = conn.name;
	return data;
}

// Send to individual message
function send(source, conn, command, data) {
	conn.write(
		JSON.stringify({
			cmd: command,
			src: connectionInfo(source),
			data: data
		})
	);
}

// Broadcast to all clients
function broadcast(connection, command, data, ignore_self) {
	for(var id in clients) {
		if (ignore_self) {
			if (id !== connection.id) {
				send(connection, clients[id], command, data);
			}
		} else {
			send(connection, clients[id], command, data);
		}
	}
}

// On a new connection
server.on('connection', function(connection) {

	// Generate a random name for the client
	connection.name = names[Math.floor(Math.random()*names.length)];

	// Send the hello
	send(connection, connection, 'hello');
	
	// On a message
	connection.on('data', function(message) {

		// Parse as JSON, if failure ignore
		try { message = JSON.parse(message); } catch (e) { return; }

		// If no command passed, ignore
		if (!message.cmd || !message.data) { return; }

		var data = message.data;
		switch(message.cmd) {
			case "message":
				broadcast(connection, 'message', data);
				break;
			case "nick":
				if (typeof data === "string") {
					broadcast(connection, 'nick', data);
					connection.name = data;
				}
				break;
			case "webrtc_query":
			case "webrtc_decline":
			case "webrtc_offer":
			case "webrtc_answer":
			case "webrtc_candidate":
				if (!data.dst) { return; }
				if (!clients[data.dst]) { return; }
				send(connection, clients[data.dst], message.cmd, data);
				break;
		}

	});

	// On close
	connection.on('close', function() {
		broadcast(connection, 'leave', {}, true);
		delete clients[connection.id];
	});

	// Broadcast a join of this client to everyone
	broadcast(connection, 'join', {
		silent: false
	}, true);

	// Send the client silent joins for everyone already in the room
	for (var id in clients) {
		send(clients[id], connection, 'join', {
			silent: true
		});
	}

	// Add the client to the list
	clients[connection.id] = connection;

	// Send the hello
	send(connection, connection, 'ready');

});

// Export the server
module.exports = server;