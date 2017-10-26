const mongoose = require('mongoose');

const globalMediaSchema = mongoose.Schema({
	title: String,
	genre: String,
	mediaType: String,
	averageScore: Number
});

module.exports = mongoose.model('GlobalMedia', globalMediaSchema);
