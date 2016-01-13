var music = require('../models/musicModel').music;

exports.query = function (data, callback) {
    music.find(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

exports.delete = function (data, callback) {
    music.remove({_id: {$in: data}}).exec(function (err) {
        callback(err)
    });
};

exports.insert = function (data, callback) {
    var musicData = new music(data);
    musicData.save();
    callback(false);
};

exports.update = function (data, callback) {
    music.find({_id: data._id}).update(data).exec(function(err){
        callback(err);
    });
};