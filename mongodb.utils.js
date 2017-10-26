const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function connect() {
	const uri = 'mongodb://localhost/project';
	mongoose.connect(uri, {useMongoClient:true});
}

function disconnect() {
	mongoose.disconnect();
}

function createEventListeners() {
	mongoose.connection.on('connected', () => {
		console.log('connected');
	});

	mongoose.connection.on('disconnected', () => {
		console.log('disconnected');
	});

	mongoose.connection.on('error', () => {
		console.log('error');
	});
}

module.exports = {
	connect,
	disconnect,
	createEventListeners
}
