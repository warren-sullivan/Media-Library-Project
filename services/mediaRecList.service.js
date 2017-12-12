const _ = require('lodash');

const User = require('../models/user.model');
const Media = require('../models/media.model');
const GlobalMedia = require('../models/globalMedia.model');

const mediaService = require('./media.service');
const userService = require('./user.service');

module.exports = {
	getMediaRec
};

function newRatingObj(mediaObj) {
	return mediaService.findMediaID(mediaObj.media).then((res) => {
		return {
			media: mediaObj.media,
			count: 1,
			averageScore: res[0].averageScore,
			ratingCount: res[0].ratingCount
		}
	});
}

function newRecs(obj) {
	let promiseArray = [];
	let tempArray = [];

	_.forEach(obj.mediaIndex, (mediaObj) => {
		let bool = true;

		_.forEach(tempArray, (id) => {
			if(mediaObj.media.toString() == id.toString()) { bool = false }
		});

		if(bool) {
			tempArray.push(mediaObj.media);
			promiseArray.push(newRatingObj(mediaObj));
		}
	});

	return Promise.all(promiseArray);
}

function recHelper(searchRes, userRes) {
	let promiseArray = [];

	_.forEach(userRes, (obj) => {
		let found = false;

		_.forEach(obj.mediaIndex, (mediaObj) => {
			if(mediaObj.media.toString() == searchRes._id.toString()) { found = true; }
		});

		if(found) {
			promiseArray.push(newRecs(obj));
		}
	});

	return Promise.all(promiseArray).then((res) => {
		let recArray = [];
		res = _.unionBy(res, 'media');

		_.forEach(res, (recObj) => {
			recArray.push(recObj);
		});

		return recArray;
	});
}

function getMediaRec(media) {
	//needs to return promise
	return mediaService.search(media).then((searchRes) => {
		return userService.findAllUsers().then((userRes) => {
			// TBD: sort and return 10 media with highest ratings
			//console.log(recHelper(searchRes[0], userRes));
			recHelper(searchRes[0], userRes).then((res) => {
				console.log(res)
			})
			return 'blah';
		});
	});
}

// function recHelper(searchRes, userRes) {
// 	let recArray = [];
//
// 	_.forEach(userRes, (obj) => {
// 		let found = false;
//
// 		_.forEach(obj.mediaIndex, (mediaObj) => {
// 			if(mediaObj.media.toString() == searchRes._id.toString()) { found = true; }
// 		});
//
// 		if(found) {
// 			_.forEach(obj.mediaIndex, (mediaObj) => {
// 				let bool = true;
//
// 				_.forEach(recArray, (rec) => {
// 					if(mediaObj.media.toString() == rec.media.toString()) {
// 						console.log('hit ++')
// 						bool = false;
// 						rec.count++;
// 						rec.averageScore = (rec.averageScore + mediaObj.averageScore) / (rec.ratingCount + 1);
// 						rec.ratingCount++;
// 					}
// 				});
//
// 				if(bool) {
// 					console.log('hit new')
// 					recArray.push({
// 						media: mediaObj.media,
// 						count: 1,
// 						averageScore: mediaObj.averageScore,
// 						ratingCount: mediaObj.ratingCount
// 					});
//
// 					// newRatingObj(mediaObj).then((res) => {
// 					// 	recArray.push(res);
// 					// })
// 				}
// 			});
// 		}
// 	});
//
// 	return recArray;
// }
//
// function getMediaRec(media) {
// 	//needs to return promise
// 	return mediaService.search(media).then((searchRes) => {
// 		return userService.findAllUsers().then((userRes) => {
// 			// TBD: sort and return 10 media with highest ratings
// 			console.log(recHelper(searchRes[0], userRes));
// 			return 'blah';
// 		});
// 	});
// }
