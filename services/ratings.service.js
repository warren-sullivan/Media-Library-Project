const User = require('../models/user.model');
const Media = require('../models/media.model');
const GlobalMedia = require('../models/globalMedia.model');

const mediaService = require('./media.service');

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
	//bleh code, but it should work

	//returns an array of media and how many users have that media in their own list
	//TBD: average rating & rating of searched media

	let recArray = [];

	for(let i=0; i<res.length; i++) {
		let found = false;

		for(let j=0; j<res[i].mediaIndex.length; i++) {
			if(res[i].mediaIndex[j] == searchRes) {
				found = true;
			}
		}

		if(found) {
			for(let j=0; j<res[i].mediaIndex.length; i++) {
				let bool = true;

				for(let k=0; k<recArray.length; i++) {
					if(res[i].mediaIndex[j] == recArray[k].media) {
						bool = false;
						recArray[k].count++;
					}
				}

				if(bool) {
					recArray.push({
						media: res[i].mediaIndex[j],
						count: 1
					});
				}
			}
		}
	}
	return recArray;
}

function getMediaRec(media) {
	//grab and return rec list for X media
	mediaService.search(media).then((searchRes) => {
		User.find({}).exec().then((res) => {
			recHelper(searchRes[0], res);
			//do something with this array
		});
	});
}

function generateRecList() {
	//create a list of recs based on user and other users
}
