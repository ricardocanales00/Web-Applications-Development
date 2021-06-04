var express = require('express');
var app = express();

app.route('/Clients').post(function(req, res){
	res.send("<h1>List of clients</h1>");
});


const portNumber = 3000
var server = app.listen(portNumber, function(){
	console.log('Server running');
})