const _ = require('lodash');

const User = require('../models/user.model');
const Media = require('../models/media.model');
const GlobalMedia = require('../models/globalMedia.model');

const mediaService = require('./media.service');
const userService = require('./user.service');

module.exports = {
	getMediaRec
};

// There's a better way to do this, but get it working now and fix it later.
// Warning: terrible code below

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

function recHelper(searchRes, allUserRes) {
	let promiseArray = [];

	_.forEach(allUserRes, (obj) => {
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

		res = _.uniqWith(_.flattenDeep(res), _.isEqual)

		_.forEach(res, (recObj) => {
			recArray.push(recObj);
		});

		return recArray;
	});
}

function recCounter(searchRes, allUserRes) {
	return recHelper(searchRes, allUserRes).then((res) => {
		let recArray = [];

		_.forEach(allUserRes, (obj) => {
			let found = false;

			_.forEach(obj.mediaIndex, (mediaObj) => {
				if(mediaObj.media.toString() == searchRes._id.toString()) { found = true; }
			});

			if(found) {
				_.forEach(obj.mediaIndex, (mediaObj) => {
					_.forEach(res, (rec) => {
						if(mediaObj.media.toString() == rec.media.toString()) {
							let bool = true;
							let scoreWeighted;
							if(mediaObj.userScore == 5) {
								scoreWeighted = 8;
							} else if(mediaObj.userScore == 4) {
								scoreWeighted = 5;
							} else if(mediaObj.userScore == 3) {
								scoreWeighted = 3;
							} else if(mediaObj.userScore == 2) {
								scoreWeighted = 1;
							} else if(mediaObj.userScore == 1) {
								scoreWeighted = 0;
							}

							_.forEach(recArray, (recObj) => {
								if(recObj.id.toString() == mediaObj.media.toString()) {
									bool = false;
									recObj.averageRecScore = (recObj.averageRecScore * recObj.ratingRecCount + scoreWeighted) / (recObj.ratingRecCount + 1);
									recObj.ratingRecCount++;
								}
							});

							//TBD: add weighted score

							if(bool) {
								recArray.push({
									id: mediaObj.media,
									averageRecScore: scoreWeighted,
									ratingRecCount: 1
								})
							}
						}
					});
				});
			}
		});

		return recArray;
	});
}

function getMediaRec(media) {
	return mediaService.search(media).then((searchRes) => {
		return userService.findAllUsers().then((allUserRes) => {
			// TBD: sort and return 10 media with highest ratings
			return recCounter(searchRes[0], allUserRes).then((res) => {
				return res;
			});
		});
	});
}
