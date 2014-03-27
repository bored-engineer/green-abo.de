// WebRTC namespace
var WebRTC = {};

// Oh the joys of vendor prefixes
RTCPeerConnection = (
	window.mozRTCPeerConnection || 
	window.webkitRTCPeerConnection || 
	window.RTCPeerConnection
);
RTCSessionDescription = (
	window.mozRTCSessionDescription || 
	window.webkitRTCSessionDescription || 
	window.RTCSessionDescription
);
RTCIceCandidate = (
	window.mozRTCIceCandidate || 
	window.webkitRTCIceCandidate || 
	window.RTCIceCandidate
);

// Make a function for atttaching to a video
var getUserMedia = function() {};
var attachMediaStream;
if (navigator.mozGetUserMedia) {
	getUserMedia = navigator.mozGetUserMedia.bind(navigator);
	attachMediaStream = function(element, stream) {
		element.mozSrcObject = stream;
		element.play();
	};
} else if (navigator.webkitGetUserMedia) {
	getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
	attachMediaStream = function(element, stream) {
		if (typeof element.srcObject !== 'undefined') {
			element.srcObject = stream;
			element.play();
		} else if (typeof element.mozSrcObject !== 'undefined') {
			element.mozSrcObject = stream;
			element.play();
		} else if (typeof element.src !== 'undefined') {
			element.src = URL.createObjectURL(stream);
			element.play();
		} else {
			console.log('Error attaching stream to element.');
		}
	};
}

// If the browser has support for peer connections
WebRTC.supported = !!(RTCPeerConnection);

// When an error occurs at any point
function error(error) {
	throw error;
}

// Standard for offers/answers
WebRTC.mediaConstraints = {
	'mandatory': {
		'OfferToReceiveAudio':true, 
		'OfferToReceiveVideo':true
	}
};

// Peer Connection Constructor
WebRTC.Peer = function(send, dst) {

	// Save the destination id of the person we are peered with
	this.dst = dst;

	// Save the send function
	this.send = send;

	// Create a new connection
	this.peer = new RTCPeerConnection({
		// Only use green-abo.de servers for the stun/turn handshake in order of proximity to national competition
		"iceServers": [
			{
				// Our turn/stun server in New York
				"url": "turn:2f06c246-477d-48fe-bc5d-7f8a2f496453.us:3478",
				"username": "Green Abode",
				"credential": "g2WbcKzMypXgwq35"
			},
			{
				// Our turn/stun server in San Francisco
				"url": "turn:d88ed82f-20d6-4c68-80d4-7c62c14cf55f.us:3478",
				"username": "Green Abode",
				"credential": "gJhTbtZCftTWC6zs"
			},
			{
				// Our turn/stun server in Amsterdam
				"url": "turn:b12eba4b-454b-44db-b0f7-dce4158d313e.us:3478",
				"username": "Green Abode",
				"credential": "HAwvMcMmZ527UnTN"
			},
			{
				// Our turn/stun server in Singapore
				"url": "turn:dd64e9f4-63b4-42ac-80f0-e07ca1699a23.us:3478",
				"username": "Green Abode",
				"credential": "T2GVpAGMGLTyjWXU"
			}
		]
	}, {
		// Fix chrome not enabling dtls by default so we can interop with Firefox
		"optional": window.mozRTCPeerConnection ? [] : [{
			"DtlsSrtpKeyAgreement": true
		}]
	});

	// When we get a new ice candidate
	this.peer.onicecandidate = function (evt) {
		// If it's a candidate and not a relay
		if (evt.candidate) {
			// Forward the candidate to our peer so they can utilize it too 
			send('webrtc_candidate', {
				candidate: evt.candidate,
				dst: dst
			});
		}
	};

	// When a new stream (not our own) is added to the peer
	this.peer.onaddstream = function(evt) {
		// Create a new video element
		var vid = $("<video data-visible=false />");
		// Attach to the stream
		attachMediaStream(vid.get(0), evt.stream);
		// Wait for it to load
		vid.get(0).addEventListener('loadeddata', function() {
			// Add to dom
			$("#videos").append(vid);
			// Transition
			vid.attr("data-visible", "true");
		});
	}
}

// Add the given media to the peer
WebRTC.Peer.prototype.addUserMedia = function(info, cb) {
	var self = this;
	// Request access to the proper device(s)
	getUserMedia({
		'audio': true,
		'video': {
			'mandatory': {
				maxHeight: 240,
				maxWidth: 320 
			}
		}
	}, function (stream) {
		// Attach to the stream
		attachMediaStream($("#localVideo").get(0), stream);
		// Mute self to avoid feedback
		$("#localVideo").get(0).volume = 0;
		// Wait for it to load
		$("#localVideo").get(0).addEventListener('loadeddata', function() {
			// Display videos
			$("#videos").attr("data-enabled", "true");
			// Done
			cb();
			// In 1 second, fade in
			setTimeout(function() {
				$("#localVideo").attr("data-visible", "true");
			}, 1000);
		});
		// Add our own stream to our own peer
		self.peer.addStream(stream);
	}, error);
};

// Handle an offer for the peer from another person
WebRTC.Peer.prototype.handleOffer = function(message) {
	// Yay JavaScript
	var self = this;
	// Set the remote description
	this.peer.setRemoteDescription(new RTCSessionDescription(message.data.offer));
	// Let's begin to add our media as well
	this.addUserMedia(message.data.video, function() {
		// Create an answer for the client
		self.peer.createAnswer(function(description) {
			// Save it for out own
			self.peer.setLocalDescription(description);
			// Send our answer to the peer
			self.send('webrtc_answer', {
				dst: self.dst,
				answer: description
			});
		}, error, WebRTC.mediaConstraints);
	});
}

// Handle an ice candidate from a peer
WebRTC.Peer.prototype.handleCandidate = function(message) {
	// Parse the candidate
	this.peer.addIceCandidate(
		new RTCIceCandidate(
			message.data.candidate
		)
	);
}

// Handle an answer from the client
WebRTC.Peer.prototype.handleAnswer = function(message) {
	// Set the remote description
	this.peer.setRemoteDescription(
		new RTCSessionDescription(
			message.data.answer
		)
	);
};

// Create an offer for the peer
WebRTC.Peer.prototype.createOffer = function(video) {
	// Yay javascript
	var self = this;
	// Create an offer
	this.peer.createOffer(function(description) {
		// Save it with ourself
		self.peer.setLocalDescription(description);
		// Send it to the peer
		self.send('webrtc_offer', {
			dst: self.dst,
			video: video,
			offer: description
		});
	}, error, WebRTC.mediaConstraints);
}