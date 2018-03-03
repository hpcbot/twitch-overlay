# twitch-overlay
Animated overlays for Twitch streamers that can be loaded into OBS or XSplit

This library will add an express-based server that listens for events (via a simple EventEmitter) and plays overlays when it receives an event. You can load the default URL '/' into your OBS/Xsplit client which will render overlays with a transparent background.

You can pair this with lots of other modules such as [hpc-bot](https://github.com/bdickason/hpc-bot) to integrate with a chat bot or [twitch-soundboard]() to play overlays manually via your browser.

# Installation

1. Include the module in your codebase: `var Overlays = require('twitch-overlay');`
1. Define any optional settings `var options = {};` (see **Config** below)
1. Start the overlay server: `overlays = new Overlays(options);`

## Config

The `constructor()` function accepts the following optional parameters via a single json object:
````
    var options = {
        hostname: 'localhost',                      // Binds server to this host (optional)
        port: 3000,                                 // Binds server to this port
        directory: '/',                             // URL you want to point OBS/Xsplit at (optional, default: '/')
        events: new Events.EventEmitter()           // Listens to events to trigger overlays
    };
````

# Usage

## Types of Overlays

First, you should decide what type of overlay you want to display on your stream. The basic types are `text`, `video`, or `html` (see 'Modules' below for more details). The easier overlay to get started with is video which just takes a single mp4 file and a name as a parameter.

## Adding Overlays `add()` or event: `overlays:add`

To add an overlay, you need to pass a json object (or array of objects) with the following parameters:

**Example video overlay:**
````
var overlay = {
  name: 'butterbeer',
  type: 'video',
  file: 'events/beer.mp4''
}
overlays.add(overlay);

events.emit('overlay:butterbeer:show');
````

**Example text overlay**
````
var overlay = {
  name: 'text',
  type: 'text'
}
overlays.add(overlay);

events.emit('overlay:text:show', 'text to say goes here!');
````

**Example html overlay:**
````
var overlay = {
  name: 'quidditch',
  type: 'html',
  view: './views/quidditch.html',
  static: './js/'
}
overlays.add(overlay);

events.emit('overlay:quidditch:show');
````

Overlays will be added to an array and stored with a set of event listeners (See below: Firing Overlays). Each type has an associated React client-side template that is rendered when you want to display the overlay. The overlay server maintains a persistent state variable that is passed to react which keeps track of what is on screen and off screen at any given time.

See a fully functional example here: https://github.com/bdickason/dumbledore

## Firing Overlays `show()` or `overlays:name:show`

When an overlay is added to the server, it automatically has an event listener created in the format: `overlay:(name):show` where (name) is the name of the overlay that you passed in.

To trigger an overlay, just emit this event to the EventEmitter you passed in and the overlay will play on the server. Most overlays end automatically when they complete (i.e. video) but some such as html events do not have a fixed endpoint and listen for custom events from the client. If you have a custom event, use `io.socket.emit('endOverlay', null, (name), (payload))` where (name) is the name of your overlay and (payload) is any additional data you want to pass along. When the server retrieves this, it will relay the event to your EventEmitter in the format: `overlay:(name):end(payload)` so you can listen for this and act accordinly.

## Hiding Overlays `hide()` or `overlays:name:hide`

If you want to manually hide an overlay rather than waiting for it to complete, you can issue the hide() command.


## Displaying Overlays on your Stream (Adding to OBS/Xsplit)

In order for overlays to display in your OBS or Xsplit client, you need to do the following:

**OBS**
1. Click the '+' under Sources
2. Add a BrowserSource
3. Point it at http://(yourhostname):(yourport)/(yourdirectory). The default is http://localhost:3000
4. Adjust the width/height to be 16:9
5. Click 'Ok' to Save

After you've added the source (and made sure it's visible and on top of your stream), you should start seeing overlays show up. They show up with a transparent background so you won't see anything visible until you start triggering overlays.

## Running Tests

You can run tests to verify that everything is working with the command `npm test`. This requires **mocha** to be installed with `npm install -g mocha`.

If you plan to submit pull requests, please ensure that the request includes proper test coverage of your feature.
