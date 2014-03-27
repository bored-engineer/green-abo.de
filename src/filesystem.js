// Base node.js deps
var path = require('path');

// Use chockidar for filesystem updates
var chokidar = require('chokidar');

// Load in the pages
var pages = require('./Page/pages');

// Rebuild all pages
function buildAllPages(cb) {
	// Loop each page
	Object.keys(pages).forEach(function(page) {
		pages[page].build();
	});
	if(cb) { cb(); }
}

// Create the watcher for the annotated assets directory
var annotatedWatcher = chokidar.watch(
	path.join(
		__dirname,
		'..',
		'annotated'
	), {
		ignored: /[\/\\]\./,
		persistent: true
	}
);

// On a file change
annotatedWatcher.on('change', function(path) {
	// Trigger a full pages rebuild since we don't track deps easily
	buildAllPages();
});

// Create the watcher for the content directory
var contentWatcher = chokidar.watch(
	path.join(
		__dirname,
		'..',
		'content'
	), {
		ignored: /[\/\\]\./,
		persistent: true
	}
);

// On a file change
contentWatcher.on('change', function(info) {
	// Trigger a single page rebuild
	pages[path.basename(info, '.jade')].build();
});

// Export the build function
module.exports = buildAllPages;