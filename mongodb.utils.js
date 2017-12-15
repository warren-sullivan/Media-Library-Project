const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function connect() {
	const uri = 'mongodb://localhost/project_beta_v6';
	// const uri = 'mongodb://libraryuser:librarypassword@ds229415.mlab.com:29415/wbs_library'
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
