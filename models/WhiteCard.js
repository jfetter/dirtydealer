'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WhiteCard;

var whiteCardSchema = Schema({
	response: { type: String },
	votes: { type: Number },
	user: {type: Schema.Types.ObjectId, ref: "User"}
});




WhiteCard = mongoose.model('WhiteCard', whiteCardSchema);

module.exports = WhiteCard;
