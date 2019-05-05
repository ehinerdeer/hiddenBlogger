var mongoose = require('mongoose');

var chessSch = new mongoose.Schema({
	name: { type: String },
	piece: { type: String }
});

mongoose.model('board', chessSch);