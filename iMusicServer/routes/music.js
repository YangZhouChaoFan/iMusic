var express = require('express');
var musicService = require('../services/musicService')
var router = express.Router();

router.get('/query', function(req, res, next) {
    var data = {type: '国语'};
    musicService.query(data, function (err, results) {
        if (err) {
            return;
        }
        res.send({'results': results});
    });
});

module.exports = router;