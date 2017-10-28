const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./mongodb.utils');
const userService = require('./services/user.service');
const mediaService = require('./services/media.service');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

mongodb.createEventListeners();
mongodb.connect();

app.get('/', (req, res) => {
	res.send('root');
});

app.get('/user/username', (req, res) => {
	let user = userService.findUser({username: 'username'});
	res.status(200).json(user);
});

app.get('/mediaType/mediaTitle', (req, res) => {
	let media = mediaService.search({title: 'mediaTitle', mediaType: 'mediaType'});
	res.status(200).json(media);
});

app.post('/user', (req, res) => {
	let user = {
		username: req.body.username
	};

	res.status(200).json(userService.newUser(user));
});

app.post('/mediaType', (req, res) => {
	let media = {
		title: req.body.title,
		genre: req.body.genre,
		mediaType: 'mediaType'
	};

	res.status(200).json(mediaService.newMedia(media));
});

app.post('/search', (req, res) => {
	let media = mediaService.search({title: req.body.title, genre: req.body.genre, mediaType: req.body.mediaType});
	res.status(200).json(media);
});

app.listen(PORT, () => { console.log('server start'); });

module.exports = app;
