// Start with a value for the asset
function JSAsset(value) {
	// Save the value
	this.value = value;
}

// Location of the script in the html
JSAsset.kLocationHead = 0;
JSAsset.kLocationBody = 1;

// Defaults to being located in the body of the html
JSAsset.prototype.location = JSAsset.kLocationBody;

// Type of script
JSAsset.kTypeAnnotated = 0;
JSAsset.kTypeExternal = 1;
JSAsset.kTypeInline = 2;
JSAsset.kTypeMinified = 3;

// Default to a annotated file
JSAsset.prototype.type = JSAsset.kTypeAnnotated;

// Default to no comment
JSAsset.prototype.comment = "";

// Return the path to the asset on the filesystem or browser
// Used for minification of asset
JSAsset.prototype.getPath = function(fs) {
	// Different for each type
	switch (this.type) {
		case JSAsset.kTypeExternal:
			return this.value;
		case JSAsset.kTypeAnnotated:
			return (fs ? "" : "/") + "Annotated/" + this.value;
		case JSAsset.kTypeMinified:
			return (fs ? "" : "/") + "Minified/" + this.value;
	}
}

// Assign a location
JSAsset.prototype.setLocation = function(location) {
	this.location = location;
	return this;
};

// Assign a type
JSAsset.prototype.setType = function(type) {
	this.type = type;
	return this;
};

// Assign a comment
JSAsset.prototype.setComment = function(comment) {
	this.comment = comment;
	return this;
};

// Export the JSAsset class
module.exports = JSAsset;