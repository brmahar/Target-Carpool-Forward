var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	createdAt: {type:Date, default: Date.now},
	body: String

});

module.exports = mongoose.model('Note', NoteSchema);