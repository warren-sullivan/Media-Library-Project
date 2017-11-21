const GlobalMedia = require('../models/globalMedia.model');

module.exports = {
	newMedia,
	search
};

function newMedia(newMedia) {
	return search(newMedia).then((res) => {
		if(res.length > 0) { throw new Error('media already exists'); }
		else {
			const media = new GlobalMedia({
				title: newMedia.title,
				genre: newMedia.genre,
				mediaType: newMedia.mediaType,
				averageScore: 0,
				ratingCount: 0
			});

			return media.save();
		}
	}).catch((err => {
		throw err;
	}));
}

function search(media) {
	let bool = false;
	let temp = {};
	if(media._id) { temp._id = media._id; bool = true; }
	if(media.title) { temp.title = media.title; bool = true; }
	if(media.genre) { temp.genre = media.genre; bool = true; }
	if(media.mediaType) { temp.mediaType = media.mediaType; }

	if(!media || !bool) { throw new Error('invalid media'); }

	return GlobalMedia.find(temp).exec();
}
