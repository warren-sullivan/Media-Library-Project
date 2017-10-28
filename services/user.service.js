const User = require('../models/user.model');

function newUser(newUser) {
	const user = new User({
		username: newUser.username,

	});

	return user.save();
}
