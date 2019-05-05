var mongoose = require('mongoose');
var shutdown;

var dbURI = 'mongodb://blog:blog@localhost:27017/blog';
mongoose.connect(dbURI, { useNewUrlParser: true });

//Connection Checks
mongoose.connection.on('connected', function() {
    console.log('Mongoose is Connected to ' + dbURI);
});
mongoose.connection.on('error' , function() {
    console.log('Mongoose Connection Error: ' + err);
});
mongoose.connection.on('disconnected', function(){
    console.log('Mongoose is Disconnected');
});

//Capture APP Termination
shutdown = function(msg , callback) {
    mongoose.connection.close(function() {
	console.log('Mongoose Disconnected by ' + msg);
	callback();
    });
};

//Nodemon restarts
process.once('SIGUSR2' , function() {
    shutdown('nodeom restart' , function() {
	process.exit(0);
    });
});
//App termination
process.on('SIGINT' , function() {
    shutdown('app termination' , function() {
	process.exit(0);
    });
});

//Heroku
process.on('SIGTERM', function() {
    shutdown('Heroku Shutdown' , function() {
	process.exit(0);
    });
});

//Bring in Schema
require('./users');
require('./chess');
