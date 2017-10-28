const User = require('../models/user.model');

module.exports = {
	newUser,
	findUser
};

function newUser(newUser) {
	const user = new User({
		username: newUser.username,
	});

	return user.save();
}

function findUser(user) {
	User.find({username: user.username}).exec().then((searchRes) => {
		return searchRes[0];
	});
}
