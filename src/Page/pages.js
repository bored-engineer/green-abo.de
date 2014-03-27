// Load in the page class
var Page = require('./Page');

// Export the pages object
module.exports = {
	'Home': 
		new Page("Home", 0)
			.addModule("Carousel"),
	'Solar-Electricity': 
		new Page("Solar-Electricity", 1)
			.setTitle("Solar Electricity")
			.addModule("Tabs", [
				'Information', 
				'Why-Solar', 
				'Implementation', 
				'Getting-Started'
			]),
	'Wind-Power':
		new Page("Wind-Power", 2)
			.setTitle("Wind Power")
			.addModule("Tabs", [
				'Information', 
				'Why-Wind', 
				'Implementation', 
				'Getting-Started'
			]),
	'Home-Efficiency':
		new Page("Home-Efficiency", 3)
			.setTitle("Home Efficiency")
			.addModule("Tabs", [
				'Getting-Started',
				'Passive-Solar',
				'Water-Smart',
				'Your-Home'
			]),
	'About-Us':
		new Page("About-Us")
			.setTitle("About Us")
			.addModule("Tabs", [
				'Luke',
				'Joseph',
				'Trenton'
			]),
	'Chat':
		new Page("Chat")
			.addModule("Chat"),
	'Cost-Calculator':
		new Page("Cost-Calculator", 4)
			.setTitle("Cost Calculator")
			.addModule("Calculator"),
	'404':
		new Page("404")
			.setTitle("Page Not Found")
}