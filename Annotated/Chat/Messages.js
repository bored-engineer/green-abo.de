// FIXME: Poluting the global namespace is really ugly.

// Messages NameSpace
var Messages = {
	// Clears all messages (both from the array and the element)
	clear: function() {
		// Copy to not have bugs with array changing
		var arr = Messages.arr.slice(0);
		// Loop all Messages
		$.each(arr, function(i, message) {
			message.remove();
		});
	},
	// Parent element to all messages
	area: $('#chat-area'),
	// Array of active messages
	arr: []
}

// Message Constructor
function Message(origin, message, type) {

	// Create the elements
	this.element = $("<p><span class='chat-origin'></span><span class='chat-msg'></span></p>");

	// Set contents
	this.element.find('.chat-origin').text(origin + ": ");
	this.element.find('.chat-msg').text(message);

	// Mark if type
	this.element.find('.chat-origin').attr('data-type', type);
	this.element.find('.chat-msg').attr('data-type', type);

	// Add the message
	Messages.area.append(this.element);

	// Scroll to the bottom
	Messages.area.scrollTop(Messages.area.prop("scrollHeight"));

	// Add self to messages array
	Messages.arr.push(this);

}

// Removes message from dom and list
Message.prototype.remove = function() {
	// Remove from the array
	Messages.arr.splice(Messages.arr.indexOf(this), 1);
	// Remove from dom
	this.element.remove();
};