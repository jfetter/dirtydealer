'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
// var jwt = require('jwt-simple');

var User;

var userSchema = Schema({
  username: { type: String},
  password: { type: String, required: true },
	email:{type: String, required: true},
	phone: {type: Number},
	name: {type: String},
	avatar: {type: String data:Buffer},
	favorites: [{type: Schema.Types.ObjectId, ref: "User"}]

});

User = mongoose.model('User', userSchema);


module.exports = User;
