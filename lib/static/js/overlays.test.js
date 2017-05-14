/* overlays.spec.js - client-side Tests for Twitch Overlays  */
casper.test.begin('Twitch Chat Overlay', 7, function(test) {
  // Connect to server
  casper.start('http://localhost:3000', function() {
    // Sortinghat Overlay
    casper.waitForSelector('.sortinghat', function() {
      // casper.log('test');
      // Is .sortinghat rendered on page properly?
      test.assertExists('.sortinghat');

      // overlay should be hidden by default
      var overlay = casper.getElementInfo('.sortinghat');
      test.assertEqual(overlay.visible, false);
      test.assertExists('#house_logo');
      test.assertExists('#username');
      test.assertExists('#house_text');
      test.assertExists('#house_audio');
      test.assertExists('#house_audio_player');
    });
  });

  casper.run(function() {
    test.done();
  });

  // Debugging
  casper.on("remote.message", function(msg) {
      this.echo("Console: " + msg);
  });

  // http://docs.casperjs.org/en/latest/events-filters.html#page-error
  casper.on("page.error", function(msg, trace) {
      this.echo("Error: " + msg);
      // maybe make it a little fancier with the code from the PhantomJS equivalent
  });

  // http://docs.casperjs.org/en/latest/events-filters.html#resource-error
  casper.on("resource.error", function(resourceError) {
      this.echo("ResourceError: " + JSON.stringify(resourceError, undefined, 4));
  });

  // http://docs.casperjs.org/en/latest/events-filters.html#page-initialized
  casper.on("page.initialized", function(page) {
      // CasperJS doesn't provide `onResourceTimeout`, so it must be set through
      // the PhantomJS means. This is only possible when the page is initialized
      page.onResourceTimeout = function(request) {
          console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
      };
  });
  
});
