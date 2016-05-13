var express = require('express');
var Client = require('node-rest-client').Client;
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var crowlRouter = require('./src/routes/crowler');
app.use('/', crowlRouter);

app.use(express.static('public'));
app.set('views', 'src/views');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('*', function(req, res){
  res.send('what???', 404);
});

var port = process.env.PORT || 4004;
app.listen(port, function (err) {
    console.log("Server is running on : " + port);
});