/* Test for html.js */

var path = require('path');
var assert = require('chai').assert;
var sinon = require('sinon');

let html

describe('html.js - HTML Overlay Module', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();
			html = require('./html.js')
	});
	it('Returns an overlay when given parameters', () => {
		const name = 'testOverlay'
		const view = './html_test.html'

		const _name = 'testOverlay'
		const _html = '<html>\n</html>\n'
		const _type = 'html'
		const _directory = '.'

		let overlay = new html(name, view)

		assert.equal(overlay.name, _name)
		assert.equal(overlay.html, _html)
		assert.equal(overlay.type, _type)
		assert.equal(overlay.directory, _directory)
	});
	it('Returns an static directory when provided', () => {
		const name = 'testOverlay'
		const view = './html_test.html'
		const static = '..'

		const _name = 'testOverlay'
		const _html = '<html>\n</html>\n'
		const _type = 'html'
		const _directory = '..'

		let overlay = new html(name, view, static)

		assert.equal(overlay.name, _name)
		assert.equal(overlay.html, _html)
		assert.equal(overlay.type, _type)
		assert.equal(overlay.directory, _directory)
	});
	it('Errors if no name is provided', () => {
		const view = './html_test.html'

		const _err = 'You must specify a name for this overlay'

		assert.throws(() => {
			let overlay = new html(null, view)
		}, _err)

	})
	it('Errors if no view is provided', () => {
		const name = 'testOverlay'

		const _err = "You must specify an .html view"

		assert.throws(() => {
			let overlay = new html(name, null)
		}, _err)
	})

	afterEach(function() {
	    sandbox.restore();
	});
});
