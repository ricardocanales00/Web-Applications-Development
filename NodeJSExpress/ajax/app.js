const express = require('express');
const app = express();
const port = 3000;

app.set('views', './views')
app.set('view engine', 'pug');

app.get('/static-page', (req, res) => {
    res.sendFile("page.html", {'root': '../'});
});

app.get('/dynamic-page', (req, res) => {
    let name = req.query.name;
    let age = req.query.age;
    res.send('<html><head><title>Sample page</title></head><body><h2>Hello world from a page created on the fly</h2><p>Your name is ' + name + ' and you are ' + age + ' years old</p></body></html>');
})

app.get('/template-page', function (req, res) {
    let nameParam = req.query.name;
    let ageParam = req.query.age;
    res.render('template', { title: 'Hey', name: nameParam, age: ageParam});
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});