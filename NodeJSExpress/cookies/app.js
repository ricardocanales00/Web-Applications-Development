const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/', function(req, res){
	console.log('Cookies', req.cookies);
	res.cookie('name', 'express');
	res.cookie('object', ["name":"Ricardo", "age":33]);

	const validity = 10 * 1000;
	res.cookie("cookieWithPeriod2", 'value', {maxAge : validity});
	res.send('cookie set');
});

app.get('/clear', function(req, res){
	res.clearCookie("name");
	res.clearCookie("object");
	res.clearCookie("cookieWithPeriod");
	res.clearCookie("cookieWithPeriod2");
	res.send("all cookies cleared");
});

app.get('/ckeck', function(req, res){
	console.log('Cookies: ', req.cookies);
	res.send('Check: ');
});

app.listen(3000, ()=>{
	console.log("up and running");
});