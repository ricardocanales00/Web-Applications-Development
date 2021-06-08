const express = require('express');
const app = express();
app.use(express.json()); // body-parser
const ejs = require('ejs');

require('./src/database');
let ProductModel = require('./src/models/product');

//CRUD - Products

//C - create
app.route('/products/create').get((req, res) =>{
    res.sendFile('create.html', {root: './src/pages/products/'});
});

app.route('/products/create').post((req, res) =>{
    let{ name, price, brand } = req.body; // JS object deconstruction
    
    let product = new ProductModel({name: name, price: price, brand: brand});
    product.save((err) => {
        if (err) res.status(503).send(`error: ${err}`); 
        else res.send(product);
    });
});


//R - read
app.route('/products/all').get((req, res) => {
    res.sendFile('index.html', {root: './src/pages/products/'});
});

app.route('/products').get(async (req, res) => {
    let allProducts = await ProductModel.find();
    res.send(allProducts);
});


app.route('/products/:id').get(async (req, res) => {
    let productId  = req.params.id;

    ejs.renderFile('./src/pages/products/show.html', {productId: productId}, null, function(err, str){
        if (err) res.status(503).send(`error when rendering the view: ${err}`); 
        else {
            res.end(str);
        }
    });

});

app.route('/load/:id').get(async (req, res) => {
    let productId  = req.params.id;
    let product = await ProductModel.findOne({ '_id': productId});
    if (product)
        res.send(product);
    else
        res.status(404).end(`Movie with id ${productId} does not exist`)

});

app.route('/products/:id').put((req, res) => {
    let productId  = req.params.id;
    let{ name, price, brand} = req.body;
    ProductModel.findOneAndUpdate(
        {_id: productId}, // selection criteria
        {
            name: name,
            price: price,
            brand: brand,
        }
    )
    .then(product => res.send(product))
    .catch(err => { console.log(error); res.status(503).end(`Could not update product ${error}`); });
});

app.route('/products/:id/edit').get((req, res) => {
    let productId  = req.params.id;

    ejs.renderFile('./src/pages/products/edit.html', {productId: productId}, null, function(err, str){
        if (err) res.status(503).send(`error when rendering the view: ${err}`); 
        else {
            res.end(str);
        }
    });
});

//D - delete
app.route('/products/:id').delete((req, res) => {
    let productId  = req.params.id;
    ProductModel.findOneAndDelete({_id: productId})
    .then(product => res.send(product))
    .catch(err => { console.log(error); res.status(503).end(`Could not delete product ${error}`); });
});

const portNumber = 3000;
var server = app.listen(portNumber, function(){
    console.log('Express Server ready and running');
});