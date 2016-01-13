var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/imusic');

var Schema = mongoose.Schema;
var musicSchema = new Schema({
    name: String,
    path: String,
    author: String,
    type: String
});

exports.music = mongoose.model('musics', musicSchema);
