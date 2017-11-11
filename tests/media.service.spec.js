const chai = require('chai');
const media = require('../services/media.service');
const expect = chai.expect;

let dummyMedia = {
	title: 'Test Media',
	genre: 'Testing',
	mediaType: 'Test'
}

describe('Media Service', () => {
	it('newMedia() should return a promise', () => {
		expect(media.newMedia(dummyMedia)).to.be.a('promise');
	});

	it('newMedia() promise should return a media object', () => {
		media.newMedia(dummyMedia).then((res) => {
			expect(res.title).to.equal('Test Media');
			expect(res.genre).to.equal('Testing');
			expect(res.mediaType).to.equal('Test');
			expect(res.averageScore).to.equal(0);
			expect(res.ratingCount).to.equal(0);
			done();
		}).catch((err) => {
			return err;
		});
	});

	it('search() should return a promise', () => {
		expect(media.search(dummyMedia)).to.be.a('promise');
	});

	it('search() promise should return a media object', () => {
		media.search(dummyMedia).then((res) => {
			expect(res.title).to.equal('Test Media');
			expect(res.genre).to.equal('Testing');
			expect(res.mediaType).to.equal('Test');
			expect(res.averageScore).to.equal(0);
			expect(res.ratingCount).to.equal(0);
			done();
		}).catch((err) => {
			return err;
		});
	});

	it('search() promise should return a media object with only title', () => {
		media.search({title: 'Test Media'}).then((res) => {
			expect(res.title).to.equal('Test Media');
			expect(res.genre).to.equal('Testing');
			expect(res.mediaType).to.equal('Test');
			expect(res.averageScore).to.equal(0);
			expect(res.ratingCount).to.equal(0);
			done();
		}).catch((err) => {
			return err;
		});
	});
});
