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
				console.log(userRes)
				console.log()
				console.log(res)
				console.log()
				console.log(media)
				console.log()
				console.log(userRecHelper(userRes, res, media));
			});
		});
	}).catch((err) => {
		console.log(err);
	});
}
