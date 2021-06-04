var express = require('express');
var app = express();

app.route('/Products').get(function(req, res){
	res.send("<h1>Products page</h1>");
});

app.route('/Clients').get(function(req, res){
	let a = 1;
	let b = 4
	console.log(a+b);
	res.send("<h1>Clients page</h1>");
});

app.route('/Vendors').get(function(req, res){
	res.send("<h1>Vendors page</h1>");
});

const portNumber = 3000
var server = app.listen(portNumber, function(){
	console.log('Server running');
})