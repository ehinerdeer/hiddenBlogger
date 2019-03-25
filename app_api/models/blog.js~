var mongoose = require('mongoose');

var blogschema = new mongoose.Schema({
    blogTitle: String,
    blogText: String,
    createdDate: {
	type: Date,
	"default": Date.now
    }
});

mongoose.model('My Blog' , blogschema);
