'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
// var jwt = require('jwt-simple');

var User;

var userSchema = Schema({
	email:{type: String, required: true, unique: true},
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true },
	phone: {type: Number},
	name: {type: String},
	address: {type: String},
	avatar: {type: String, data:Buffer},
	favorites: [{type: Schema.Types.ObjectId, ref: "User"}],
	isAdmin: {type: Boolean, default: false}
});

User = mongoose.model('User', userSchema);


module.exports = User;
