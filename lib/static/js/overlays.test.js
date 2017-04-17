/* overlays.spec.js - client-side Tests for Twitch Overlays  */

casper.test.begin('Twitch Chat Overlay', 7, function (test) {
    // Connect to server
    casper.start('http://localhost:3000', function () {
        // Sortinghat Overlay
        casper.waitForSelector('.sortinghat', function() {
            // Is .sortinghat rendered on page properly?
			test.assertExists('.sortinghat');

            // overlay should be hidden by default
            var overlay = casper.getElementInfo('.sortinghat');
            test.assertEqual(overlay.visible, false);
            test.assertExists('#house_logo');
            test.assertExists('#username');
            test.assertExists('#house_text');
            test.assertExists('#player');
            test.assertExists('#house_audio');
		});
    });

    // casper.then(function () {
    //     casper.log(io());
    // });

    casper.run(function() {
        test.done();
    });
});