// Wait for the page to load
$(function() {

	// Log that we have started
	new Message('Info', 'Connecting...', 'green');

	// Connect to the /chat server
	var sockjs = new SockJS('/sockjs');

	// Send a command 
	function send(command, data) {
		sockjs.send(
			JSON.stringify({
				cmd: command,
				data: data
			})
		);
	}

	// Called when enter/submit it fired on chat
	function newChat() {
		// If the socket is open
		if (sockjs.readyState !== SockJS.OPEN) {
			// Just print an error
			new Message('Error', 'Not currently connected!', true, 'error');
		} else {
			// Extract the chat message
			var msg = $("#chat").val();
			// If it's not a command
			if (!Commands.parse(msg)) {
				// It's a message, so send it
				send('message', msg);
			}
			// Clear the chat box
			$("#chat").val('');
		}
	}

	// On enter, or button send
	$('#chat').keypress(function (e) {
		if (e.which === 13) {
			newChat();
			e.preventDefault();
		}
	});
	$("#chat-submit").click(newChat);

	// Default command, aka error
	new Command([], true, function() {
		// Just print an error
		new Message('Error', 'Unknown Command!', 'error');
	});

	// Clear the chat box
	new Command(['clear'], true, function() {
		Messages.clear();
	});

	// Default command, aka error
	new Command(['nick'], true, function(name) {
		// Send the nick change to the server
		send('nick', name);
	});

	// Default command, aka error
	new Command(['audio', 'video'], true, function() {
		// Save this
		var self = this;
		// Check support
		if (WebRTC.supported) {
			// Loop each client in the room
			$.each(clients, function(id, client) {
				// TODO: Query support first
				// Create a new peer connection for each
				clients[id].peer = new WebRTC.Peer(send, id);
				// Let's add our own audio/video to the peer
				clients[id].peer.addUserMedia(self.cmd === 'video', function() {
					// Create an offer for the peer
					clients[id].peer.createOffer(self.cmd === 'video');
				});
			});			
		} else {
			// Add an updated message to chat
			new Message('Error', 'Not supported in your browser', 'error');
		}
	});

	// Hello message, sent on connection
	new Command(['hello'], false, function(message) {
		// Add an updated message to chat
		new Message('Info', 'Connection Successful! Welcome to the the Green Abode chat!', 'green');
		new Message('Info', 'You\'ve been randomly assigned the name ' + message.src.name + ', use !nick to change it', 'green');
	});

	// Array of clients by id
	var clients = {};

	// A new person has joined
	new Command(['join'], false, function(message) {
		// Add the client to the clients list if they join
		clients[message.src.id] = {
			name: message.src.name
		};
		// If it's not a silent join, put it in chat
		if (!message.data.silent) {
			new Message('Info', message.src.name + ' has joined the room', 'info');
		}
	});

	// All people have joined and we're ready to chat
	new Command(['ready'], false, function(message) {
		// Get the list of clients by nickname
		var online_names = [];
		$.each(clients, function(i, client) {
			online_names.push(client.name);
		});
		// Print a message accordingly
		if (online_names.length === 0) {
			new Message('Info', 'Currently there are no other homeowners online. Feel free to send this page to a friend to see how the chat works!', 'green');
		} else if (online_names.length === 1) {
			new Message('Info', 'Currently there is 1 other homeowner online: ' + online_names[0] + '.', 'green');
		} else {
			new Message('Info', 'Currently there are ' + online_names.length + ' other homeowners online: ' + online_names.join(', '), 'green');
		}
	});

	// A new message from another user
	new Command(['message'], false, function(message) {
		new Message(message.src.name, message.data);
	});

	// A client has left
	new Command(['leave'], false, function(message) {
		// If it has an active peer connection
		if ((peer = clients[message.src.id].peer)) {
			peer.close();
		}
		// Remove them from the list
		delete clients[message.src.id];
		// Put it in chat
		new Message('Info', message.src.name + ' has left the room', 'info');
	});

	// A client has changes their nickname
	new Command(['nick'], false, function(message) {
		// Put it in chat
		new Message('Info', message.src.name + ' changed their nickname to ' + message.data, 'info');
	});

	// A query of webrtc support has been triggered
	new Command(['webrtc_query'], false, function(message) {
		// Send the status of our support
		send('webrtc_query', {
			support: WebRTC.supported
		});
	});

	// A webrtc offer has been recieved
	new Command(['webrtc_offer'], false, function(message) {
		// If we don't have support, just decline and return
		if (!WebRTC.supported) { send('webrtc_decline'); return; }
		// Create a new peer connection
		clients[message.src.id].peer = new WebRTC.Peer(send, message.src.id);
		// Now pass it the offer from the peer
		clients[message.src.id].peer.handleOffer(message);
	});

	// A webrtc offer has been declined by the peer
	new Command(['webrtc_answer'], false, function(message) {
		// If we don't have support, just ignore the message
		if (!WebRTC.supported) { return; }
		// Verify we have a connection with the peer first
		if (!clients[message.src.id].peer) { return; }
		// Pass off to webrtc
		clients[message.src.id].peer.handleAnswer(message);
	});

	// A webrtc peer has a new candidate
	new Command(['webrtc_candidate'], false, function(message) {
		// If we don't have support, just ignore the message
		if (!WebRTC.supported) { return; }
		// Verify we have a connection with the peer first
		if (!clients[message.src.id].peer) { return; }
		// Parse and use it (or rather let the browser chose to use it)
		clients[message.src.id].peer.handleCandidate(message);
	});

	// A webrtc offer has been declined by the peer
	new Command(['webrtc_decline'], false, function(message) {
		console.log(arguments);
	});

	// On a message
	sockjs.onmessage = function(e) {
		// Extract JSON data to obj, if bad, return
		var message;
		try { message = JSON.parse(e.data); } catch (e) { return; }
		// Pass down to commands parser
		Commands.parse(message);
	};

	// On connection loss (from error or close)
	sockjs.onerror = (sockjs.onclose = function(e) {
		// Log error
		new Message('Error', 'Connection Lost', 'error');
	});

	// On window close, close the socket first (if possible)
	$(window).unload(function() {
		sockjs.close();
	});

	window.socket = sockjs;

});