/* Test for text.js */

var assert = require('chai').assert;
var sinon = require('sinon');

let text

describe('text.js - HTML Overlay Module', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();
			text = require('./text.js')
	});
	it('Returns an overlay when given parameters', () => {
		const input = 'whatever'

		const _name = 'text'
		const _type = 'text'
		const _text = 'whatever'
		const _directory = '.'

		let overlay = new text(text)

		assert.equal(overlay.name, _name)
		assert.equal(overlay.text, text)
		assert.equal(overlay.type, _type)
		assert.equal(overlay.directory, _directory)
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
