const chai = require('chai');
const ratings = require('../services/ratings.service');
const expect = chai.expect;

describe('Ratings Service', () => {
	it('rateMedia() should return a promise', () => {
		expect(ratings.rateMedia()).to.be.a('promise');
	});

	it('getMediaRec() should return a promise', () => {
		expect(ratings.getMediaRec()).to.be.a('promise');
	});

	it('generateRecList() should return a promise', () => {
		expect(ratings.findgenerateRecListUser()).to.be.a('promise');
	});
});
