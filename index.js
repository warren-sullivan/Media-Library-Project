const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./mongodb.utils');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

mongodb.createEventListeners();
mongodb.connect();

app.get('/', (req, res) => {
	res.send('root');
});



app.listen(PORT, () => { console.log('server start'); });

module.exports = app;
