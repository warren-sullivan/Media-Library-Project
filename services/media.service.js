const GlobalMedia = require('../models/globalMedia.model');

module.exports = {
	newMedia,
	search
};

function newMedia(newMedia) {
	//TBD: block duplicate media

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
	let temp = {};
	if(media._id){temp._id = media._id}
	if(media.title){temp.title = media.title}
	if(media.genre){temp.genre = media.genre}
	if(media.mediaType){temp.mediaType = media.mediaType}

	return GlobalMedia.find(temp).exec();
}
