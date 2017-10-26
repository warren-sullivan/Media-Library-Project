const mongodb = require('./mongodb.utils');
const Author = require('./author.model');
const Book = require('./book.model');

module.exports = {
	fetchAllAuthors,
	fetchAllBooks,
	saveBook,
	saveAuthor,
	updateBook
}

function fetchAllAuthors() {
	return Author.find({}).populate('books').exec();
}

function fetchAllBooks() {
	return Book.find({}).populate('author').exec();
}

function saveAuthor(authorToSave) {
	const author = new Author({
		firstname: authorToSave.firstname,
		lastname: authorToSave.lastname
	});

	return author.save();
}

function saveBook(bookToSave) {
	let authorInfo;
	let bookInfo;

	return Author.find({ firstname: bookToSave.author.firstname, lastname: bookToSave.author.lastname}).exec().then((authorSearchRes) => {
		if(authorSearchRes && authorSearchRes.length > 0) {
			return authorSearchRes[0];
		} else {
			const author = new Author({
				firstname: bookToSave.author.firstname,
				lastname: bookToSave.author.lastname
			});

			return author.save();
		}
	}).then((authorSaved) => {
		authorInfo = authorSaved;

		const book = new Book({
			title: bookToSave.title,
			author: authorSaved._id
		});

		return book.save();
	}).then((bookSaved) => {
		bookInfo = bookSaved;
		authorInfo.books.push(bookSaved._id);

		return authorInfo.save();
	}).then((updatedAuthorInfo) => {
		const infoToReturn = {
			author: updatedAuthorInfo,
			book: bookInfo
		};

		return infoToReturn;
	});
}

function updateBook() {

}








const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./mongodb.utils');
const Author = require('./author.model');
const Book = require('./book.model');

const lib = require('./library.service');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

mongodb.createEventListeners();
mongodb.connect();

app.get('/', (req, res) => {
	res.send('root');
});



app.get('/firstname', (req, res) => {
	Author.find({firstname: req.query.firstname}).exec().then((authorRes) => {
		res.status(200).json(authorRes);
	}).catch((err) => {
		res.status(500).json(err);
	});
});

app.get('/lastname', (req, res) => {
	Author.find({lastname: req.query.lastname}).exec().then((authorRes) => {
		res.status(200).json(authorRes);
	}).catch((err) => {
		res.status(500).json(err);
	});
});

app.get('/title', (req, res) => {
	lib.fetchAllBooks().then((bookRes) => {
		res.status(200).json(bookRes);
	}).catch((err) => {
		res.status(500).json(err);
	});
});



app.post('/author', (req, res) => {
	lib.saveAuthor({firstname: req.body.firstname, lastname: req.body.lastname}).then((authorRes) => {
		res.status(200).json(authorRes);
	}).catch((err) => {
		res.status(500).json(err);
	});
});

app.post('/book', (req, res) => {
	lib.saveBook({title: req.body.title, author: {firstname: req.body.author.firstname, lastname: req.body.author.lastname}}).then((bookRes) => {
		res.status(200).json(bookRes);
	}).catch((err) => {
		res.status(500).json(err);
	});
});



app.put('/author', (req, res) => {
	const updateObj = {};
	if(req.body.firstname) { updateObj.firstname = req.body.firstname; }
	if(req.body.lastname) { updateObj.lastname = req.body.lastname; }

	Author.findByIdAndUpdate(req.body.id, updateObj, {new:true}).then((authorRes) => {
		res.status(200).json(authorRes);
	}).catch((err) => {
		res.status(500).json(err);
	});
});

app.put('/book', (req, res) => {
	const updateObj = {};
	if(req.body.bookTitle) { updateObj.title = req.body.bookTitle; }
	if(req.body.authorID) { updateObj.author = req.body.authorID; }

	Book.findByIdAndUpdate(req.body.id, updateObj, {new:true}).then((bookRes) => {
		res.status(200).json(bookRes);
	}).catch((err) => {
		res.status(500).json(err);
	});
});



app.listen(PORT, () => { console.log('server start'); });

module.exports = app;



// Book.find({title:'We Have Always Lived in the Castle'}).populate('author').exec().then((res) => {
// 	console.log(res);
// 	mongodb.disconnect();
// }).catch((err) => {
// 	console.log(err);
// 	mongodb.disconnect();
// });



// let foundBook;
// Book.find({title:'We Have Always Lived in the Castle'}).exec().then((bookResult) => {
// 	foundBook = bookResult[0];
// 	return Author.find({firstname: 'Shirley', lastname: 'Jackson'}).exec();
// }).then((authorResult) => {
// 	let author = authorResult[0];
// 	author.books.push(foundBook._id);
// 	return author.save();
// }).then((res) => {
// 	console.log(res);
// 	mongodb.disconnect();
// }).catch((err) => {
// 	console.log(err);
// 	mongodb.disconnect();
// });



// Author.find({firstname: 'Shirley', lastname: 'Jackson'}).exec().then((authorResult) => {
// 	const shirleyJackson = authorResult[0];
// 	const weHaveAlways = new Book({
// 		title: 'We Have Always Lived in the Castle',
// 		author: shirleyJackson._id
// 	});
// 	return weHaveAlways.save();
// }).then((bookResult) => {
// 	console.log(bookResult);
// 	mongodb.disconnect();
// }).catch((err) => {
// 	console.log(err);
// 	mongodb.disconnect();
// });



// const shirleyJackson = new Author({
// 	firstname: 'Shirley',
// 	lastname: 'Jackson'
// });
//
// shirleyJackson.save().then((res) => {
// 	console.log(res);
// 	mongodb.disconnect();
// }).catch((err) => {
// 	console.log(err);
// 	mongodb.disconnect();
// });
