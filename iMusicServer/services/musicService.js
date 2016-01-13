var muisc = require('../models/musicModel').music;

exports.query = function (data, callback) {
    muisc.find(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

exports.delete = function (data, callback) {
    music.remove({_id: {$in: data}}, function (err) {
        callback(err)
    });
};

exports.insert = function (data, callback) {
    var musicData = new muisc(data);
    musicData.save(function(err){
        callback(err)
    });
};