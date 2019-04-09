var mongoose = require('mongoose');
var blogSch = mongoose.model('myblog');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.blogList = function(req, res) {
    console.log('Getting blog list');
    blogSch
	.find()
	.exec(function(err, results) {
	    if(!results) {
		sendJsonResponse(res, 404 , {
		    "message" : "No blogs found!"
		});
		return;
	    }else if(err) {
		console.log(err);
		sendJsonResponse(res, 404, err);
		return;
	    }
	    console.log(results);
            sendJsonResponse(res, 200, buildBlogList(req, res, results));
			    });
};

var buildBlogList = function(req, res, results) {
    var blogs = [];
    results.forEach(function (obj) {
	blogs.push({
	    blogid : obj._id,
	    blogTitle : obj.blogTitle,
	    blogText : obj.blogText,
	    createdDate : obj.createdDate,
	    name: obj.name,
	    email: obj.email
	});
    });
    return blogs;
};

module.exports.addOne = function(req, res) {
    console.log(req.body);
    blogSch
	.create({
	    blogTitle: req.body.blogTitle,
	    blogText: req.body.blogText,
	    name: req.body.name,
	    email : req.body.email
	},
	    function(err, blog) {
		if(err) {
		    console.log(err);
		    sendJsonResponse(res,400,err);
		} else {
		    console.log(blog);
		    sendJsonResponse(res,201,blog);
		}
	    });
	       
};

module.exports.readOne = function(req, res) {
    console.log('Finding blogs', req.params);
if(req.params && req.params.blogid){
    blogSch
	.findById(req.params.blogid)
	.exec(function(err, blog) {
	    if(!blog){
		sendJsonResponse(res, 404, {
		    "message": "blogid not found"
		});
		return;
	    }else if(err) {
		console.log(err);
		sendJsonResponse (res, 404, err);
		return;
	    }
	    console.log(blog);
	    sendJsonResponse(res, 200, blog);
	});
} else {
    console.log('No blogid in request');
    sendJsonResponse(res, 404, { "message" : "No blogid in request" });
}
};

module.exports.editOne = function(req, res) {
    console.log("Updating Blog Entry : " + req.params.blogid);
    console.log(req.body);
    blogSch
	.findOneAndUpdate(
	    { _id: req.params.blogid },
	    { $set: {"blogTitle" : req.body.blogTitle ,"blogText" : req.body.blogText }},
	
	    function(err, response) {
		if(err) {
		    sendJsonResponse(res, 400, err);
		} else {
		    sendJsonResponse(res, 201, response);
		}
	    }
	);
};

module.exports.deleteOne = function(req, res) {
    console.log("Deleting blog entry id : " + req.params.blogid);
    console.log(req.body);
    blogSch
        .findByIdAndRemove(req.params.blogid)
	.exec(
	    function(err, response) {
		if(err) {
		    sendJsonResponse(res, 404, err);
		} else {
		    sendJsonResponse(res, 204, null);
		}
	    });
};
