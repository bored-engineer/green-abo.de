// Wait for page load
$(function() {

	// On the nav expand button clicked
	$("#nav-expand").on('click', function() {

		// Toggle it
		$("#nav").slideToggle(500, function() {
			// On complete close
			if ($("#nav").css("display") === "none") {
				// Remove display to not mess up responsive page
				$("#nav").css("display", "");
			}
		});
		
	});

});