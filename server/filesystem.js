// Base node.js deps
var path = require('path');

// Use chockidar for filesystem updates
var chokidar = require('chokidar');

// Load in the cache directory
var cache = require('./cache');

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
	// Trigger an assets rebuild
	cache.buildAssets();
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
contentWatcher.on('change', function(path) {
	// Trigger an pages rebuild
	cache.buildPages();
});