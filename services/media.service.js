const GlobalMedia = require('../models/globalMedia.model');

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
	GlobalMedia.find({title: media.title, genre: media.genre, mediaType: media.mediaType}).exec().then((searchRes) => {
		return searchRes[0];
	});
}
