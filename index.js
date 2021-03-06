const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const mongodb = require('./mongodb.utils');
const errMiddleware = require('./err-middleware');

const userService = require('./services/user.service');
const mediaService = require('./services/media.service');
const ratingsService = require('./services/ratings.service');

const mediaRecList = require('./services/mediaRecList.service');
const userRecList = require('./services/userRecList.service');

const User = require('./models/user.model');
const GlobalMedia = require('./models/globalMedia.model');
const Media = require('./models/media.model');

const PORT = 3000;
const app = express();
app.use(bodyParser.json());

mongodb.createEventListeners();
mongodb.connect();

//for debugging
app.get('/user_list', (req, res) => {
	User.find({}).populate('mediaIndex').exec().then((findRes) => {
		res.status(200).json(findRes);
	});
});

app.get('/media_list', (req, res) => {
	GlobalMedia.find({}).exec().then((findRes) => {
		res.status(200).json(findRes);
	});
});
//for debugging

app.get('/', (req, res) => {
	let name;
	if(req.query.name) {
		name = req.query.name;
	} else {
		name = 'John';
	}
	userRecList.getUserRec({username: name}).then((rec) => {
		res.send(rec);
	})
});

app.get('/user', (req, res) => {
	userService.findUser({username: req.query.name}).then((findRes) => {
		if(findRes.length < 1) { throw new Error('user not found'); }
		else { res.status(200).json(findRes[0]); }
	}).catch((err) => {
		res.status(500).send(err.toString());
	});
});

app.get('/media', (req, res) => {
	mediaService.search({title: req.query.title, genre: req.query.genre, mediaType: req.query.type}).then((searchRes) => {
		if(searchRes.length < 1) { throw new Error('media not found'); }
		else { res.status(200).json(searchRes[0]); }
	}).catch((err) => {
		res.status(500).send(err.toString());
	});
});

app.post('/user', (req, res) => {
	let user = {
		username: req.body.username
	};

	userService.newUser(user).then((newRes) => {
		res.status(200).json(newRes);
	}).catch((err) => {
		res.status(500).send(err.toString());
	});
});

app.post('/media', (req, res) => {
	let media = {
		title: req.body.title,
		genre: req.body.genre,
		mediaType: req.body.mediaType
	};

	mediaService.newMedia(media).then((newRes) => {
		res.status(200).json(newRes);
	}).catch((err) => {
		res.status(500).send(err.toString());
	});
});

app.post('/search', (req, res) => {
	mediaService.search({title: req.body.title, genre: req.body.genre, mediaType: req.body.mediaType}).then((searchRes) => {
		if(searchRes.length < 1) { throw new Error('media not found'); }
		else { res.status(200).json(searchRes); }
	}).catch((err) => {
		res.status(500).send(err.toString());
	});
});

app.post('/rate', (req, res) => {
	ratingsService.rateMedia(req.body.user, req.body.media, req.body.rating).then((rateRes) => {
		res.status(200).json(rateRes);
	}).catch((err) => {
		res.status(500).send(err.toString());
	});
});

app.get('/updateRecommendations', (req, res) => {
	GlobalMedia.find({}).exec().then((result) => {
		_.forEach(result, (media) => {
			mediaRecList.getMediaRec(media).then((rec) => {
				media.recommendations = rec;
				media.recommendations = _.flatten(media.recommendations);
				media.save();
			});
		})

		res.status(200).send('recommendations updated');
	});
});

app.get('/nuke', (req, res) => {
	//delete BD contents
});

app.use(errMiddleware);
app.listen(PORT, () => { console.log('server start'); });

module.exports = app;
