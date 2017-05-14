/* overlays.js - Contains basic logic for overlays */

$(document).ready(function() {
	var socket = io();

	// Loads an overlay when a new browser session comes online
	socket.on('load:template', function(overlay) {
		$.get('/overlays/' + overlay.name, function(template) {
			$('.overlays').append(template);
		})
	});

	// Fired when a specific overlay should be shown
	socket.on('show:overlay', function(overlay, payload) {
		addData(overlay.selector, payload);
		showOverlay(overlay.selector, payload.delay);
	});

	// Fades the overlay in/out
	var showOverlay = function showOverlay(selector, delay) {
		$(selector).fadeIn(650, function() {
			setTimeout(function() {
					// Animation delay passed, fade back in
					$(selector).fadeOut(600);
			}, delay);
		});
	};

	// Loads the specific template data passed in for this event
	var addData = function addData(selector, data) {
		var count = 0;
		for (var key in data) {
			var value = data[key];

			switch(getType(value)) {
				case 'audio':
					// Load and play sound
					$(selector + ' #' + key).attr('src', value);
					$(selector + ' #' + key + '_player')[0].load();
					$(selector + ' #' + key + '_player')[0].play();
					break;
				case 'image':
					$(selector + ' #' + key).attr('src', value);
					break;
				case 'text':
				 	$(selector + ' #' + key).text(value);
				 	break;
				case 'video':
					var source = $(selector + ' #' + key + '_source')[0];
					source.src = value;

					var player = $(selector + ' #' + key)[0];
					player.load();
					player.play();
			}
		}
	};

	var getType = function getType(filename) {
		if(typeof(filename) == 'string') {
			var extension=(filename.substring(filename.length-4, filename.length));
			if(extension == '.png') {
				return('image');
			}
			else if(extension == '.m4a') {
				return('audio');
			}
			else if(extension == '.mp4') {
				return('video');
			}
			else {
				return('text');
			}
		}
	}
});
