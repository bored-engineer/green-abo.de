// Constructor
function CSSAsset(path) {
	this.path = path;
}

// The type of CSS it is
CSSAsset.kTypeAnnotated = 0;
CSSAsset.kTypeMinified = 1;

// Default to annotated asset
CSSAsset.prototype.type = CSSAsset.kTypeAnnotated;

// Specific to each media query
CSSAsset.kSizeNone = 0;
CSSAsset.kSizeMini = 1;
CSSAsset.kSizeSmall = 2;
CSSAsset.kSizeMedium = 3;
CSSAsset.kSizeLarge = 4;

// Default to no size
CSSAsset.prototype.size = CSSAsset.kSizeNone;

// Default to empty comment
CSSAsset.prototype.comment = "";

// Return the path to the asset on the filesystem or browser
// Used for minification of asset
CSSAsset.prototype.getPath = function(fs) {
	if (this.type === CSSAsset.kTypeAnnotated) {
		return (fs ? "" : "/") + "Annotated/" + this.path;
	} else {
		return (fs ? "" : "/") + "Minified/" + this.path;
	}
}

// Return the media query to match the given size
CSSAsset.getQuery = function(size) {
	// Different match for each size
	switch(size) {
		case CSSAsset.kSizeNone:
			return null;
			break;
		case CSSAsset.kSizeMini:
			return "(max-width: 767px)";
			break;
		case CSSAsset.kSizeSmall:
			return "(min-width: 768px)";
			break;
		case CSSAsset.kSizeMedium:
			return "(min-width: 992px)";
			break;
		case CSSAsset.kSizeLarge:
			return "(min-width: 1200px)"
			break;
	}
}

// Assign a type
CSSAsset.prototype.setType = function(type) {
	this.type = type;
	return this;
};

// Set the size the asset should apply to of the asset
CSSAsset.prototype.setSize = function(size) {
	this.size = size;
	return this;
}

// Assign a comment to be printed in the pretty output
CSSAsset.prototype.setComment = function(comment) {
	this.comment = comment;
	return this;
};

// Export the CSSAsset class
module.exports = CSSAsset;