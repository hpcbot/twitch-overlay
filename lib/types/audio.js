/* audio.js - Re-usable module to create simple audio overlays */

var path = require('path');

var eventbus;	// Global event bus attached to AudioOverlay object - used for passing events

module.exports = AudioOverlay;

function AudioOverlay(name, directory) {
	// this.name;
	// this.file;

	var self;			// Used for scope when passing around events
	self = this;

	if(!name) {
		throw new Error("You must specify a name for this overlay")
	}

	// Required options
	this.name = name;											// Unique identifier for event listeners

	this.directory = directory;
	this.type = 'audio';
};
