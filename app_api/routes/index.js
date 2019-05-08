var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 
var auth = jwt({ 
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var ctrlAuth = require('../controller/authentication');
var ctrlChess = require('../controller/chess');

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/chess', ctrlChess.pieceList);
router.post('/chess', ctrlChess.addOne);
router.get('/chess/:pieceid', ctrlChess.readOne);
router.put('/chess', ctrlChess.editOne);
router.delete('/chess', ctrlChess.deleteOne);

module.exports = router;