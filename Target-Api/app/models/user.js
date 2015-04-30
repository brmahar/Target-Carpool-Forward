var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	DestID: {type: mongoose.Schema.Types.ObjectId, ref: 'Destination'},
	AddrID: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
	email: String,
	mobilePhone: String,
	workPhone: String,
	CarPoolID: String,
	NoteIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
	isPass: Boolean

});

module.exports = mongoose.model('User', UserSchema);