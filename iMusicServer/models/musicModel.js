var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/imusic');

var db = mongoose.connection;

db.once('open', function callback () {
    console.log('mongoDB connected...')
});

var Schema = mongoose.Schema;
var musicSchema = new Schema({
    name: String,
    author: String,
    type: String
});

exports.muisc = mongoose.model('music', musicSchema);
exports.db = db;