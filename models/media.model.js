const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
	userScore: Number,
	[{type:mongoose.Schema.Types.ObjectId, ref:'GlobalMedia'}]
});

module.exports = mongoose.model('Media', mediaSchema);
