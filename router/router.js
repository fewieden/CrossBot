/**
 * Created by fewieden on 29.02.16.
 */
var config = require('../config.js');

module.exports = function(app){
    app.get('/', function(req, res){
        res.render('index', {
            sounds: config.sounds
        });
    });
};