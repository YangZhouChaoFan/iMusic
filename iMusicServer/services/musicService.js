var muisc = require('../models/musicModel').muisc;

exports.query = function (data, callback) {
    muisc.count(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};