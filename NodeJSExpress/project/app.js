const express = require('express')

const app = express()

const port = 3000

app.get('/', (req, res) => {
	res.send('Hello World!')
});

app.get('/page.html', (req, res) => {
	res.sendFile("page-3.html", {'root':'/'});
});

app.get('/page-2.html', (req, res) => {
	let name = req.query.name;
	let age = req.query.age;
	res.send('Hello '+ name + ', you are ' + age + ' years old');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})