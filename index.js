const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./mongodb.utils');
const userService = require('./services/user.service');
const mediaService = require('./services/media.service');
const ratingsService = require('./services/ratings.service');
const errMiddleware = require('./err-middleware');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

mongodb.createEventListeners();
mongodb.connect();

app.get('/', (req, res) => {
	//remember to change the names when testing
	//ratingsService.getMediaRec();
	ratingsService.getUserRec({username: 'Jane'});
	res.send('root');
});


//for debugging
const User = require('./models/user.model');
const GlobalMedia = require('./models/globalMedia.model');
const Media = require('./models/media.model');

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

app.get('/media2_list', (req, res) => {
	Media.find({}).exec().then((findRes) => {
		res.status(200).json(findRes);
	});
});
//for debugging


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
	//user and media are objects
	ratingsService.rateMedia(req.body.user, req.body.media, req.body.rating).then((rateRes) => {
		res.status(200).json(rateRes);
	}).catch((err) => {
		res.status(500).send(err.toString());
	});
});

app.use(errMiddleware);
app.listen(PORT, () => { console.log('server start'); });

module.exports = app;
