'use strict'

var express = require('express')
var router = express.Router();

app.post('/', function(req, res){
  User.register(req.body, function(err, user){
    res.send(user)
  }
})


module.exports = router;
