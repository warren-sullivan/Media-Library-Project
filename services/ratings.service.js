const User = require('../models/user.model');
const Media = require('../models/media.model');
const GlobalMedia = require('../models/globalMedia.model');

function rateMedia(globalMedia, rating) {
	GlobalMedia.find({title: globalMedia.title, genre: globalMedia.genre, mediaType: globalMedia.mediaType}).exec().then((searchRes) => {
		let gMedia = searchRes[0];

		gMedia.averageScore = (gMedia.averageScore * gMedia.ratingCount + rating) / (gMedia.ratingCount + 1);
		gMedia.ratingCount++;
		
		return gMedia.save();
	}).then((rateRes) => {
		const media = new Media({
			userScore: rating,
			media: rateRes._id
		});

		return media.save();
	});
}

function getMediaRec() {

}

function generateRecList() {

}
