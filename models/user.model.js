const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	userName: String,
	mediaIndex : [{type:mongoose.Schema.Types.ObjectId, ref:'MediaIndex'}]
});

module.exports = mongoose.model('User', userSchema);
