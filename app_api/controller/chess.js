var mongoose = require('mongoose');
var chessSch = mongoose.model('board');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.pieceList = function(req, res) {
    console.log('Getting piece list');
    chessSch
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
            sendJsonResponse(res, 200, buildPieceList(req, res, results));
			    });
};

var buildPieceList = function(req, res, results) {
    var pieces = [];
    results.forEach(function (obj) {

	pieces.push({
		pieceid: obj._id,
	    name: obj.name,
	    piece: obj.piece
	});
    });
    return pieces;
};

module.exports.addOne = function(req, res) {
    console.log(req.body);
    chessSch
	.create({
	    name: req.body.name,
	    piece: req.body.piece
	},
	    function(err, piece) {
		if(err) {
		    console.log(err);
		    sendJsonResponse(res,400,err);
		} else {
		    console.log(piece);
		    sendJsonResponse(res,201,piece);
		}
	    });
	       
};

module.exports.readOne = function(req, res) {
    console.log('Finding blogs', req.params);
if(req.params && req.params.pieceid){
    chessSch
	.findById(req.params.pieceid)
	.exec(function(err, piece) {
	    if(!piece){
		sendJsonResponse(res, 404, {
		    "message": "pieceid not found"
		});
		return;
	    }else if(err) {
		console.log(err);
		sendJsonResponse (res, 404, err);
		return;
	    }
	    console.log(piece);
	    sendJsonResponse(res, 200, piece);
	});
} else {
    console.log('No pieceid in request');
    sendJsonResponse(res, 404, { "message" : "No pieceid in request" });
}
};

module.exports.editOne = function(req, res) {
    console.log("Updating Piece Position : " + req.params.pieceid);
    console.log(req.body);
    chessSch
	.findOneAndUpdate(
	    { _id: req.params.pieceid },
	    { $set: {"name" : req.body.name, "piece" : req.body.piece }},
	
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
    console.log("Deleting piece with id : " + req.params.pieceid);
    console.log(req.body);
    chessSch
        .findByIdAndRemove(req.params.pieceid)
	.exec(
	    function(err, response) {
		if(err) {
		    sendJsonResponse(res, 404, err);
		} else {
		    sendJsonResponse(res, 204, null);
		}
	    });
};
