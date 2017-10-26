const mongoose = require('mongoose');

const globalMediaIndexSchema = mongoose.Schema({
	[{type:mongoose.Schema.Types.ObjectId, ref:'GlobalMedia'}]
});

module.exports = mongoose.model('GlobalMediaIndex', globalMediaIndexSchema);
