const _ = require('lodash');

const User = require('../models/user.model');
const Media = require('../models/media.model');
const GlobalMedia = require('../models/globalMedia.model');

const mediaService = require('./media.service');
const userService = require('./user.service');

module.exports = {
	rateMedia,
	getMediaRec,
	getUserRec
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

			//using mediaToUpdate in Media.findOneAndUpdate fails silently
			//lodash says they aren't equal, == and === on values and length is all true
			//I don't even know anymore, have a hack
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



function recHelper(searchRes, res) {
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
	//needs to return promise
	mediaService.search(media).then((searchRes) => {
		User.find({}).exec().then((res) => {
			//TBD: sort and return 10 media with highest ratings
			return recHelper(searchRes[0], res);
		});
	});
}



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
					if(userMedia.media == otherMedia.media) {
						shared.count++;
					}
				});
			});

			sharedArray.push(shared);
		}
	});

	let newMediaList = [];
	_.forEach(mediaList, (media) => {
		_.forEach(user.mediaIndex, (id) => {
			//might be broken somewhere else, this should be fine
			if(media._id.toString() == id.toString()) {
				newMediaList.push({media: media, score: 0});
			}
		})
	});

	_.forEach(userList, (otherUser) => {
		let sharedCount = 0;
		_.forEach(sharedArray, (item) => {
			if(item.user == otherUser.username) {
				sharedCount = item.count;
			}
		});

		_.forEach(otherUser.mediaIndex, (otherMedia) => {
			_.forEach(newMediaList, (obj) => {
				if(otherMedia.toString() == obj.media._id.toString()) {
					obj.score += sharedCount;
				}
			});
		});
	});

	return newMediaList;
}

function getUserRec(user) {
	//needs to return promise
	userService.findUser(user).then((userRes) => {
		User.find({}).exec().then((res) => {
			GlobalMedia.find({}).exec().then((media) => {
				console.log(userRecHelper(userRes, res, media));
			});
		});
	});
}
