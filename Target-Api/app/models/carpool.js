var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarpoolSchema = new Schema({
	DestID: {type: mongoose.Schema.Types.ObjectId, ref: 'Destination'},
	OwnerID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	NoteIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}],
	seats: Number,
	color: String,
	mileage: Number,
	arrivalTime: Date,
	oneTime: Boolean

});

module.exports = mongoose.model('Carpool', CarpoolSchema);