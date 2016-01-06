var express = require('express');
var router = express.Router();
var User = require('../models/User')
var jwt = require('jwt-simple')


router.post('/', function(req, res){
  User.login(req.body, function(err, user){
    console.log('user: ',user)
    token = jwt.encode(user, process.env.JWT_SECRET);
    res.cookie("token", token )
    res.send('login succesfull')
  })
})


module.exports = router;
