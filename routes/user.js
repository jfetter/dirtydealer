'use strict'

var express = require('express')
var router = express.Router();

var User = require('../models/User');

var jwt = require('jwt-simple');

router.get('/page/:username', function(req, res){
  User.findOne({'username' : req.params.username}, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  })
})

router.post("/edit", function(req, res){
  console.log("edit api", req.body)
  User.findByIdAndUpdate(req.body._id, {$set: {
    username: req.body.username,
  }
}, function(err, savedUser){
  console.log('user that got changed during the edit api function...savedUser', savedUser)
  User.findById(req.body._id, function(err, updatedUser){
    console.log("comes back from findbyId of svedUser",updatedUser);
    updatedUser.password = null;
    updatedUser.avatar = null
    if (!req.body.isAdmin){
      res.cookie("token", jwt.encode(updatedUser, process.env.JWT_SECRET));
    }
    res.send(updatedUser);
  })
})
})

// dirty deals win points 
router.post('/dirtyWin', function(req, res){
  var userId = req.body.userId;
  User.findById( userId, function(err, user) {
    if (err) { res.send(err);
   } else {
      var newPoints = user.ddWins + 1;
      console.log("NEW GAME POINTS", newPoints)
      User.findByIdAndUpdate(userId, { 
        $set:{ ddWins: newPoints }
      }, function(err, updatedUser){
          if (err){res.send(err);
          } else { 
            res.send( "game points updated");
            }
          })
         //end Find By Id and update 
      } //end else find by ID 
    })
}) //end post to dd wins

module.exports = router;
