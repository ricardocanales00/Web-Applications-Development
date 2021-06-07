const express = require('express');
const app = express();

// npm install --save cors
// Why? check the post address, is it localhost or 127.0.0.1
const cors = require('cors');

// A map has a key and value interface
const resultCache = new Map();

app.use(express.json());
app.use(cors());

const axios = require('axios').default;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/queryForm', (req, res) => {
  res.sendFile("index.html", {'root': './'});
});

app.route('/pokemon').get(function (req, res) {

	let pok = req.query.txtName;
	let pokemonData;

	res.type('text');
	if (resultCache.has(pok)){
		console.log(`The pokemon ${pok} already exists in cache`);
		pokemonData = resultCache.get(pok);
		res.send(pokemonData);
	} else {
		console.log(`Pokemon: ${pok}, does not exist in cache, creating it...`);
		let prefixUrl = "https://pokeapi.co/api/v2/pokemon/"
		let URL = prefixUrl + pok;
		axios.get(URL)
		.then(pokemon_response => {
			pokemonData = pokemon_response.data;
			resultCache.set(pok, {id: pokemonData.id, name: pokemonData.name, height: pokemonData.height, weight: pokemonData.weight, ability: pokemonData.abilities[0].ability.name});
			res.send(pokemonData);
		}).catch(function(error){
			console.log(error);
			res.send('The pokemon does not exist')
		});
	}
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
});