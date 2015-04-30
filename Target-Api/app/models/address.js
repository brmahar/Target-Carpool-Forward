var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddrSchema = new Schema({
	street: String,
	city: String,
	state: String,
	zip: String,
	loc: {type: [Number], index:'2d'},
	adjAddr: String

});
AddrSchema.index({loc: '2d'});
module.exports = mongoose.model('Address', AddrSchema);