var express = require('express');
var router = express.Router();
var User = require('../models/User')
router.post('/', function(req, res){
  console.log(req.body)
  User.findByIdAndUpdate(req.body.userId, {$set : {avatar: req.body.image.base64}}, function(err, user){
    User.findById(req.body.userId, function(err, updatedUser){
      console.log(updatedUser)
    })
  })

})


module.exports = router;
