/* Test for house.js */

var assert = require('chai').assert;
var sinon = require('sinon');

var EventEmitter = require('events');
var eventbus = new EventEmitter;	// Temporary event bus to prevent events firing across files

var Text;

describe('Text', function() {
	beforeEach(function() {
	    this.sinon = sandbox = sinon.sandbox.create();

		Text = require('..');
		Text.start(eventbus);
	});
	describe('Chat Triggers', function() {
		it('Contains settings for !text', function() {
			assert.notEqual(Text.triggers, null);
			assert.equal(Text.triggers[0].name, 'text');
			assert.equal(Text.triggers[0].type, 'whisper');
			assert.equal(Text.triggers[0].whitelist, true);
			assert.equal(Text.triggers[0].event, 'text:show');
		});
	});

	describe('Trigger Text overlay', function() {
		it('Sends a valid event to overlay server', function(done) {
			var _payload = {
				text_username: 'bdickason',
				text_text: 'testing 123.tts'
			};

			eventbus.once('stream:text', function(payload) {

				assert.deepEqual(payload, _payload);

				done();
			});

			eventbus.emit('text:show', 'bdickason', 'testing 123');
		});
	});
	afterEach(function() {
	    sandbox.restore();
	});
});
