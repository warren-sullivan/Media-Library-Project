const _ = require('lodash');

const User = require('../models/user.model');
const Media = require('../models/media.model');
const GlobalMedia = require('../models/globalMedia.model');

const mediaService = require('./media.service');
const userService = require('./user.service');

module.exports = {
	rateMedia,
	getMediaRec,
	generateRecList
};

function rateMedia(user, globalMedia, rating) {
	return GlobalMedia.find({title: globalMedia.title, genre: globalMedia.genre, mediaType: globalMedia.mediaType}).exec().then((searchRes) => {
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
	}).then((mediaRes) => {
		user.mediaIndex.push(mediaRes._id);
		return user.save();
	});
}

function recHelper(searchRes, res) {
	//returns an array of media and how many users have that media in their own list

	let recArray = [];

	_.forEach(res, (obj) => {
		let found = false;

		_.forEach(obj.mediaIndex, (media) => {
			if(media == searchRes) { found = true; }
		});

		if(found) {
			_.forEach(obj.mediaIndex, (media) => {
				let bool = true;

				_.forEach(recArray, (rec) => {
					if(media == rec.media) {
						bool = false;
						rec.count++;
						rec.averageScore = (rec.averageScore + media.averageScore) / (rec.ratingCount + 1);
						rec.ratingCount++;
					}
				});

				if(bool) {
					recArray.push({
						media: media,
						count: 1,
						averageScore: media.averageScore,
						ratingCount: media.ratingCount
					});
				}
			});
		}
	});

	return recArray;
}

function getMediaRec(media) {
	mediaService.search(media).then((searchRes) => {
		User.find({}).exec().then((res) => {
			return recHelper(searchRes[0], res);
		});
	});
}

function userRecHelper(user, userList) {
	let array = [];

	_.forEach(user.mediaIndex, (userMedia) => {
		_.forEach(userList, (listIndex) => {
			_.forEach(listIndex, (listMedia) => {
				if(userMedia == listMedia) {
					array.push({
						
					});
				}
			});
		});
	});

	return array;
}

function generateRecList(user) {
	userService.findUser(user).then((userRes) => {
		User.find({}).exec().then((res) => {
			return userRecHelper(userRes, res);
		});
	});
	
	//create a list of recs based on user and other users
}
