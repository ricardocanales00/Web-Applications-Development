const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios').default;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/queryForm', (req, res) => {
  res.sendFile("index.html", {'root': './'});
});

app.route('/pokemon').get(function (req, res) {
	let prefixUrl = "https://pokeapi.co/api/v2/pokemon/"
	let pok = req.query.txtName;
	let URL = prefixUrl + pok;

    axios.get(URL)
    .then(pokemon_response => {
    	let pokemonData = pokemon_response.data;
		res.send(pokemonData);
	}).catch(function(error){
		console.log(error);
		res.send('The pokemon does not exist')
	});
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
});