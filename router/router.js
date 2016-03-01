/**
 * Created by fewieden on 29.02.16.
 */
module.exports = function(app){
    app.get('/', function(req, res){
        res.render('index.html');
    });
};