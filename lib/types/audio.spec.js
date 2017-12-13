/* Test for video.js */

var path = require('path');
var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var VideoOverlay;

describe('Video Overlay Module', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

			VideoOverlay = require('..');
	});
	it('Initializes properly with default options', function() {

		VideoOverlay.eventbus = eventbus;

		var options = {
			video: 'powermove.mp4',
			trigger: 'powermove'
		};

		var _name = 'powermove';
		var _eventbus = eventbus;
		var _video = 'powermove.mp4';

		var _type = 'whisper';
		var _whitelist = true;
		var _triggerevent = 'powermove:show';

		var _overlayevent = 'stream:powermove';
		var _view = path.join(__dirname, 'views/video.pug');
		var _selector = '#powermove';
		var _directory = '.';

		var command = new VideoOverlay(options);

		assert.equal(command.triggers.length, 1);
		assert.equal(command.triggers[0].name, _name);
		assert.equal(command.overlay.name, _name);

		// Triggers defaults
		assert.equal(command.triggers[0].type, _type);
		assert.equal(command.triggers[0].whitelist, _whitelist);
		assert.equal(command.triggers[0].event, _triggerevent);

		// Overlay defaults
		assert.equal(command.overlay.event, _overlayevent);
		assert.equal(command.overlay.view, _view);
		assert.equal(command.overlay.selector, _selector);
		assert.equal(command.overlay.directory, _directory);

		delete command;
	});


	describe('Trigger Overlay', function() {
		it('Sends a valid event to overlay server', function(done) {
			var options = {
				video: 'powermove/video/powermove.mp4',
				trigger: 'powermove'
			};

			var command = new VideoOverlay(options);

			var _payload = {
				video: 'powermove.mp4'
			};

			eventbus.once('stream:powermove', function(payload) {

				assert.deepEqual(payload, _payload);

				done();
			});

			eventbus.emit('powermove:show');
		});
		it('Handles multiple overlays simultaneously', function(done) {
			var first_overlay = {
				video: 'powermove/video/powermove.mp4',
				trigger: 'powermove',
				eventbus: eventbus
			};
			var second_overlay = {
				video: 'hpcwins/video/hpcwins.mp4',
				trigger: 'hpcwins',
				eventbus: eventbus
			};

			var first_command = new VideoOverlay(first_overlay);
			var second_command = new VideoOverlay(second_overlay);

			var _payload = {
				video: 'powermove.mp4'
			};

			eventbus.once('stream:powermove', function(payload) {

				assert.deepEqual(payload, _payload);

				done();
			});

			eventbus.emit('powermove:show');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
