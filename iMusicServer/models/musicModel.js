var mongoose = require("mongoose");
var db = mongoose.connect('mongodb://localhost/imusic');

var musicSchema = new mongoose.Schema({
    name: String,
    author: String,
    type: String
});

exports.muisc = mongoose.model('music', musicSchema);
