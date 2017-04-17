/* Test for lib/chat.js */

var assert = require('chai').assert;

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Overlays = require('./twitch-overlay');

// var overlays;

describe('Server', function() {
	describe('Start', function() {
		it('Starts with no options (all defaults)', function() {
			Overlays.start();

			var _hostname = 'localhost';
			var _port = 3000;
			var _directory = '/';
			var _viewEngine = 'pug';
			var _events = new EventEmitter();

			// Verify defaults
			var options = Overlays.options;

			assert.notEqual(options, null);
			assert.equal(options.hostname, _hostname);
			assert.equal(options.port, _port);
			assert.equal(options.directory, _directory);
			assert.equal(options.viewEngine, _viewEngine)
			assert.deepEqual(options.events, _events);
		});                                                   

		it('Starts with all options (no defaults)', function() {
			var options = {
				hostname: 'test.com',
				port: 3500,
				directory: '/test',
				viewEngine: 'jade',
				events: eventbus
			}

			options.events.test = 'test';

			var _hostname = 'test.com';
			var _port = 3500;
			var _directory = '/test';
			var _viewEngine = 'jade';
			var _events = eventbus;

			Overlays.start(options);

			// Verify defaults
			var options = Overlays.options;

			assert.notEqual(options, null);
			assert.equal(options.hostname, _hostname);
			assert.equal(options.port, _port);
			assert.equal(options.directory, _directory);
			assert.equal(options.viewEngine, _viewEngine)
			assert.equal(typeof(options.events), typeof(_events));		
		});
	});
});