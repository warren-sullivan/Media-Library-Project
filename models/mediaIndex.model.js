//no longer needed?

const mongoose = require('mongoose');

const mediaIndexSchema = mongoose.Schema({
	[{type:mongoose.Schema.Types.ObjectId, ref:'Media'}]
});

module.exports = mongoose.model('MediaIndex', mediaIndexSchema);
