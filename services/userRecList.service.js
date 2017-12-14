const _ = require('lodash');

const User = require('../models/user.model');
const Media = require('../models/media.model');
const GlobalMedia = require('../models/globalMedia.model');

const mediaService = require('./media.service');
const userService = require('./user.service');

module.exports = {
	getUserRec
};

function userRecHelper(user, userList, mediaList) {
	user = user[0];
	let sharedArray = [];

	_.forEach(userList, (otherUser) => {
		if(otherUser.username != user.username) {
			let shared = {
				user: otherUser.username,
				count: 0
			};

			_.forEach(otherUser.mediaIndex, (otherMedia) => {
				_.forEach(user.mediaIndex, (userMedia) => {
					if(userMedia.media.toString() == otherMedia.media.toString()) {
						if(Math.abs(userMedia.userScore-otherMedia.userScore) <= 1) {
							shared.count++;
						}
					}
				});
			});

			sharedArray.push(shared);
		}
	});

	let promiseArray = [];
	_.forEach(sharedArray, (shared) => {
		promiseArray.push(userService.findUser({username: shared.user}));
	});

	return Promise.all(promiseArray).then((res) => {
		let mediaArray = [];
		_.forEach(res, (users) => {
			mediaArray.push({
				user: users[0].username,
				media: users[0].mediaIndex,
				score: undefined
			})
		});

		_.forEach(mediaArray, (media) => {
			_.forEach(sharedArray, (shared) => {
				if(media.user == shared.user) {
					media.score = shared.count;
				}
			});
		});

		let resultArray = [];
		_.forEach(mediaArray, (mediaIndex) => {
			_.forEach(mediaIndex.media, (media) => {
				let bool = true;
				_.forEach(resultArray, (result) => {
					if(result.id.toString() == media.media.toString()) {
						bool = false;
						if(media.userScore >= 4) {
							result.score = result.score + mediaIndex.score;
						}
					}
				});

				if(bool) {
					if(media.userScore >= 4) {
						resultArray.push({
							id: media.media,
							score: mediaIndex.score
						});
					} else {
						resultArray.push({
							id: media.media,
							score: 0
						});
					}
				}
			});
		});

		return resultArray;
	});
}

function getUserRec(user) {
	return userService.findUser(user).then((userRes) => {
		return userService.findAllUsers().then((res) => {
			return GlobalMedia.find({}).exec().then((media) => {
				//TBD: sort and return top 10
				return userRecHelper(userRes, res, media);
			});
		});
	}).catch((err) => {
		console.log(err);
	});
}
