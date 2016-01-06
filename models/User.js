'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');

var User;

var userSchema = Schema({
	email:{type: String, required: true, unique: true},
  username: { type: String, required: true, unique: true},
	name: {type: String, required: true},
  password: { type: String, required: true },
	phone: {type: Number},
	address: {type: String},
	avatar: {type: String, data:Buffer},
	favorites: [{type: Schema.Types.ObjectId, ref: "User"}],
	isAdmin: {type: Boolean, default: false}
});


userSchema.statics.register = function(user, cb){
  var username = user.username;
  var email = user.email;
  var name = user.name;
  var password = jwt.encode(user.password, process.env.JWT_SECRET);
  User.find({$or: [{username: username}, {email: email}] }, function(err, user){
    if (err){return console.log(err)}
    console.log(user);
  })


}


userSchema.statics.login = function(user, cb){
	var username = user.username;
	var password = user.password;


	User.find({$or: [{username: username}, {email: username}]}, function(err, userReturned){
		console.log('userReturned', userReturned);
		if(userReturned.length){
			cb('no userfound')
		}
		if(err){return console.log(err)}
		bcrypt.compare(password, userReturned.password, function(err, res){
				console.log('login', res)
			})
		})
	}







User = mongoose.model('User', userSchema);


module.exports = User;
