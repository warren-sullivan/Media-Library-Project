const chai = require('chai');
const ratings = require('../services/ratings.service');
const expect = chai.expect;

let dummyUser = {
	username: 'Test User'
}

let dummyMedia = {
	title: 'Test Media',
	genre: 'Testing',
	mediaType: 'Test'
}

describe('Ratings Service', () => {
	it('rateMedia() should return a promise', () => {
		expect(ratings.rateMedia(dummyUser, dummyMedia, 4)).to.be.a('promise');
	});

	it('rateMedia()', () => {
		ratings.rateMedia(dummyUser, dummyMedia, 4).then((res) => {
			done();
		}).catch((err) => {
			return err;
		});
	});

	it('getMediaRec() should return a promise', () => {
		expect(ratings.getMediaRec()).to.be.a('promise');
	});

	it('getMediaRec()', () => {
		ratings.getMediaRec(dummyMedia).then((res) => {
			done();
		}).catch((err) => {
			return err;
		});
	});

	it('generateRecList() should return a promise', () => {
		expect(ratings.findgenerateRecListUser()).to.be.a('promise');
	});
});
