/* server.js - Simple http server to serve overlays */

/* To add overlays:
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

var types = {
  text: require('../../twitch-overlay-text'),
  video: require('../../twitch-overlay-video'),
  html: require('../../twitch-overlay-html')
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

    // Start server
    var server = require('http').Server(app);
    var port = options.port;
    server.listen(port);
    console.log('[Overlay Server] listening on port ' + port);

    // Start Socket IO (event handler)
    io = require('socket.io')(server);

    io.on('connection', function (socket) {
        clients[socket.id] = [];

        // Add Overlay listener events
        overlays.forEach(function(overlay) {
            load(overlay, socket);
        });

        socket.on('disconnect', function() {
          // Clean up Overlay listener events on disconnect or reload to prevent memory leak
          unload(socket.id);
        });

        // HACK - Listen for winner of Quidditch match from client
        socket.on('quidditch:winner', function(data) {
          options.events.emit('quidditch:winner', data);
        });

    });
    //Debugging
    // setInterval(function() {
      // console.log('Active clients: ' + Object.keys(io.sockets.sockets).length);
      // console.log('Listening to POWERMOVE: ' + options.events.listeners('stream:powermove'));
      // console.log(clients);
    // }, 5000);
};

var add = function(_overlays) {
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
        break;
      case 'video':
        // Add trigger event and video file to 'overlays' so we can reference it
        overlay = new types.video(item.name, item.file);
        break;
      case 'html':
        overlay = new types.html(item.name, item.view, item.static);
        break;
    }

    overlays.push(overlay);      // Keep track of all of the overlays
    addRoute(overlay.template);  // Load template and static directory so it has a URL endpoint on the server
  });
}

var addRoute = function(template) {
  // Load template and video files on the server so you the browser can parse them
  app.get('/overlays/' + template.name, function(req, res, next) {
      try {
          res.render(template.view, { name: template.name });
      } catch (e) {
          next(e)
      }
  });

  // Add static assets (images, audio, etc) to server
  app.use('/' + template.name, express.static(template.directory));
  console.log(list());
}

var load = function(overlay, _socket) {
  var event = 'overlays:' + overlay.name + ':show';
  // Load overlay listener when socket comes online
  _socket.emit('load:template', overlay.template); // Tell browser to load the template

  var overlayEvent = function overlayEvent (payload) {
    // Some overlays (video) already have a payload
    if(overlay.payload) {
      if(payload) {
          Object.assign(payload, overlay.payload);  // Merge payloads
      } else {
        payload = overlay.payload;
      }
    }

    // Some overlays take a custom event
    io.emit('show:overlay', overlay.template, payload);
  }
  clients[_socket.id][event] = overlayEvent; // Keep track of overlay events so we can clear them on disconnect

  // Add listener for overlay event
  options.events.on(event, overlayEvent);
};

var unload = function(socketId) {
  // remove listeners for each overlay event to prevent them sticking around
  for (var key in clients[socketId]) {
    options.events.removeListener(key, clients[socketId][key]);
  }

  // Delete item from client object so it doesn't show up any more
  delete clients[socketId];
  // options.events.removeListener(overlay.event);
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
