// Load in node.js deps
var fs = require('fs');
var path = require('path');

// Use jade for rendering
var jade = require('jade');

// Load in the asset minifiers
var minifyJS = require('../Assets/minifyJS');
var minifyCSS = require('../Assets/minifyCSS');

// Load in the JSAsset module
var JSAsset = require('../Assets/JSAsset');

// Load in the CSSAsset module
var CSSAsset = require('../Assets/CSSAsset');

// Load in the modules
var modules = require('../Assets/modules');

// Load in the template
var template = fs.readFileSync(__dirname + '/../template.jade').toString();

var navs = [];

// Constructor
function Page(name, nav_id) {
	this.name = name;
	this.title = name;
	this.nav_id = nav_id;
	if (nav_id !== undefined) {
		navs[nav_id] = this;
	}
	this.modules = {};
	// Add the default module
	this.addModule('_');
}

// The total assets required for the page
Page.prototype.annotated_assets = [];
Page.prototype.minified_assets = [];

// Add a new module
Page.prototype.addModule = function(name, data) {
	this.modules[name] = data;
	this.annotated_assets = this.annotated_assets.concat(modules[name]);
	return this;
};

// Set the title
Page.prototype.setTitle = function(title) {
	this.title = title;
	return this;
};

// Build the page
function build(annotated, tab) {
	// If not annotated
	if (!annotated) {
		// Minify 
		minifyJS(this);
		minifyCSS(this);
	}
	// Clone the template
	var page = template;
	// Replace the include file with the acutal page file
	page = page.replace('___INCLUDE___', this.name);
	// Compile with jade
	var result = jade.compile(page, {
		filename: path.join(__dirname, '..', '..', 'Content/' + this.name + '.jade'),
		pretty: annotated
	})({
		assets: annotated ? this.annotated_assets : this.minified_assets,
		ugly: !annotated,
		page: this,
		JSAsset: JSAsset,
		CSSAsset: CSSAsset,
		tab: tab,
		nav: navs
	});
	// Return with escaped as needed
	if (annotated) {
		return result;
	} else {
		var comment = "<!--\n\nThis Page has been minified to optimize bandwidth.\nThis process has allowed us to reduce this page from " + this.annotated.length + " characters to " + result.length + " characters (excluding this comment).\nThe un-minified and annotated version can be found here: /Annotated/" + this.name + "\n\n-->";
		return result.replace("<___REPLACE___><\/___REPLACE___>", comment);
	}
}

// Build the page
Page.prototype.build = function() {
	var self = this;
	if (this.modules.Tabs) {
		this.annotated = {};
		this.minified = {};
		this.modules.Tabs.forEach(function(tab) {
			self.annotated[tab] = build.call(self, true, tab);
			self.minified[tab] = build.call(self, false, tab);
		});
	} else {
		this.annotated = build.call(this, true);
		this.minified = build.call(this, false);
	}
};

// Export the page class
module.exports = Page;