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