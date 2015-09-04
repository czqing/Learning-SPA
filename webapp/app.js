/*
 * app.js - Express server
 */

//Module scope variables
'use strict';
var
  http = require('http'),
  express = require('express'),
  routes = require('./lib/routes'),
  app = express(),
  server = http.createServer( app );

//Server configuration
app.configure( function() {
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( express.static( __dirname + '/public' ) );
  app.use( app.router );
});

app.configure( 'development', function() {
  app.use( express.logger() );
  app.use( express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }) );
});

app.configure( 'production', function() {
  app.use( express.errorHandler() );
});

routes.configRoutes( app, server );

//Start server
server.listen( 3000 );
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
);

