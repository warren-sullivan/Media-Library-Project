const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: String,
	mediaIndex : []
});

module.exports = mongoose.model('User', userSchema);
