# twitch-overlay
Animated overlays for Twitch streamers that can be loaded into OBS or XSplit

# Usage

## Commands
`!sortinghat` - Place the sorting hat on your head and find out what House you belong to
`!rules` - 

## Installation

1. Include the module in your codebase: `var Overlays = require('twitch-overlay');`
1. Define any optional settings `var options = {};` (see **Config** below)
1. Start the overlay server: `Overlays.start(options);`

## Config

    var options = {
        hostname: 'localhost',                      // Binds server to this host (optional)
        port: 3000,                                 // Binds server to this port
        directory: '/',                             // URL you want to point OBS/Xsplit at (optional, default: '/')
        viewEngine: 'pug',                          // Templating system you'd like to use (Express-compatible) (optional: defaults to pug) */
        events: new Events.EventEmitter()           // Listens to events to trigger overlays
    };

## Adding Overlays
See an example here: https://github.com/bdickason/hpc-bot

## Modules
* [text](https://github.com/bdickason/twitch-overlay-text) - Text-to-Speech overlay to say anything aloud on your stream
* [video](https://github.com/bdickason/twitch-overlay-video) - Video overlay to play a video clip on your stream

## Running Tests

You can run tests to verify that everything is working with the command `npm test`. This requires **mocha** to be installed with `npm install -g mocha`.

If you plan to submit pull requests, please ensure that the request includes proper test coverage of your feature.


