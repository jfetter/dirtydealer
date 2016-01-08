'use strict'

var express = require('express')
var router = express.Router();

var User = require('../models/User');

var jwt = require('jwt-simple');

router.get('/list', function(req, res){
  User.find({}, function(err, users) {
    res.status(err ? 400 : 200).send(err || users)
  })

})
router.get('/page/:username', function(req, res){
  User.findOne({'username' : req.params.username}, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  }).populate('favorites')
})
router.put('/favorite', function(req, res){
  console.log(req.body);
  User.findByIdAndUpdate(req.body.myId, {$push: {favorites : req.body.favoriteId}}, function(err, user) {
    // res.status(err ? 400 : 200).send(err || user)
    if(err){
      res.status(400).send(err);
    }
    User.findById(user._id, function(err, updatedUser){
      // res.status(err ? 400 : 200).send(err || user)
      if(err){
        res.status(400).send(err);
      }
      updatedUser.password = null
      var newToken = jwt.encode(updatedUser, process.env.JWT_SECRET)
      console.log("NEWTOEKN", newToken)
      res.cookie("token", newToken)
      res.send(newToken)
    })
  })
})


module.exports = router;