// Basic node.js deps
var fs = require('fs');
var path = require('path');

// Use cssmin for minification
var cssmin = require('cssmin');

// Load in CSSAsset for class functions
var CSSAsset = require('./CSSAsset');

// Export the minification function
module.exports = function(page) {
	// Final css
	page.css = "";
	var comment = "/*\nThis stylesheet is a minified combination of other stylesheets:\n";
	var length = 0;
	var total = 0;
	// Contains arrays for each size with the asset
	var sizes = {};
	// Filter only css assets
	page.annotated_assets.filter(function(asset) {
		return (asset instanceof CSSAsset);
	// Loop each asset
	}).forEach(function(asset) {
		// Create the arrray if needed
		if (!sizes[asset.size]) { sizes[asset.size] = []; }
		// Add to the size in order
		sizes[asset.size].push(asset);
	});
	// Loop each size
	Object.keys(sizes).forEach(function(size) {
		// Read each file and minify in order
		var css = cssmin(
			sizes[size].map(function(asset) {
				var file = fs.readFileSync(path.join(__dirname, "..", "..", asset.getPath(true))).toString();
				length += file.length;
				total++;
				comment += asset.getPath(false) + "\n";
				return file;
			}).join("\n")
		);
		// Prefix and Suffix of the css
		var prefix = "";
		var suffix = "";
		// Get the query for the size
		var query = CSSAsset.getQuery(size);
		// If a query was found
		if (query) {
			prefix = "@media " + query + " {";
			suffix = "}"
		}
		// Wrap with the appropriate prefix and suffix and add to the final css
		page.css += prefix + css + suffix;
	});
	comment += "\nThis process has allowed us to reduce " + total + " HTTP Request(s) to 1 Request.\nIn addition, it has allowed us to reduce the total characters from " + length + " to " + page.css.length + " characters (excluding this comment).\n*/\n\n";
	page.css = comment + page.css;
	// Create the asset for the minified css
	page.minified_assets.push(
		new CSSAsset(page.name + '.css')
			.setType(CSSAsset.kTypeMinified)
	);
}