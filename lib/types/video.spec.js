/* Test for video.js */

var assert = require('chai').assert;
var sinon = require('sinon');

let video

describe('video.js - video Overlay Module', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();
			video = require('./video.js')
	});
	it('Returns an overlay when given parameters', () => {
		const name = 'testOverlay'
		const file = './video_test.mp4'

		const _name = 'testOverlay'
		const _video = '/testOverlay/video_test.mp4'
		const _type = 'video'
		const _directory = '.'
		const _volume = 1.0

		let overlay = new video(name, file)

		assert.equal(overlay.name, _name)
		assert.equal(overlay.video, _video)
		assert.equal(overlay.type, _type)
		assert.equal(overlay.directory, _directory)
		assert.equal(overlay.volume, _volume)
	});
	it('Returns a volume when provided', () => {
		const name = 'testOverlay'
		const file = './video_test.mp4'
		const volume = 0.3

		const _name = 'testOverlay'
		const _video = '/testOverlay/video_test.mp4'
		const _type = 'video'
		const _directory = '.'
		const _volume = 0.3

		let overlay = new video(name, file, volume)

		assert.equal(overlay.name, _name)
		assert.equal(overlay.video, _video)
		assert.equal(overlay.type, _type)
		assert.equal(overlay.directory, _directory)
		assert.equal(overlay.volume, _volume)
	});
	it('Errors if no name is provided', () => {
		const videoInput = './video_test.video'

		const _err = 'You must specify a name for this overlay'

		assert.throws(() => {
			let overlay = new video(null, videoInput)
		}, _err)

	})
	it('Errors if no view is provided', () => {
		const name = 'testOverlay'

		const _err = "You must specify a Video URL"

		assert.throws(() => {
			let overlay = new video(name, null)
		}, _err)
	})

	afterEach(function() {
	    sandbox.restore();
	});
});
