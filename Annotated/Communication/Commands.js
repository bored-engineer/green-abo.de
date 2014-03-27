// FIXME: Poluting the global namespace is really ugly.

// Commands namespace
var Commands = {
	// Parses data
	parse: function(msg) {

		// Object with data and args
		var cmd, args, local = true;

		// It's a string so it's a chat command
		if (typeof msg === "string") {

			// If it was not a command, just return false
			if (msg.substring(0, 1) !== '!') {
				return false;
			}

			// Get the args passed to parse other than the message
			args = Array.prototype.slice.call(arguments, 1);

			// Extract the command and the args to that command
			var arg = msg.substring(1).split(" ");
			cmd = arg.shift();
			args.push(arg.join(' '));

		// Server command
		} else {

			// Remote command
			local = false;

			// Copy data
			cmd = msg.cmd;
			args = [msg];

		}
		
		// Loop each possible command
		for (var i in Commands.arr) {
			// Only use local commands
			if (Commands.arr[i].local === local) {
				// Loop each alias
				for (var j in Commands.arr[i].names) {
					// If it's the matching one, execute it
					if (Commands.arr[i].names[j] === cmd) {
						// Execute it
						Commands.arr[i].func.apply({
							cmd: cmd
						}, args);
						// Return success
						return true;
					}
				}
			}
		}

		// If local command and not found
		if (local) {
			// fallback to the first (error) cmd
			Commands.arr[0].func.apply(this, args);
		} else {
			console.log(args[0]);
		}

		// Return success (since it was still a command)
		return true;

	},
	// Array of commands
	arr: []
};

// Command constructor
function Command(names, local, func) {
	// Save the info
	this.names = names;
	this.local = local;
	this.func = func;
	// Add self to commands list
	Commands.arr.push(this);
}