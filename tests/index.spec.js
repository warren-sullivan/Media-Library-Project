const chai = require('chai');
const chaiHttp = require("chai-http");
const app = require('../index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Routes', () => {
	describe('GET /', () => {
		it('Returns successfully', (done) => {
			chai.request(app).get('/').end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				done();
			});
		});

		it('Returns correct data', (done) => {
			chai.request(app).get('/').end((err, res) => {
				expect(res.text).to.equal('root');
				done();
			});
		});
	});

	describe('GET /user', () => {
		it('Returns successfully', (done) => {
			chai.request(app).get('/user').end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				done();
			});
		});

		it('Returns valid object', (done) => {
			chai.request(app).get('/user').query({username: 'Test'}).end((err, res) => {
				expect(res.body._id).to.be.a('string');
				expect(res.body.mediaIndex).to.be.a('array');
				done();
			});
		});
	});

	describe('GET /media', () => {
		it('Returns successfully', (done) => {
			chai.request(app).get('/media').end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				done();
			});
		});

		it('Returns valid object', (done) => {
			chai.request(app).get('/media').query({title: 'Test Media', genre: 'Testing', type: 'Test'}).end((err, res) => {
				expect(res.body._id).to.be.a('string');
				expect(res.body.title).to.be.a('string');
				expect(res.body.genre).to.be.a('string');
				expect(res.body.mediaType).to.be.a('string');
				expect(res.body.averageScore).to.be.a('number');
				expect(res.body.ratingCount).to.be.a('number');
				expect(res.body.recommendations).to.be.a('array');
				done();
			});
		});
	});

	describe('POST /user', () => {
		it('Returns successfully', (done) => {
			chai.request(app).post('/user').end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				done();
			});
		});

		it('Returns valid object', (done) => {
			chai.request(app).post('/user').send({username: 'Test User'}).end((err, res) => {
				expect(res.body._id).to.be.a('string');
				expect(res.body.username).to.be.a('string');
				expect(res.body.mediaIndex).to.be.a('array');
				done();
			});
		});
	});

	describe('POST /media', () => {
		it('Returns successfully', (done) => {
			chai.request(app).post('/media').end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				done();
			});
		});

		it('Returns valid object', (done) => {
			chai.request(app).post('/media').query({title: 'Test Media', genre: 'Testing', type: 'Test'}).end((err, res) => {
				expect(res.body._id).to.be.a('string');
				expect(res.body.averageScore).to.be.a('number');
				expect(res.body.ratingCount).to.be.a('number');
				expect(res.body.recommendations).to.be.a('array');
				done();
			});
		});
	});

	describe('POST /search', () => {
		it('Returns successfully', (done) => {
			chai.request(app).post('/search').end((err, res) => {
				expect(err).to.be.null;
				expect(res).to.have.status(200);
				done();
			});
		});

		it('Returns valid object', (done) => {
			chai.request(app).post('/media').query({title: 'Test Media', genre: 'Testing', type: 'Test'}).end((err, res) => {
				expect(res.body._id).to.be.a('string');
				expect(res.body.averageScore).to.be.a('number');
				expect(res.body.ratingCount).to.be.a('number');
				expect(res.body.recommendations).to.be.a('array');
				done();
			});
		});
	});
});
