const GlobalMedia = require('../models/globalMedia.model');

module.exports = {
	newMedia,
	search
};

function newMedia(newMedia) {
	const media = new GlobalMedia({
		title: newMedia.title,
		genre: newMedia.genre,
		mediaType: newMedia.mediaType,
		averageScore: 0,
		ratingCount: 0
	});

	return media.save();
}

function search(media) {
	//needs to not search for unavaliable input data

	return GlobalMedia.find({title: media.title, genre: media.genre, mediaType: media.mediaType}).exec();
}
