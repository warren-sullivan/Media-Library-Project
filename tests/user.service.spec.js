const chai = require('chai');
const user = require('../services/user.service');
const expect = chai.expect;

let dummyUser = {
	username: 'Test'
}

describe('User Service', () => {
	it('newUser() should return a promise', () => {
		expect(user.newUser(dummyUser)).to.be.a('promise');
	});

	it('newUser() promise should return a user object', () => {
		user.newUser(dummyUser).then((res) => {
			expect(res.username).to.equal('Test');
		}).catch((err) => {
			return err;
		});
	});

	it('findUser() should return a promise', () => {
		expect(user.findUser(dummyUser)).to.be.a('promise');
	});

	it('findUser() promise should return a user object', () => {
		user.findUser(dummyUser).then((res) => {
			expect(res.username).to.equal('Test');
		}).catch((err) => {
			return err;
		});
	});
});
