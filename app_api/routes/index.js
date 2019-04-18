var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 
var auth = jwt({ 
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlBlog = require('../controller/blog');
var ctrlAuth = require('../controller/authentication');
var ctrlChess = require('../controller/chess');

router.get('/blog', ctrlBlog.blogList);
router.post('/blog', auth, ctrlBlog.addOne);
router.get('/blog/:blogid', ctrlBlog.readOne);
router.put('/blog/:blogid', auth, ctrlBlog.editOne);
router.delete('/blog/:blogid', auth, ctrlBlog.deleteOne);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/chess', ctrlChess.pieceList);
router.post('/chess', ctrlChess.addOne);
router.get('/chess/:pieceid', ctrlChess.readOne);
router.put('/chess/:pieceid', ctrlChess.editOne);
router.delete('/chess/:pieceid', ctrlChess.deleteOne);

module.exports = router;
