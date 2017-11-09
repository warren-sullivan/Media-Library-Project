const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const errMiddleware = require('../err-middleware');

chai.use(sinonChai);
const expect = chai.expect;

describe('Error Middleware', () => {
	const res = {
		code: null,
		status: function (code) {
			this.code = code;
			return this;
		},
		send: sinon.spy()
	};

	const err = 'This is an error';

	afterEach(() => {
		res.send.reset();
	});

	it('Should be a function', () => {
		expect(errMiddleware).to.be.a('function');
	});

	it('should set the status code to 500', () => {
		errMiddleware(err, {}, res);
		expect(res.code).to.equal(500);
	});

	it('should call send.res with correct err msg', () => {
		errMiddleware(err, {}, res);
		expect(res.send.calledOnce).to.be.true;
		expect(res.send.calledWith('Internal server error: This is an error')).to.be.true;
	});
});
