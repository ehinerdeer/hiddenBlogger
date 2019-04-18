var mongoose = require('mongoose');

var chessSch = new mongoose.Schema({
	name: { type: String },
	color: { type: String },
	boardPos: [{ 
			x: { type: Number },
			y: { type: Number } }]
});

mongoose.model('chess', chessSch);