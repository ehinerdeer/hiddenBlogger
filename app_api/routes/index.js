var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 
var auth = jwt({ 
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlBlog = require('../controller/blog');
var ctrlAuth = require('../controller/authentication');
var ctrlMenu = require('../controller/menuapi');

router.get('/blog', ctrlBlog.blogList);
router.post('/blog', auth, ctrlBlog.addOne);
router.get('/blog/:blogid', ctrlBlog.readOne);
router.put('/blog/:blogid', auth, ctrlBlog.editOne);
router.delete('/blog/:blogid', auth, ctrlBlog.deleteOne);

router.get('/menu', ctrlMenu.menuList);
router.post('/menu', auth, ctrlMenu.addOne);
router.get('/menu/:id', ctrlMenu.readOne);
router.put('/menu/:id', auth, ctrlMenu.editOne);
router.delete('/menu/:id', auth, ctrlMenu.deleteOne);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);



module.exports = router;
