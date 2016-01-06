var express = require('express');
var router = express.Router();
var User = require('../models/User')

router.post('/', function(req, res){
  User.login(req.body, function(user, err){
    console.log('user: ',user)
    res.send(user)
  })
})


module.exports = router;
