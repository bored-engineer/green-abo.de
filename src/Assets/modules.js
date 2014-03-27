// Load the two types of assets we will be using
var CSSAsset = require('./CSSAsset');
var JSAsset = require('./JSAsset');

// Export the Modules
module.exports = {
	// Default module, required for every page
	"_": [
		// Reset style
		new CSSAsset('Reset.css')
			.setComment('Reduces browser inconsistencies in things like default line heights, margins and font sizes of headings, etc'),
		// Default Grid style
		new CSSAsset('Grid/Default.css')
			.setComment('Creates a grid system for positioning elements on the page'),
		// Small Grid style
		new CSSAsset('Grid/Small.css')
			.setSize(CSSAsset.kSizeSmall)
			.setComment('Adapts the grid for small resolutions'),
		// Medium Grid style
		new CSSAsset('Grid/Medium.css')
			.setSize(CSSAsset.kSizeMedium)
			.setComment('Adapts the grid for medium resolutions'),
		// Medium Grid style
		new CSSAsset('Grid/Large.css')
			.setSize(CSSAsset.kSizeLarge)
			.setComment('Adapts the grid for large resolutions'),
		// Screen style
		new CSSAsset('Screen.css')
			.setComment('Sets up the general css for the page'),
		// Navigation Default style
		new CSSAsset('Navigation/Default.css')
			.setComment('Sets up the navigation menu'),
		// Navigation Mini style
		new CSSAsset('Navigation/Mini.css')
			.setSize(CSSAsset.kSizeMini)
			.setComment('Optimizes the navigation for mini screens'),
		// Navigation Small style
		new CSSAsset('Navigation/Small.css')
			.setSize(CSSAsset.kSizeSmall)
			.setComment('Optimizes the navigation for small screens'),
		// Navigation Large style
		new CSSAsset('Navigation/Large.css')
			.setSize(CSSAsset.kSizeLarge)
			.setComment('Optimizes the chat menu for large screens'),
		// TypeKit script
		new JSAsset('//use.typekit.net/hdx0yjc.js')
			.setLocation(JSAsset.kLocationHead)
			.setType(JSAsset.kTypeExternal)
			.setComment('Prepares to load the external proxima-nova font face'),
		// TypeKit load script
		new JSAsset('try{Typekit.load();}catch(e){}')
			.setLocation(JSAsset.kLocationHead)
			.setType(JSAsset.kTypeInline)
			.setComment('Actually Loads the external proxima-nova font face'),
		// jQuery script
		new JSAsset('//cdn.jsdelivr.net/jquery/1.11.0/jquery.min.js')
			.setType(JSAsset.kTypeExternal)
			.setComment('Makes a nice cross-browser platform to base js on'),
		// jQuery fallback script
		new JSAsset('window.jQuery || document.write(unescape("%3Cscript src=\'/Assets/jQuery/jquery-1.11.0.min.js\' type=\'text/javascript\'%3E%3C/script%3E"))')
			.setType(JSAsset.kTypeInline)
			.setComment('Provides a fallback if jQuery from the CDN fails'),
		// CSS JS script
		new JSAsset('$("body").removeClass("noJS").addClass("JS")')
			.setType(JSAsset.kTypeInline)
			.setComment('Marks that JavaScript is enabled in the browser')
	],
	// Pages that contain Tabs
	"Tabs": [
		// Tabs Default style
		new CSSAsset('Tabs/Default.css')
			.setComment('Sets up the tabs on the page'),
		// Tabs Mini style
		new CSSAsset('Tabs/Mini.css')
			.setSize(CSSAsset.kSizeMini)
			.setComment('Optimizes tabs for a mini resolution'),
		// Tabs script
		new JSAsset('Tabs/Tabs.js')
			.setComment('Provide progressive enchancement of tab functionality')
	],
	// Pages that contain a Carousel
	"Carousel": [
		// Carousel Default style
		new CSSAsset('Carousel/Default.css')
			.setComment('Sets up the carousel on the page'),
		// Carousel Mini style
		new CSSAsset('Carousel/Mini.css')
			.setSize(CSSAsset.kSizeSmall)
			.setComment('Fixes the carousel on mini resolutions'),
		// Carousel script
		new JSAsset('Carousel/Carousel.js')
			.setComment('Loads in the images for the carousel and makes them change')
	],
	// Pages that contain a Calculator
	"Calculator": [
		// Calculator Default style
		new CSSAsset('Calculator/Default.css')
			.setComment('Sets up the calculator formatting'),
		// Calculator script
		new JSAsset('Calculator/Cost.js')
			.setComment('Makes the calculator actually work')
	],
	// Pages that contain a Chat
	"Chat": [
		// Chat Default style
		new CSSAsset('Chat/Default.css')
			.setComment('Sets up the chat boxes on the page'),
		// SockJS script
		new JSAsset('/Assets/SockJS/sockjs-0.3.4.min.js')
			.setType(JSAsset.kTypeExternal)
			.setComment('Loads SockJS library'),
		// Chat Commands script
		new JSAsset('Chat/Commands.js')
			.setComment('Creates and parses commands'),
		// Chat Messages script
		new JSAsset('Chat/Messages.js')
			.setComment('Creates and cleared messages'),
		// Chat WebRTC script
		new JSAsset('Chat/WebRTC.js')
			.setComment('Addes WebRTC Support'),
		// Chat script
		new JSAsset('Chat/Text.js')
			.setComment('Creates the functioning chat area')
	]
}