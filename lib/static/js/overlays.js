/* overlays.js - Contains basic logic for overlays */

$(document).ready(function() {
	var socket = io();

	// Loads an overlay when a new browser session comes online
	socket.on('load:template', function(overlay) {
		// Allows text to fade in after the voice command is executed
		var delayFadeOut = function () {
			// Animation delay passed, fade back in
			$(overlay.selector).fadeOut();
		};

		$.get('/overlays/' + overlay.name, function(template) {
			$('.overlays').append(template);

			// Hide overlay when video finishes
			var videoPlayer = $(overlay.selector).find('video');
			if(videoPlayer) {
				videoPlayer.on('ended', delayFadeOut);
			}

			// Hide overlay when audio/mp4 finishes
			var audioPlayer = $(overlay.selector).find('audio');
			if(audioPlayer) {
				audioPlayer.on('ended', delayFadeOut);
			}
		})
	});

	// Fired when a specific overlay should be shown
	socket.on('show:overlay', function(template, payload) {
		addData(template.name, template.selector, payload);
		showOverlay(template.selector);

		if(payload.event == 'quidditch') {
				// Custom event to listen for
				startGame();
		}
	});

	// Fades the overlay in/out
	var showOverlay = function showOverlay(selector) {
		$(selector).fadeIn(650);
	};

	// Loads the specific template data passed in for this event
	var addData = function addData(name, selector, data) {
		var count = 0;

		var callbackFadeOut = function () {
			// responsiveVoice places the audio callback on the 'speak' event so we need a separate fadeout function for them
			// Animation delay passed, fade back in
			$(selector).fadeOut();
		};

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
				case 'speech':
					// Handle text to speech
					value = value.substring(0, value.length-4);	// Strip the .speech from the end
					$(selector + ' #' + key).text(value);	// Display the text on screen

					responsiveVoice.speak(value, 'US English Female', {onend: callbackFadeOut});	// Say it out loud
					break;
				case 'text':
				 	$(selector + ' #' + key).text(value);
				 	break;
				case 'video':
					var source = $(selector).find('source')[0];
					source.src = name + '/' + value;

					var player = $(selector).find('video')[0];
					player.load();
					player.play();
					break;
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
			else if(extension == '.tts') {
				return('speech');
			}
			else {
				return('text');
			}
		}
	}
});
