'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlackCard;

var BlackCardSchema = Schema({
	scenario: { type: String },
	fields: { type: Number }
});

BlackCard = mongoose.model('BlackCard', blackCardSchema);

module.exports = BlackCard;
