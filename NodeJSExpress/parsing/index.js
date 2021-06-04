var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.route('/clients').get(function(req, res){
	res.send("<h1>List of clients</h1>");
});

app.route('/clients/register').post(function(req, res){
	let namePar = req.body.name;
	let phonePar = req.body.phone;
	let agePar = req.body.age;
	if(!namePar || !phonePar || !agePar)
		res.end('Not all the parameters were recieved');
	else
		res.end('Registering ' + namePar + ' into our database');
});


const portNumber = 3000
var server = app.listen(portNumber, function(){
	console.log('Server running');
})