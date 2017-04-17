/* overlays.js - Contains basic logic for overlays */

$(document).ready(function() {
	// Initialize event listeners
	var socket = io();

	socket.on('load:house', function(overlay) {
		$.get('/overlays/' + overlay.name, function(template) {
			console.log('loading');
			$('.overlays').append(template);
		})		
	});
	// socket.on('load:house', function())
	socket.on('overlay:house', function(overlay, payload) {
		addData('.sortinghat', payload);
		showOverlay('.sortinghat', payload.delay);
	});

	var showOverlay = function showOverlay(selector, delay) {
	  	$(selector).fadeIn(650, function() {
		    // Animation complete.
		    $(selector).delay(delay).fadeOut(600);
		});
	};	

	var addData = function addData(selector, data) {
		var count = 0;
		for (var key in data) {
			var value = data[key];
		 	$(selector + ' #' + key).text(value); 

		 	console.log(selector + ' #' + key);
		}
		// 	$(overlay + ' #' + )
		// });
		// $(overlay + ' #username').text(data.username);
		// $(overlay + ' #house_text').text(data.house_text);
		
		// // Swap out image
		// $(overlay + ' #house_logo').attr('src', data.house_image);
		// // Load and play house sound
		// $(overlay + ' #house_audio').attr('src', data.house_audio);
		// $(overlay + ' #player')[0].load();
		// $(overlay + ' #player')[0].play();
	};
});