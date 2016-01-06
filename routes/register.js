'use strict'

var express = require('express')
var router = express.Router();
var User = require('../models/User.js');

router.get('/', function(req, res){
  res.render('index');
})

router.post('/', function(req, res){
  console.log(req)
  console.log("req body", req.body)
  User.register(req.body, function(err, user){
    res.send(user)
  })
})


module.exports = router;
