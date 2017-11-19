/* Test for lib/chat.js */

var assert = require('chai').assert;

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var overlays = require('..');

// var overlays;

describe('Server', function() {
	describe('Start', function() {
		it('Starts with no options (all defaults)', function() {
			overlays.start();

			var _hostname = 'localhost';
			var _port = 3000;
			var _directory = '/';
			var _viewEngine = 'pug';
			var _events = new EventEmitter();

			// Verify defaults
			var options = overlays.options;

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

			overlays.start(options);

			// Verify defaults
			var options = overlays.options;

			assert.notEqual(options, null);
			assert.equal(options.hostname, _hostname);
			assert.equal(options.port, _port);
			assert.equal(options.directory, _directory);
			assert.equal(options.viewEngine, _viewEngine)
			assert.equal(typeof(options.events), typeof(_events));
		});
	});
	describe('add() - Load Overlays', function() {
		beforeEach(function() {
			overlays.clear();	// Clear the list of overlays to reset the module
		})
		it('Loads a single overlay', function() {
			overlays.start({events: eventbus});

			var overlay = {
		    name: 'hpcwins',
		    type: 'video',
		    file: 'overlays/events/hpcwins.mp4'
			}

			var _template = {
				name: 'hpcwins',
				view: 'video.pug',
				selector: '#hpcwins',
				directory: 'overlays/events'
			};

			var _payload = {
				video: 'hpcwins.mp4'
			};

			overlays.add(overlay);
			var list = overlays.list();

			assert.equal(list.length, 1);
			assert.equal(list[0].template.name, _template.name);
			assert.include(list[0].template.view, _template.view);
			assert.equal(list[0].template.selector, _template.selector);
			assert.equal(list[0].template.directory, _template.directory);
			assert.deepEqual(list[0].payload, _payload);
		});
		it('Loads an array of overlays', function() {
			overlays.start({events: eventbus});

			var overlay = [{
				name: 'powermove',
				type: 'video',
				file: 'overlays/events/powermove.mp4'
			}, {
				name: 'hpcwins',
				type: 'video',
				file: 'overlays/events/hpcwins.mp4'
			}];

			var _template = {
				name: 'hpcwins',
				view: 'video.pug',
				selector: '#hpcwins',
				directory: 'overlays/events'
			};

			var _payload = {
				video: 'hpcwins.mp4'
			};

			overlays.add(overlay);
			var list = overlays.list();

			assert.equal(list.length, 2);
			assert.equal(list[1].template.name, _template.name);
			assert.include(list[1].template.view, _template.view);
			assert.equal(list[1].template.selector, _template.selector);
			assert.equal(list[1].template.directory, _template.directory);
			assert.deepEqual(list[1].payload, _payload);
		});
	});
});
