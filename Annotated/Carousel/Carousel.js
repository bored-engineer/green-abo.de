/* Wait for page load */
$(function() {

	var links = [
		{
			name: 'Spot Us',
			link: 'http://www.flickr.com/photos/29792566@N08/4875664321/',
			location: '/Assets/Images/Carousel-1.jpg'
		},
		{
			name: 'Oregon DOT',
			link: 'http://www.flickr.com/photos/oregondot/6474147839/',
			location: '/Assets/Images/Carousel-2.jpg'
		},
		{
			name: 'cliving',
			link: 'http://www.flickr.com/photos/cliving/4775410067/',
			location: '/Assets/Images/Carousel-3.jpg'
		},
		{
			name: 'lamoix',
			link: 'http://www.flickr.com/photos/lamoix/9582722131/',
			location: '/Assets/Images/Carousel-3.jpg'
		},
		{
			name: 'A Siegal',
			link: 'http://www.flickr.com/photos/a_siegel/4810533075/',
			location: '/Assets/Images/Carousel-5.jpg'
		}
	];

	// Create an items list
	var list_items = [];
	var page_items = [];

	// Loop each item and create it and the pagination
	for (var i in links) {
		// Create a list element
		var li = $('<li><img /></li>');
		// Set the carousel images
		li.find('img').attr('src', links[i].location);
		// Append to ul and items array
		$('#carousel-ul').append(li);
		list_items.push(li);
		// Create an empty link
		var page = $('<a href="#"></a>');
		// Save the i
		page.attr('data-id', i);
		// Add an empty link for each and the page items
		$('#carousel-pagination').append(page);
		page_items.push(page);
	}

	// On page click, activate
	$('#carousel-pagination').children().click(function() {
		current_item = parseInt($(this).attr('data-id'), 10);
		activateImage();
		return false;
	});

	// Transition time
	var transition = 1500;

	// The current item is 0 be default
	var current_item = 0;

	// Resets the timeout before advancing automatically
	var id;
	function resetAutoAdvance() {
		if (id) { clearTimeout(id); }
		id = setTimeout(nextImage, 6000);
	}

	// Activate a new image
	function activateImage(cancelTransition) {
		// Make the correct one active in pageination
		$.each(page_items, function(index, item) {
			item.removeClass('carousel-pagination-active');
		});
		page_items[current_item].addClass('carousel-pagination-active');

		// Find the old image
		$.each(list_items, function(index, item) {
			item.fadeOut(cancelTransition ? 0 : transition);
		});
		list_items[current_item].fadeIn(cancelTransition ? 0 : transition);

		// Update the text and link
		$('#carousel-credit').text(links[current_item].name);
		$('#carousel-credit').attr('href', links[current_item].link);
		
		// Start auto advance timer again
		resetAutoAdvance();
	}

	// Advance to the next image
	function nextImage() {
		current_item++;
		if (current_item === links.length) { current_item = 0; }
		activateImage(false);
	}

	// Reverse to the prev image
	function prevImage() {
		current_item--;
		if (current_item == -1) { current_item = links.length-1; }
		activateImage(false);
	}

	// Make buttons function
	$('#carousel-prev').click(function() { prevImage(); return false; });
	$('#carousel-next').click(function() { nextImage(); return false; });

	// Start the first active image
	activateImage(true);

});