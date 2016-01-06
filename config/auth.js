'use strict';

var User = require('../models/user');

var jwt = require('jwt-simple');

module.exports = function(req, res, next){
  if (req.cookies.token){
    var token = req.cookies.token
    var decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    console.log(decodedToken)
    var userId = decodedToken._id;
    console.log(userId)
    User.findById(userId, function(err, user){
      if(err || !user) return res.status(401).send(err || 'Authentication required.');
      next();
    });
  } else {return res.status(401).send('User Authentication Required!')}
};
