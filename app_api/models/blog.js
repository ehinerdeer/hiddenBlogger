var mongoose = require('mongoose');

var blogschema = new mongoose.Schema({
    blogTitle: { type: String, required: true },
    blogText: { type: String, required: true },
    createdDate: {
	type: Date,
	"default": Date.now
    }
});

mongoose.model('myblog' , blogschema);
