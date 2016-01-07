'use strict'

var express = require('express')
var router = express.Router();
var User = require('../models/User.js');

// router.get('/', function(req, res){
//   res.render('index');
// })

router.post('/', function(req, res){
  User.register(req.body, function(err, user){
    res.send(user)
  })
})


module.exports = router;
