var mongoose = require('mongoose');

var chessSch = new mongoose.Schema({
	name: { type: String }
});

mongoose.model('chess', chessSch);