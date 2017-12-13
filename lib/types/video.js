/* audio.js - Re-usable module to create simple audio overlays */

var path = require('path');

var eventbus;	// Global event bus attached to AudioOverlay object - used for passing events

module.exports = VideoOverlay;

function VideoOverlay(name, file) {
	// this.name;
	// this.video;
	// this.file;

	var self;			// Used for scope when passing around events
	self = this;

	if(!name) {
		throw new Error("You must specify a name for this overlay")
	}
	if(!file) {
		throw new Error("You must specify a Video URL");
	}

	// Required options
	this.name = name;											// Unique identifier for event listeners

	this.type = 'video';

	var filename = path.basename(file);
	var directory = path.join(path.dirname(file));

	this.directory = directory;

	this.video = '/' + this.name + '/' + filename;
};
