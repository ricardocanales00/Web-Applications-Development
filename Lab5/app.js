const express = require('express');
const app = express();
app.use(express.json());

const axios = require('axios').default;

var PokemonModel;

// 1. Referencing Mongoose
const mongoose = require('mongoose');
// remove a warning
mongoose.set('useCreateIndex', true); 

// 2. Defining the schema
console.log("Defining the schema")
const pokemonSchema = new mongoose.Schema({
	pokemonName: {type: String, unique:true, required: [true, 'Name is required']},
    pokemonId: {type: Number, unique:true, required: true},
    pokemonHeight: {type: Number, min: 0, required: [true, 'Height is required']},
    pokemonWeight: {type: Number, min: 0, required: [true, 'Weight is required']},
    pokemonAbility: {type: String, required:[true, 'Name is required']}
});

// 3. Connecting with the database
const mongoDB = 'mongodb://localhost/pokemons';
mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true });

// Getting the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log('Connected to database server');
    initializeModel();
});

// 4. Create a model from a schema
function initializeModel(){
    console.log("Initializing the model")
    PokemonModel = mongoose.model('Pokemon', pokemonSchema);
}

app.get('/queryForm', (req, res) => {
  res.sendFile("index.html", {'root': './'});
});

app.route('/insertRandom').get(function(req, res){    
    // The problem was that I was invoking "movies/insertRandom", rather than "/insertRandom"
    let pokemon = new PokemonModel({
    			pokemonId: '1',
    			pokemonName: 'prueba',
    			pokemonHeight: '2',
    			pokemonWeight: '3',
    			pokemonAbility: 'abilidad prueba'}); 

    pokemon.save((err) => {
        if (err) res.status(503).end(`error: ${err}`); 
        else {
            // res.send({movieId: movie.movieId, title: movie.title, rating: movie.rating});
            res.send(pokemon);
        }
    });

});
    
app.route('/pokemon').get(async function(req, res){    
    let pok = req.query.txtName;

    let pokemonData;

	res.type('text');

	const query  = PokemonModel.where({ pokemonName: pok });
	query.findOne(function (err, search) {
		if (err) return handleError(err);
		if (search == null) {
			console.log(`Pokemon: ${pok}, does not exist in cache, creating it...`);
			let prefixUrl = "https://pokeapi.co/api/v2/pokemon/"
			let URL = prefixUrl + pok;
			axios.get(URL)
			.then(pokemon_response => {
				pokemonData = pokemon_response.data;

				let pokemon = new PokemonModel({
	    			pokemonId: pokemonData.id,
	    			pokemonName: pokemonData.name,
	    			pokemonHeight: pokemonData.height,
	    			pokemonWeight: pokemonData.weight,
	    			pokemonAbility: pokemonData.abilities[0].ability.name});
				pokemon.save((err) => {
					if (err) res.status(503).end(`error: ${err}`); 
					else {
						res.send(pokemonData);
					}
				});
			}).catch(function(error){
				console.log(error);
				res.send('The pokemon does not exist')
			});
		} else{
			console.log(`The pokemon ${pok} already exists in cache`);
			const query = PokemonModel.findOne({ 'pokemonName': pok});
			query.exec(function (err, pokemonData) {
				if (err) return handleError(err);
				// Prints "Space Ghost is a talk show host."
				console.log(pokemonData.pokemonAbility, pokemonData.pokemonWeight);
				res.send(pokemonData);
			});
			
		}
	});
});

// Read all
app.route('/list').get(async function(req, res){    
    let allPokemons = await PokemonModel.find();
    res.send(allPokemons);
});

const portNumber = 3000;
var server = app.listen(portNumber, function(){
    console.log('Express Server ready and running');
});