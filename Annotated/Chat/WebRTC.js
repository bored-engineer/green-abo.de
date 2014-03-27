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
getUserMedia = (
	navigator.getUserMedia || 
	navigator.mozGetUserMedia || 
	navigator.webkitGetUserMedia
).bind(navigator);

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
		var vid = $("<video style='position: absolute; top: 0; right: 0;'/>");
		vid.attr('src', URL.createObjectURL(evt.stream));
		vid.get(0).play();
		$('body').append(vid);
	}
}

// Add the given media to the peer
WebRTC.Peer.prototype.addUserMedia = function(video, cb) {
	var self = this;
	// Request access to the proper device(s)
	getUserMedia({
		'audio': true,
		'video': video
	}, function (stream) {
		var vid = $("<video style='position: absolute; top: 0; left: 0;'/>");
		vid.attr('src', URL.createObjectURL(stream));
		vid.get(0).play();
		vid.get(0).volume = 0;
		$('body').append(vid);
		self.peer.addStream(stream);
		cb();
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