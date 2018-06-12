let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 3000;
let book = require('./app/routes/book');
let config = require('config');

if (config.util.getEnv('NODE_ENV') !== 'test'){
    app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));

app.get('/', (req, res) => { res.json({message: 'Welcome to our Bookstore!'})});

app.route('/book')
    .get(book.getBooks)
    .post(book.postBook);

app.route('/book/:id')
    .get(book.getBook)
    .delete(book.deleteBook)
    .put(book.updateBook);

app.listen(port);
console.log('Listening on port %d', port);

module.exports = app; // for testing