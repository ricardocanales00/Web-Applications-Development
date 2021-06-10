let mongoose = require('mongoose')
let validator = require('validator')
// https://www.npmjs.com/package/validator

let carritoSchema = new mongoose.Schema({
  product: {type: String, required: [true, 'Product is required']},
  cantidad: { type: Number, min: 0, required: [true, 'Price is required']},
  user: {type: String, required: [true, 'Buyer is required']},
});

module.exports = mongoose.model('Carrito', carritoSchema);