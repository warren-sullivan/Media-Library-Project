const GlobalMedia = require('../models/globalMedia.model');

function newMedia(newMedia) {
	const media = new GlobalMedia({
		title: newMedia.title,
		genre: newMedia.genre,
		mediaType: newMedia.mediaType,
		averageScore: undefined
	});

	return media.save();
}
