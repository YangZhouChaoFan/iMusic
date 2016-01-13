var music = require('../models/musicModel').music;

//查询
exports.query = function (data, callback) {
    music.find(data, function (err, results) {
        if (err) {
            callback(true);
            return;
        }
        callback(false, results);
    });
};

//删除
exports.delete = function (data, callback) {
    music.remove({_id: {$in: data}}).exec(function (err) {
        callback(err)
    });
};

//新增
exports.insert = function (data, callback) {
    var musicData = new music(data);
    musicData.save(function(err){
        callback(err);
    });
};

//修改
exports.update = function (data, callback) {
    music.find({_id: data._id}).update(data).exec(function(err){
        callback(err);
    });
};