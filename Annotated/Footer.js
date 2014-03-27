// Wait for the page to load
$(function() {

	// Fixed position footer if viewport > body height
	function positionFooter() {

		// Get the current state
		var direction = $('.footer').css('position') === 'static';

		// Change appropriatly
		if (window.innerHeight > ($('body').height() + (direction ? 0 : 48))) {
			$('.footer').css('position', 'fixed').css('width', '100%').css('bottom', '0');
		} else {
			$('.footer').css('position', 'static').css('width', '100%').css('bottom', 'auto');
		}

	}

	// Position on page resize
	$(window).resize(function() {
		positionFooter();
	});
	
	// Position once on load
	positionFooter();

});