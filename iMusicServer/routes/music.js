var express = require('express');
var musicService = require('../services/musicService')
var router = express.Router();

router.get('/query', function(req, res, next) {
    var data = {};
    musicService.query(data, function (err, results) {
        if (err) {
            return;
        }
        res.send(results);
    });
});

module.exports = router;