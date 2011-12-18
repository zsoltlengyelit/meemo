
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Error handling
process.on('uncaughtException', function(err){
  console.log('Main error: ' + err);
  console.trace();
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  
  app.set('db-uri', 'mongodb://localhost/meemo');
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.listen(3000);


/*
 * webSocket
 */
require('./websocket').start(app); // start

 
 
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
