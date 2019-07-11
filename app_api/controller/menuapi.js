var mongoose = require('mongoose');
var moment = require('moment');
var menuSch = mongoose.model('menu');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.menuList = function(req, res) {
    console.log('Getting menu list');
    menuSch
	.find()
	.exec(function(err, results) {
	    if(!results) {
		sendJsonResponse(res, 404 , {
		    "message" : "No menu items found"
		});
		return;
	    }else if(err) {
		console.log(err);
		sendJsonResponse(res, 404, err);
		return;
	    }
	    console.log(results);
            sendJsonResponse(res, 200, buildMenuList(req, res, results));
			    });
};

var buildMenuList = function(req, res, results) {
    var menu = [];
    results.forEach(function (obj) {
	var date = moment(obj.createdDate).format('MM-DD-YYYY, LT')
	menu.push({
	    id : obj._id,
	    category : obj.category,
	    name : obj.name,
	    price : price,
	    description: obj.description
	});
    });
    return menu;
};

module.exports.addOne = function(req, res) {
    console.log(req.body);
    menuSch
	.create({
	    category: req.body.category,
	    name: req.body.name,
	    price: req.body.price,
	    description : req.body.description
	},
	    function(err, menu) {
		if(err) {
		    console.log(err);
		    sendJsonResponse(res,400,err);
		} else {
		    console.log(menu);
		    sendJsonResponse(res,201,blog);
		}
	    });
	       
};

module.exports.readOne = function(req, res) {
    console.log('Finding menu item: ', req.params);
if(req.params && req.params.id){
    menuSch
	.findById(req.params.id)
	.exec(function(err, menu) {
	    if(!menu){
		sendJsonResponse(res, 404, {
		    "message": "id not found"
		});
		return;
	    }else if(err) {
		console.log(err);
		sendJsonResponse (res, 404, err);
		return;
	    }
	    console.log(menu);
	    sendJsonResponse(res, 200, menu);
	});
} else {
    console.log('No menu id in request');
    sendJsonResponse(res, 404, { "message" : "No menu id in request" });
}
};

module.exports.editOne = function(req, res) {
    console.log("Updating Menu Item : " + req.params.id);
    console.log(req.body);
    menuSch
	.findOneAndUpdate(
	    { _id: req.params.id },
	    { $set: {"category" : req.body.category ,"name" : req.body.name, "price" : req.body.price, "description" : req.body.description }},
	
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
    console.log("Deleting menu entry id : " + req.params.id);
    console.log(req.body);
    menuSch
        .findByIdAndRemove(req.params.id)
	.exec(
	    function(err, response) {
		if(err) {
		    sendJsonResponse(res, 404, err);
		} else {
		    sendJsonResponse(res, 204, null);
		}
	    });
};
