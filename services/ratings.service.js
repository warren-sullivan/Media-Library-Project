const _ = require('lodash');

const User = require('../models/user.model');
const Media = require('../models/media.model');
const GlobalMedia = require('../models/globalMedia.model');

const mediaService = require('./media.service');
const userService = require('./user.service');

module.exports = {
	rateMedia
};

function rateMedia(user, media, rating) {
	let tempObj = {};
	let mediaID;
	let alreadyRated = false;
	let oldRating;

	if(media._id) { tempObj._id = media._id; }
	if(media.title) { tempObj.title = media.title; }
	if(media.genre) { tempObj.genre = media.genre; }
	if(media.mediaType) { tempObj.mediaType = media.mediaType; }

	return userService.findUser(user).then((userRes) => {
		user = userRes[0];
	}).then(() => {
		return mediaService.search(tempObj);
	}).then((searchRes) => {
		let gMedia = searchRes[0];
		mediaID = gMedia._id;

		//better error handling needed
		if(!gMedia) { throw new Error('invalid media'); }
		if(!user) { throw new Error('invalid user'); }
		if(!rating) { throw new Error('invalid rating'); }

		_.forEach(user.mediaIndex, (userMedia) => {
			if(userMedia.media.toString() == mediaID.toString()) {
				alreadyRated = true;
				oldRating = userMedia.userScore;
			}
		});

		if(alreadyRated) {
			let tempNum = (gMedia.averageScore * gMedia.ratingCount) - oldRating;
			gMedia.averageScore = (tempNum + rating) / gMedia.ratingCount;
			return GlobalMedia.findOneAndUpdate({_id: gMedia._id}, gMedia, {new: true});
		} else {
			gMedia.averageScore = (gMedia.averageScore * gMedia.ratingCount + rating) / (gMedia.ratingCount + 1);
			gMedia.ratingCount++;
			return GlobalMedia.findOneAndUpdate({_id: gMedia._id}, gMedia, {new: true});
		}
	}).then((rateRes) => {
		if(alreadyRated) {
			let id;
			let mediaToUpdate;

			_.forEach(user.mediaIndex, (userMedia) => {
				if(userMedia.media.toString() == mediaID.toString()) {
					userMedia.userScore = rating;

					id = {_id: userMedia._id};
					mediaToUpdate = userMedia;
				}
			});

			let mediaHACK = {_id: mediaToUpdate._id,
				userScore: mediaToUpdate.userScore,
				media: mediaToUpdate.media,
				__v: mediaToUpdate.__v}

			return Media.findOneAndUpdate(id, mediaHACK, {new: true}).then((output) => {
				console.log(output)
				return output
			});
		} else {
			const newMedia = new Media({
				userScore: rating,
				media: mediaID
			});

			user.mediaIndex.push(newMedia);
			newMedia.save();
			user.save();
			return user;
		}
	}).catch((err) => {
		throw err;
	});
}
