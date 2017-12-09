const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: String,
	mediaIndex: [{type:mongoose.Schema.Types.ObjectId, ref:'Media'}]
});

module.exports = mongoose.model('User', userSchema);
