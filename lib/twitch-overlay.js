/* server.js - Simple http server to serve overlays */

var express = require('express');
var Events = require('events');
var path = require('path');
var extend = require('extend');

var app = express();    // Express should be accessible from all functions

// config variables w/ default values
var options = {
    hostname: 'localhost',                      // Binds server to this host (optional)
    port: 3000,                                 // Binds server to this port
    directory: '/',                             // URL you want to point OBS/Xsplit at (optional, default: '/')
    viewEngine: 'pug',                          // Templating system you'd like to use (Express-compatible) (optional: defaults to pug) */
    events: new Events.EventEmitter()           // Listens to events to trigger overlays
};

var socket;
var overlays = [];  // List of overlays that have been loaded

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
    console.log('Listening on port ' + port);

    // Start Socket IO (event handler)
    var io = require('socket.io')(server);

    io.on('connection', function (_socket) {
        socket = _socket;    // store active socket
        
        // Load Overlay listener events
        overlays.forEach(function(overlay) {
            console.log('loading ' + overlay.name);
            load(overlay);
        }); 
    });
};

var add = function(overlay) {
    // Add overlay to Express so we can accept browser calls

    // Add overlay to queue when socket loads (for each user)
    overlays.push(overlay);

    
    // Add route to grab overlay template (will be called via clientside ajax)
    app.get('/overlays/' + overlay.name, function(req, res, next) {
        try {
            res.render(overlay.view);
        } catch (e) {
            next(e)
        }
    });

    // Add static assets (images, audio, etc) to server
    app.use('/' + overlay.name, express.static(overlay.directory + '/static'));
};

var load = function(overlay) {   
    // Load overlay listener when socket comes online
    socket.emit('load:template', overlay);

    // Add listener for overlay event
    options.events.on(overlay.event, function(payload) {
        socket.emit('show:overlay', overlay, payload);
    });   
};

module.exports = {
    start: start,
    add: add,
    options: options    // Expose options - useful for testing
};
