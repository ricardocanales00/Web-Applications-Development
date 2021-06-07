const express = require('express');
const app = express();
// npm install --save cors
// Why? check the post address, is it localhost or 127.0.0.1
const cors = require('cors');

// A map has a key and value interface
const resultCache = new Map();

// turns out body parser is already included in express
// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
// we only need:
app.use(express.json());
app.use(cors());

app.route('/').get(function(req, res){
    res.sendFile("form.html", {root:'./'});
});

// with cache enabled
app.route('/square').post((req,res) => {
    let nAsString = req.body.number;
    let n = parseInt(nAsString);
    res.type('text');
    if (resultCache.has(n)){
        console.log(`Square of ${n} already exists in cache`);
        res.end(`${resultCache.get(n)}`);
    }
    else{
        console.log(`Square of ${n} did not exist in cache, creating it...`);
        let squared = n * n;
        resultCache.set(n, squared);
        res.end(`${squared}`);
    }
});

const portNumber = 3000;
var server = app.listen(portNumber, function(){
    console.log('Server ready and running');
});