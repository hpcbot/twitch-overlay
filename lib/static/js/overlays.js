/* overlays.js - Contains basic logic for overlays */

$(document).ready(function() {
	// Initialize event listeners
	var socket = io();

	socket.on('overlay:house', function(payload) {

		console.log(payload);
		addData('.sortinghat', payload);
		showOverlay('.sortinghat', payload.delay);
    	
	});

	var showOverlay = function showOverlay(overlay, delay) {
	  	$(overlay).fadeIn(650, function() {
		    // Animation complete.
		    $(overlay).delay(delay).fadeOut(600);
		});
	};	

	var addData = function addData(overlay, data) {
		$(overlay + ' #username').text(data.username);
		$(overlay + ' #house_text').text(data.house_text);
		
		// Swap out image
		$(overlay + ' #house_logo').attr('src', data.house_image);
		// Load and play house sound
		$(overlay + ' #house_audio').attr('src', data.house_audio);
		$(overlay + ' #player')[0].load();
		$(overlay + ' #player')[0].play();
	};
});