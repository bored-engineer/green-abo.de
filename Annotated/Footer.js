// Wait for the page to load
$(function() {
	function adjust() {
		var height = 0;
		height += $(".main-container").outerHeight();
		height += $(".topbar").outerHeight();
		height += $('footer').outerHeight();
		if (height < $(window).height()) {
			$('footer').css('position', 'fixed');
			$('footer').css('bottom', '0');
		} else {
			$('footer').css('position', 'relative');
			$('footer').css('bottom', 'inherit');
		}
	}
	$(window).resize(adjust);
	adjust();
	window.adjust = adjust();
});