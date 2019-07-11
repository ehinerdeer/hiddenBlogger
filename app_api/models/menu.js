var mongoose = require('mongoose');
var menu = new mongoose.Schema({
	category: {type: String, required: true},
	name: {type: String, required: true},
	price: {type: String, required: true},
	description: {type: String, required: false}
});

mongoose.model('menu', menu);