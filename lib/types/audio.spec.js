/* Test for audio.js */

var path = require('path');
var assert = require('chai').assert;
var sinon = require('sinon');

let audio

describe('audio.js - Audio Overlay Module', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();
			audio = require('./audio.js')
	});
	it('Returns an overlay when given parameters', () => {
		const name = 'testOverlay'
		const directory = './test'

		const _name = 'testOverlay'
		const _directory = './test'
		const _type = 'audio'

		let overlay = new audio(name, directory)

		assert.equal(overlay.name, _name)
		assert.equal(overlay.directory, _directory)
		assert.equal(overlay.type, _type)
	});
	it('Errors if no name is provided', () => {
		const directory = './test'

		assert.throws(() => {
			let overlay = new audio(name, directory)
		}, 'name is not defined')
	})
	afterEach(function() {
	    sandbox.restore();
	});
});
