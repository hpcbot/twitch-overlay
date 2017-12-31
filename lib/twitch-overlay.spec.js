/* Test for lib/twitch-overlay.js */

const assert = require('chai').assert
const sinon = require('sinon')

const EventEmitter = require('events')
const eventbus = new EventEmitter	// Temporary event bus to prevent events firing across files

// let overlays

describe('Server', function() {
	beforeEach(function() {
		this.sinon = sandbox = sinon.sandbox.create()
		Overlays = require('./twitch-overlay.js')
	})
	describe('constructor', function() {
		it('Starts with no options (all defaults)', function() {
			let overlays = new Overlays()

			let _hostname = 'localhost'
			let _port = 3000
			let _directory = '/'
			let _viewEngine = 'pug'

			// Verify defaults
			assert.notEqual(overlays.options, null)
			assert.equal(overlays.options.hostname, _hostname)
			assert.equal(overlays.options.port, _port)
			assert.equal(overlays.options.directory, _directory)
			assert.equal(overlays.options.viewEngine, _viewEngine)
			assert.notEqual(overlays.options.events, null)
		})

		it('Starts with all options (no defaults)', function() {
			let options = {
				hostname: 'test.com',
				port: 3500,
				directory: '/test',
				viewEngine: 'jade',
				events: eventbus
			}

			let overlays = new Overlays(options)

			let _hostname = 'test.com'
			let _port = 3500
			let _directory = '/test'
			let _viewEngine = 'jade'
			let _events = eventbus

			// Verify defaults
			assert.notEqual(overlays.options, null)
			assert.equal(overlays.options.hostname, _hostname)
			assert.equal(overlays.options.port, _port)
			assert.equal(overlays.options.directory, _directory)
			assert.equal(overlays.options.viewEngine, _viewEngine)
			assert.equal(typeof(overlays.options.events), typeof(_events))
		})
	})
	describe('add() - Load Overlays', function() {
		it('Loads a single overlay', function() {
			overlays = new Overlays({events: eventbus})

			let overlay = {
		    name: 'hpcwins',
		    type: 'video',
		    file: 'overlays/events/hpcwins.mp4'
			}

			let _overlay = {
				name: 'hpcwins',
				type: 'video',
				directory: 'overlays/events',
				video: '/hpcwins/hpcwins.mp4',
				volume: 1
			}

			let _payload = {
				video: 'hpcwins.mp4'
			}

			overlays.add(overlay)
			let list = overlays.list()

			assert.equal(list.length, 1)
			assert.equal(list[0].name, _overlay.name)
			assert.include(list[0].type, _overlay.type)
			assert.equal(list[0].selector, _overlay.selector)
			assert.equal(list[0].directory, _overlay.directory)
		})
		it('Loads an array of overlays', function() {
			overlays = new Overlays({events: eventbus})

			let overlay = [{
		    name: 'hpcwins',
		    type: 'video',
		    file: 'overlays/events/hpcwins.mp4'
			}, {
				name: 'hpctest',
				type: 'audio',
				directory: '/test'
			}]

			let _overlays = [{
				name: 'hpcwins',
				type: 'video',
				directory: 'overlays/events',
				video: '/hpcwins/hpcwins.mp4',
				layout: 'center',
				volume: 1
			}, {
				name: 'hpctest',
				layout: 'center',
				type: 'audio',
				directory: '/test'
			}]

			overlays.add(overlay)

			let list = overlays.list()

			assert.equal(list.length, 2)
			assert.deepEqual(list, _overlays)
		})
		it('No payload: Calls show with no payload', function() {
			overlays = new Overlays({events: eventbus})

			let overlay = {
				name: 'hpcwins',
				type: 'video',
				file: 'overlays/events/hpcwins.mp4'
			}

			// Add Overlay
			overlays.add(overlay)

			// Setup spy to monitor function
			let spy = sinon.spy(overlays, 'show')

			// Trigger event
			eventbus.emit('overlay:hpcwins:show')

			assert.isOk(spy.calledOnce)
		})
		it('Payload: Calls show with a payload', function() {
			overlays = new Overlays({events: eventbus})

			let overlay = {
				name: 'cupadd',
				type: 'video',
				file: 'overlays/events/hpcwins.mp4'
			}

			let _overlay = {
				name: 'cupadd',
				type: 'video',
				directory: 'overlays/events',
				video: '/cupadd/hpcwins.mp4',
				layout: 'center',
				volume: 1
			}

			let payload = "s 2"

			let _payload = "s 2"

			// Add Overlay
			overlays.add(overlay)

			// Setup spy to monitor function
			let spy = sinon.spy(overlays, 'show')

			// Trigger event
			eventbus.emit('overlay:cupadd:show', payload)

			assert.isOk(spy.calledOnce)
			assert.deepEqual(spy.getCall(0).args[0], _overlay)
			assert.equal(spy.getCall(0).args[1], _payload)
		})
		afterEach(function() {
			overlays.clear()
		})
	})
	describe('end() - Stops an overlay', function() {
		it('No payload: Ends a single overlay by id', function(done) {
			const overlay = {
				name: 'cupadd',
				type: 'video',
				file: 'overlays/events/hpcwins.mp4'
			}

			overlays.add(overlay)

			let list = overlays.list()

			let id = list[0].id

			eventbus.on('overlays:cupadd:end', function(payload) {
				assert.equal(payload, null)
				done()
			})

			overlays.end(id, overlay.name, null)
		})
		afterEach(function() {
			overlays.clear()
		})
	})
	afterEach(function() {
			sandbox.restore()
	})
})
