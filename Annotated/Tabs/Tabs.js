// Check if we have a tab in the page selected onload
// This might occur if someone wiht no pushState support
// sends a link to someone
if (window.location.hash.substring(1, 2) === '!') {

	// If not just a #! hash
	if (window.location.hash.length > 2) {

		// Build the url to what it would be if pushState supported
		var url = window.location.href.split('/');
		url.pop();
		url.push(window.location.hash.substring(2));
		url = url.join('/');

		// Go directly to the real page
		window.location.href = url;

	}

}

// Wait for page load
$(function() {

	// JS is enabled so remove the annoying #tabs link
	$('a[href$="#tabs"]').each(function(i, link) {
		$(link).attr('href', $(link).attr('href').split('#')[0]);
	});

	// Loop each tabs on the page
	$('.tabs').each(function(i, tabs) {
		// Loop each tab within the tabs
		$(tabs).children().each(function(j, tab) {
			// Extract the link
			var link = $(tab).find('a');
			// Extract the url
			var url = link.attr('href').split('#')[0];
			// On link click
			link.click(function(event) {
				// Make current tab inactive
				// Save the text
				var current_tab = $(event.target).parent().parent().find('a.active').removeClass('active').text();
				// Hide the current content
				$('[data-tab="' + current_tab + '"]').addClass('hidden');
				// Make this tab active
				$(event.target).addClass('active');
				// Get the clicked tab
				var clicked_tab = $(event.target).text();
				// Make the click tab content visible
				$('[data-tab="' + clicked_tab + '"]').removeClass('hidden');

				// If HTML5 push state enabled, use it
				if (history.pushState) {
					history.pushState({}, "", url);
				// Gracefully fallback to hash
				} else {
					// If already on that page, just clear hash
					if (window.location.href.split('/').pop().split('#')[0] === clicked_tab) {
						window.location.hash = '!';
					} else {
						window.location.hash = '!' + clicked_tab;
					}
				}
				window.adjust();
				// Return false to stop from working since we have js to do it instead
				return false;
			});
		});
	});
});