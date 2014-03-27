// Basic node.js deps
var path = require('path');
var fs = require('fs');

// Use uglify to minify the javascript
var uglifyjs = require("uglify-js");

// Load in the JSAsset for type and location info
var JSAsset = require('./JSAsset');

// Create a function that minifies so we can run it for the head and body assets
function minifyAssets(page, head) {
	// The comment about the minfied content
	var comment = "/*\nThis script is a minified combination of other script files:\n";
	var length = 0;
	// The final assets list
	var finalAssets = [];
	// Filter only js assets
	var files = page.annotated_assets.filter(function(asset) {
		return (asset instanceof JSAsset);
	// Filter correct location
	}).filter(function(asset) {
		return (asset.location === JSAsset.kLocationHead) === head;
	// Filter only annotated files
	}).filter(function(asset) {
		// If it's an annotated file
		if (asset.type === JSAsset.kTypeAnnotated) {
			return true;
		} else {
			// Just add it to final
			finalAssets.push(asset);
			// Remove from current list
			return false;
		}
	}).map(function(asset) {
		comment += asset.getPath(false) + "\n";
		var file = path.join(__dirname, "..", "..", asset.getPath(true));
		length += fs.readFileSync(file).toString().length;
		return path.resolve(file);
	});
	// Where minified info goes
	var minified = {};
	// If files were acutally found
	if (files.length > 0) {
		// Actually minify
		minified = uglifyjs.minify(files, {
			outSourceMap: page.name + (head ? "-H" : "-B") + ".js.map"
		});
		// Repair the map
		var map = JSON.parse(minified.map);
		map.sources = map.sources.map(function(source) { 
			return source.substring(2, source.length);
		})
		minified.map = JSON.stringify(map);
		minified.code = "//# sourceMappingURL=" + page.name + ".js.map\n" + minified.code;
		// Update the comment
		comment += "\nThis process has allowed us to reduce " + files.length + " HTTP Request(s) to 1 Request.\nIn addition, it has allowed us to reduce the total characters from " + length + " to " + minified.code.length + " characters (excluding this comment).\n*/\n\n";
		// Add to the code
		minified.code = comment + minified.code;
		// Add the final asset
		finalAssets.push(
			new JSAsset(page.name + (head ? "-H" : "-B") + ".js")
				.setType(JSAsset.kTypeMinified)
				.setLocation(head ? JSAsset.kLocationHead : JSAsset.kLocationBody)
		);
	}
	// Save it
	page["js_" + (head ? "head" : "body")] = minified;
	// Return the new assets array
	return finalAssets;
}

// Export the minification function
module.exports = function(page) {
	
	// Call for the head and body
	page.minified_assets = minifyAssets(page, true)
		.concat(
			minifyAssets(page, false)
		);

}