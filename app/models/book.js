let mongoose = require('mongoose');
let Promise = require('bluebird');
let config = require('config');

mongoose.Promise = Promise;
// promisify mongoose
Promise.promisifyAll(mongoose.Model);
Promise.promisifyAll(mongoose.Model.prototype);
Promise.promisifyAll(mongoose.Query.prototype);


let options = {
    server:  {socketOptions: { keepAlive: 1, connectTimeoutMS: 30000}},
    replset: {socketOptions: { keepAlive: 1, connectTimeoutMS: 30000}},
};

console.log('config %j', config);

let conn = mongoose.createConnection(config.DBHost, options);
conn.on('error', console.error.bind(console, 'connection error'));

let Schema = mongoose.Schema;

// book schema definition
let BookSchema = new Schema(
    {
        title:     { type: String, required: true },
        author:    { type: String, required: true },
        year:      { type: Number, required: true },
        pages:     { type: Number, required: true, min: 1 },
        createdAt: { type: Date, default: Date.now },
    },
    {
        versionKey: false
    }
);

// Sets the createdAt parameter equal to the current time
BookSchema.pre('save', next => {
    let now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

// Exports the BookSchema for use elsewhere.
module.exports = conn.model('book', BookSchema);