var express = require('express');
var router = express.Router();
var User = require('../models/User')
var jwt = require('jwt-simple')


router.post('/', function(req, res){
  User.login(req.body, function(err, user){

    console.log('user: ',user)
    if(user){
      token = jwt.encode(user, process.env.JWT_SECRET);
      res.cookie('token', token);
      res.send('login succesfull')
    } else{
      alert("incorrect username or password")
      res.send('incorrect username or password')
    }
  })
})


module.exports = router;
