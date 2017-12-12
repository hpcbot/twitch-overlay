/* twitch-overlay.js - Simple http server to serve overlays */

/* To add overlay:
    var video = {
      name: 'hpcwins',
      type: 'video',
      file: 'videos/events/hpcwins.mp4'
    };
    bot.overlays.add(); */

var express = require('express');
var Events = require('events');
var path = require('path');
var extend = require('extend');
var shortid = require('shortid'); // Generate short unique identifiers

var types = {
  text: require('twitch-overlay-text'),
  // text: require('../../twitch-overlay-text'),     // When developing
  video: require('twitch-overlay-video'),
  // video: require('../../twitch-overlay-video'),   // When developing
  html: require('twitch-overlay-html')
  // html: require('../../twitch-overlay-html')      // When developing
};

var app = express();    // Express should be accessible from all functions

// config variables w/ default values
var options = {
    hostname: 'localhost',                      // Binds server to this host (optional)
    port: 3000,                                 // Binds server to this port
    directory: '/',                             // URL you want to point OBS/Xsplit at (optional, default: '/')
    viewEngine: 'pug',                          // Templating system you'd like to use (Express-compatible) (optional: defaults to pug) */
    events: new Events.EventEmitter()           // Listens to events to trigger overlays
};

// var socket;
var io;
var overlays = [];  // List of overlays that have been loaded
var clients = {};   // List of clients that are connected (for cleaning events)

let state = {
  overlays: []
};     // Persistent state for the app

var start = function start(_options) {
    // Options for starting the overlay server:
    options = extend(options, _options);    // Copy _options into options, overwriting defaults

    /* Start webapp */
    app.use(express.static(path.join(__dirname, 'static')));
    app.set('views', path.join(__dirname, 'views'));
    app.locals.basedir = app.get('views');
    app.set('view engine', options.viewEngine);

    app.get(options.directory, function (req, res, next) {
      try {
        res.render('index');
      } catch (e) {
        next(e)
      }
    });

    options.events.on('overlays:add', add);

    // Start server
    var server = require('http').Server(app);
    var port = options.port;
    server.listen(port);
    console.log('[Overlay Server] listening on port ' + port);

    // Start Socket IO (event handler)
    io = require('socket.io')(server);

    io.on('connection', function (socket) {
        clients[socket.id] = [];

        socket.on('disconnect', function() {
          // Clean up Overlay listener events on disconnect or reload to prevent memory leak
          unload(socket.id);
        });

        socket.on('endOverlay', end);

        // HACK - Listen for winner of Quidditch match from client
        socket.on('quidditch:winner', function(data) {
          options.events.emit('quidditch:winner', data);
        });

        update(); // send latest state down to the client
    });

    /* Create initial state when server starts */
    update();

};

var add = function(_overlays) {
  console.log(_overlays);
  // Add overlay(s) to display them on stream.
  // Expects an Object or array of Objects w/ the following structure:
  //    name: 'powermove',            // String that will activate this in chat/events i.e. !powermove and powermove:show
  //    type: 'text',                 // (text, video, html)
  //    file: '../blah.mp4'           // (optional) Filename for video w/ path
  //    text: 'Blah has subscribed!'  // (optional) Text to display/read
  //    static: '../static/blah'      // (optional) directory containing images, etc to serve via webserver
  //    view:   '../test.pug'         // (optional) pug template to inject instead of the default

  var queue = []; // Overlays to be processed

  if(Array.isArray(_overlays)) {
    // Process multiple overlays
    queue = _overlays;
  } else {
    queue.push(_overlays);
  }

  // Loop through each overlay and load it into our overlays array
  queue.forEach(function(item) {
    var overlay;
    var template;

    switch(item.type) {
      case 'text':
        overlay = new types.text();
        break;
      case 'video':
        // Add trigger event and video file to 'overlays' so we can reference it
        overlay = new types.video(item.name, item.file);
        break;
      case 'html':
        overlay = new types.html(item.name, item.view, item.static);
        break;
    }

    overlay.type = item.type;    // Pass template down to client

    overlays.push(overlay);      // Keep track of all of the overlays

    if(overlay.directory) {
      // Add static assets (images, audio, etc) to server
      app.use('/' + overlay.name, express.static(overlay.directory));
    }

    options.events.on('overlay:' + overlay.name + ':show', function(payload) {
      show(overlay, payload)});
    update();                    // Send the new state to the client
  });
}

var update = function() {
  // Called any time we update the state on the server

  io.sockets.emit('overlays:state', state);  // Send an update to all connected clients
}

var show = function(overlay, payload) {
  var _overlay = {
    id: shortid.generate(),
    name: overlay.name,
    type: overlay.type,
    payload: overlay.payload
  };

  if(payload) {
    _overlay.payload = payload;
  }

  if(overlay.html) {
    _overlay.html = overlay.html;
  }

  // Set overlay to 'showing'
  state.overlays.push(_overlay);
  console.log(state.overlays);

  update();
}

var end = function(id, name, payload) {
  // Overlay ended, remove it from visible state
  state.overlays.forEach(function(overlay, index) {
    if(overlay.id == id) {
      state.overlays.splice(index, 1);
      update();
    } else if (overlay.name == name) {
      state.overlays.splice(index, 1);

      // Trigger custom event
      options.events.emit('overlays:' + name + ':end', payload);
      update();
    }
  });
}

var unload = function(socketId) {
  // remove listeners for each overlay event to prevent them sticking around
  for (var key in clients[socketId]) {
    options.events.removeListener(key, clients[socketId][key]);
  }

  // Delete item from client object so it doesn't show up any more
  delete clients[socketId];

  if(Object.keys(clients).length === 0 && clients.constructor === Object) {
    overlays = [];  // Empty the overlays queue if no clients are connected
  }
};

var list = function() {
  // Returns the currently loaded overlays
  return(overlays);
}

var clear = function() {
  overlays = [];
}

module.exports = {
    start: start,
    add: add,
    list: list,
    clear: clear,
    options: options    // Expose options - useful for testing
};
