const User = require('../models/user.model');

module.exports = {
	newUser,
	findUser
};

function newUser(newUser) {
	return findUser(newUser).then((res) => {
		if(res.length > 0) { throw new Error('user already exists'); }
		else {
			const user = new User({
				username: newUser.username,
				mediaIndex : []
			});

			return user.save();
		}
	}).catch((err) => {
		throw err;
	});
}

function findUser(user) {
	if(!user.username) { throw new Error('invalid username'); }
	return User.find({username: user.username}).populate('mediaIndex').exec();
}
