var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DestSchema = new Schema({
	AddrID: {type: mongoose.Schema.Types.ObjectId, ref: 'Address'},
	NoteIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
	description: String
});

module.exports = mongoose.model('Destination', DestSchema);