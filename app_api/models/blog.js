var mongoose = require('mongoose');

var blogschema = new mongoose.Schema({
    blogTitle: { type: String, required: true },
    blogText: { type: String, required: true },
    createdDate: {
	type: Date,
	"default": Date.now
    },
    name : { type: String },
    email: { type: String },
    comments: [{ type : String }]
});

mongoose.model('myblog' , blogschema);
