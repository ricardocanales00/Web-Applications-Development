const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const cors = require('cors');
var bcrypt = require("bcryptjs");

const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json()); // middleware
app.use(cookieParser());
app.use(cors());

require('./src/database');
let ProductModel = require('./src/models/product');
let UserModel = require('./src/models/user');
var cart = [{"pro1":"0"}];

const { response } = require('express');

const secret = "5tr0n6P@55W0rD";

function generateToken(user) {
    let payload = {
     username: user.username,
     id: user.id,
     role: user.role
    };
    let oneDay = 60 * 60 * 24;
    return token = jwt.sign(payload, secret, { expiresIn: oneDay });
}

// Multer is a middleware that allows to store uploaded files
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage});

// middleware that add the user
function requireLogin(req, res, next){
    let accessToken = req.cookies.authorization
    // if there is no token stored in cookies, the request is unauthorized
    if (!accessToken){ 
        console.log('Unauthorized user, redirecting to login'); 
        return res.redirect('/login'); 
    }

    try{
        // use the jwt.verify method to verify the access token, itthrows an error if the token has expired or has a invalid signature
        payload = jwt.verify(accessToken, secret)
        console.log('Logged user accessing the site ' + payload.username);
        req.user = payload; // you can retrieve further details from the database. Here I am just taking the name to render it wherever it is needed.
        next()
    }
    catch(e){
        //if an error occured return request unauthorized error, or redirect to login
        // return res.status(401).send():
        res.redirect(403, '/login');
    }
}

app.get('/', requireLogin, function (req, res) {
    let userId  = payload.id;
    ejs.renderFile('./src/views/dashboard.html', {userId: userId}, null, function(err, str){
        if (err) res.status(503).send(`error when rendering the view: ${err}`); 
        else {
            res.end(str);
        }
    });
});

app.get('/login', function (req, res) {
    res.sendFile('login.html', {root: './src/views'});
});

app.get('/sign-up', function (req, res) {
    res.sendFile('create.html', {root: './src/views/user'});
});

// show the page for updating
app.get('/my-profile/', requireLogin, function (req, res){
    let userId  = payload.id;
    ejs.renderFile('./src/views/user/edit.html', {userId: userId}, null, function(err, str){
        if (err) res.status(503).send(`error when rendering the view: ${err}`); 
        else {
            res.end(str);
        }
    });
});

/*
        CRUD FOR USERS
*/
// Create
app.get('/user/create', function (req, res) {
    res.sendFile('create.html', {root: './src/views/user'});
});

app.post('/user/create', upload.single('avatar'), (req, res) => {
    let{ name, username, password, cargo } = req.body; // JS object deconstruction

    avatarObject = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/jpg'
    };
    
    
    let user = new UserModel({name: name, avatar:avatarObject, username: username, password : bcrypt.hashSync(password, 8), role: cargo});
    user.save((err) => {
        if (err) res.status(503).send(`error: ${err}`); 
        else res.send(user);
    });
});

//R - read
app.get('/user/all', requireLogin, function (req, res){
    res.sendFile('index.html', {root: './src/views/user'});
});

app.route('/user').get(async (req, res) => {
    let allusr = await UserModel.find();
    res.send(allusr);
});

app.route('/user/:id').get(async (req, res) => {
    let userId  = req.params.id;

    ejs.renderFile('./src/views/user/show.html', {userId: userId}, null, function(err, str){
        if (err) res.status(503).send(`error when rendering the view: ${err}`); 
        else {
            res.end(str);
        }
    });

});

// To get a user's data to be updated
app.route('/users/:id').get(async (req, res) => {
    let userId  = req.params.id;
    let user = await UserModel.findOne({_id: userId});
    if (user)
        res.send({
            _id: user._id, 
            name: user.name, 
            username: user.username,
            password: user.password,
            cargo: user.role,
            avatar: {
                contentType: user.avatar.contentType,
                data: user.avatar.toString('base64')
            }
        });
    else
        res.status(404).end(`User with id ${userId} does not exist`)
});

//U - Update
app.route('/user/:id').put((req, res) => {
    let userId  = req.params.id;
    let{ name, avatar, username, password} = req.body;
    if(password===false){
        UserModel.findByIdAndUpdate(
            {_id: userId}, // selection criteria
            {
                name: name,
                avatar: avatar,
                username: username
            }
        )
        .then(user => res.send(user))
        .catch(err => { console.log(error); res.status(503).end(`Could not update user ${error}`); });
    } else {
        UserModel.findByIdAndUpdate(
            {_id: userId}, // selection criteria
            {
                name: name,
                avatar: avatar,
                username: username,
                password: password
            }
        )
        .then(user => res.send(user))
        .catch(err => { console.log(error); res.status(503).end(`Could not update user ${error}`); });
    }
    
    
});

//D - delete

app.route('/user/:id').delete((req, res) => {
    let userId  = req.params.id;
    UserModel.findOneAndDelete({_id: userId})
    .then(user => res.send(user))
    .catch(err => { console.log(error); res.status(503).end(`Could not delete user ${error}`); });
});

app.route('/carg/:id').get(async (req, res) => {
    let userId  = req.params.id;
    let usr = await UserModel.findOne({ '_id': userId});
    if (usr)
        res.send(usr);
    else
        res.status(404).end(`Product with id ${userId} does not exist`)

});

app.route('/alluser').get(async (req, res) => {
    let alluser = await UserModel.find();
    res.send(alluser);
});

app.route('/login/').post(async (req, res) => {
    let {username, password} = req.body;
    let user = await UserModel.findOne({username: username});
    if (user){
        let success = bcrypt.compareSync(req.body.password, user.password);
        if (success === true){
            const accessToken = generateToken(user);
            res.cookie("authorization", accessToken, {secure: true, httpOnly: true});
            res.status(200).json(accessToken);
        }
        else
            res.status(404).send('Invalid credentials');
    }
    else{
        res.status(404).send('Invalid credentials');
    }
});

app.post('/logout', requireLogin, function(req, res){
    console.log(`Logging out ${req.username}`)
    res.clearCookie('authorization');
    res.send('User logged out');
});

// PRODUCTS CRUD
//CRUD - Products

//C - create
app.get('/products/create', requireLogin, function(req, res){
    res.sendFile('create.html', {root: './src/views/product/'});
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
app.get('/products/all', requireLogin, function (req, res){
    res.sendFile('index.html', {root: './src/views/product/'});
});

app.route('/products').get(async (req, res) => {
    let allProducts = await ProductModel.find();
    res.send(allProducts);
});


app.route('/products/:id').get(async (req, res) => {
    let productId  = req.params.id;

    ejs.renderFile('./src/views/product/show.html', {productId: productId}, null, function(err, str){
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
        res.status(404).end(`Product with id ${productId} does not exist`)

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

    ejs.renderFile('./src/views/product/edit.html', {productId: productId}, null, function(err, str){
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


// CARRITO CRUD
//CRUD - Products

//C - create
app.get('/catalogo', requireLogin, function(req, res){
    res.sendFile('catalogo.html', {root: './src/views/product/'});
});

app.get('/carrito', requireLogin, function(req, res){
    res.sendFile('catalogo.html', {root: './src/views/product/'});
});
 
app.route('/checkout/:id').get(async (req, res) => {
    let productId  = req.params.id;

    ejs.renderFile('./src/views/checkout.html', {productId: productId}, null, function(err, str){
        if (err) res.status(503).send(`error when rendering the view: ${err}`); 
        else {
            res.end(str);
        }
    });
});



app.listen(3000, () => console.log("express server ready and running"));