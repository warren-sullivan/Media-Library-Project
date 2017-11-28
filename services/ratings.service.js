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

function rateMedia(user, globalMedia, rating) {
	//multiple ratings should just change score, not add another entry

	//should be able to attempt handling missing genre/type
	//more error handling in general
	let media;
	return GlobalMedia.find({title: globalMedia.title, genre: globalMedia.genre, mediaType: globalMedia.mediaType}).exec().then((searchRes) => {
		let gMedia = searchRes[0];
		//error handling if no media is found

		gMedia.averageScore = (gMedia.averageScore * gMedia.ratingCount + rating) / (gMedia.ratingCount + 1);
		gMedia.ratingCount++;

		return GlobalMedia.findOneAndUpdate(searchRes[0]._id, gMedia);
	}).then((rateRes) => {
		const media = new Media({
			userScore: rating,
			media: rateRes._id
		});

		return media.save();
	}).then((mediaRes) => {
		media = mediaRes;
		return userService.findUser(user);
	}).then((userRes) => {
		userRes[0].mediaIndex.push(media._id);
		return userRes[0].save();
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
			console.log(media._id)
			console.log(id)
			console.log()
			if(media._id.toString() == id.toString()) {
				newMediaList.push({media: media, score: 0});
			}
		})
	});

	console.log(newMediaList)

	// let newMediaList = _.without(mediaList, user.mediaIndex);
	// newMediaList = _.map(newMediaList, (media) => {
	// 	return {media: media, score: 0}
	// });

	_.forEach(userList, (otherUser) => {
		_.forEach(sharedArray, (item) => {
			if(item.user == otherUser.username) {
				let shared = item;
			}
		});

		_.forEach(otherUser.mediaIndex, (otherMedia) => {
			_.forEach(newMediaList, (obj) => {
				if(otherMedia.media == obj.media) {
					console.log('hit')
					obj.score += shared.count;
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
